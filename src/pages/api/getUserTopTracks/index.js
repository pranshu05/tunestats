import { db } from "@/lib/firebaseConfig";
import { getAccessToken } from "@/lib/getAccessToken";
import { doc, getDoc } from "firebase/firestore";
import dayjs from "dayjs";

export default async function handler(req, res) {
    const { userId, timeRange } = req.query;

    if (!userId || !timeRange) {
        return res.status(400).json({ error: "Missing userId or timeRange" });
    }

    try {
        const now = dayjs()
        let startDate;

        if (timeRange === "week") {
            startDate = now.subtract(7, "day").valueOf();
        } else if (timeRange === "month") {
            startDate = now.subtract(1, "month").valueOf();
        } else if (timeRange === "year") {
            startDate = now.subtract(1, "year").valueOf();
        } else {
            return res.status(400).json({ error: "Invalid timeRange" });
        }

        const userRef = doc(db, "recentlyPlayed", userId);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            return res.status(200).json({ topTracks: [] });
        }

        const recentTracks = userDoc.data();

        let trackStats = [];

        for (const trackId in recentTracks) {
            const { playCount, timestamps } = recentTracks[trackId];

            const validPlays = timestamps.filter((timestamp) => timestamp >= startDate);

            if (validPlays.length > 0) {
                trackStats.push({
                    trackId,
                    playCount: validPlays.length,
                    timestamps: validPlays,
                });
            }
        }

        trackStats.sort((a, b) => b.playCount - a.playCount);

        const token = await getAccessToken(userId);

        const detailedTracks = await Promise.all(
            trackStats.slice(0, 50).map(async ({ trackId, playCount }) => {
                const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) return null;

                const trackData = await response.json();
                return {
                    trackId: trackData.id,
                    trackName: trackData.name,
                    trackArtists: trackData.artists.map((artist) => artist.name).join(", "),
                    trackAlbum: trackData.album.name,
                    trackAlbumImage: trackData.album.images[0].url,
                    playCount,
                };
            })
        );

        const topTracks = detailedTracks.filter((track) => track !== null);

        return res.status(200).json({ topTracks });
    } catch (error) {
        console.error("Error fetching top tracks from Firestore:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}