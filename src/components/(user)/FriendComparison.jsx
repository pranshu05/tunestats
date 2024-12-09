/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { isMutualFriend } from "@/lib/isMutualFriend";
import { getAccessToken } from "@/lib/getAccessToken";
import { db } from "@/lib/firebaseConfig";
import FriendMatchCard from "./FriendMatchCard";

export default function FriendComparison({ userId }) {
    const [friends, setFriends] = useState([]);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTopGenres = async (userId) => {
        try {
            const accessToken = await getAccessToken(userId);
            const res = await fetch("https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=50", {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

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

    useEffect(() => {
        const fetchFriends = async () => {
            setLoading(true);
            try {
                const userRef = doc(db, "users", userId);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const allFriends = userDoc.data().friends || [];

                    const mutualFriends = [];
                    for (const friendId of allFriends) {
                        const isMutual = await isMutualFriend(userId, friendId);
                        if (isMutual) {
                            mutualFriends.push(friendId);
                        }
                    }
                    setFriends(mutualFriends);
                }
            } catch (error) {
                console.error("Error fetching friends:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFriends();
    }, [userId]);

    useEffect(() => {
        if (!friends.length) return;

        const fetchMatches = async () => {
            setLoading(true);
            try {
                const userGenres = await fetchTopGenres(userId);
                const results = await Promise.all(
                    friends.map(async (friendId) => {
                        const friendGenres = await fetchTopGenres(friendId);
                        const matchPercentage = calculateGenreMatch(userGenres, friendGenres);
                        return { friendId, matchPercentage };
                    })
                );

                results.sort((a, b) => b.matchPercentage - a.matchPercentage);
                setMatches(results);
            } catch (error) {
                console.error("Error fetching matches:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, [friends, userId]);

    return (
        <div className="flex flex-col items-center p-3 gap-3 bg-[#121212] rounded-md w-full lg:w-2/3">
            <h2 className="text-2xl font-bold text-center">Friends Music Matches</h2>
            <div className="w-full">
                <h3 className="text-xl font-bold text-[#1DB954] mb-4">Top 3 Matches</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {matches.slice(0, 3).map(({ friendId, matchPercentage }) => (
                        <FriendMatchCard key={friendId} friendId={friendId} matchPercentage={matchPercentage} />
                    ))}
                </div>
            </div>
            {matches.length > 3 && (
                <div className="w-full">
                    <h3 className="text-xl font-bold mb-4">Other Matches</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {matches.slice(3).map(({ friendId, matchPercentage }) => (
                            <FriendMatchCard key={friendId} friendId={friendId} matchPercentage={matchPercentage} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}