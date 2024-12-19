// /pages/api/friend-comparison.js
import { getAccessToken } from "@/lib/getAccessToken";
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { isMutualFriend } from "@/lib/isMutualFriend";

const fetchTopGenres = async (userId) => {
    try {
        const accessToken = await getAccessToken(userId);
        const res = await fetch(
            "https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=50",
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        if (!res.ok) throw new Error("Failed to fetch top artists");

        const data = await res.json();
        return data.items.flatMap((artist) => artist.genres);
    } catch (error) {
        console.error("Error fetching top genres:", error);
        return [];
    }
};

const calculateGenreMatch = (genres1, genres2) => {
    if (!genres1.length || !genres2.length) return 0;

    const uniqueGenres1 = new Set(genres1);
    const uniqueGenres2 = new Set(genres2);
    const intersection = [...uniqueGenres1].filter((genre) => uniqueGenres2.has(genre));

    return Math.round((intersection.length / Math.max(uniqueGenres1.size, uniqueGenres2.size)) * 100);
};

export default async function handler(req, res) {
    const { userId } = req.query;

    try {
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            return res.status(404).json({ error: "User not found" });
        }

        const allFriends = userDoc.data().friends || [];
        const mutualFriends = [];
        for (const friendId of allFriends) {
            if (await isMutualFriend(userId, friendId)) {
                mutualFriends.push(friendId);
            }
        }

        const userGenres = await fetchTopGenres(userId);

        const matches = await Promise.all(
            mutualFriends.map(async (friendId) => {
                const friendGenres = await fetchTopGenres(friendId);
                const matchPercentage = calculateGenreMatch(userGenres, friendGenres);

                const friendRef = doc(db, "users", friendId);
                const friendDoc = await getDoc(friendRef);
                const friendData = friendDoc.data();

                return {
                    friendId,
                    matchPercentage,
                    name: friendData.name || "Unknown",
                    image: friendData.image || "https://via.placeholder.com/150",
                };
            })
        );

        matches.sort((a, b) => b.matchPercentage - a.matchPercentage);
        res.status(200).json({ matches });
    } catch (error) {
        console.error("Error in friend comparison:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}