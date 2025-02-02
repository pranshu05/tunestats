import { db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import dayjs from "dayjs";
import pLimit from "p-limit";
import axios from "axios";
import { getAccessToken } from "@/lib/getAccessToken";

const artistCache = new Map();

async function fetchTrackDetails(userId, trackId) {
    try {
        const token = await getAccessToken(userId);

        const trackResponse = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (trackResponse.status === 200) {
            const track = trackResponse.data;
            const artistId = track.artists[0].id;

            if (artistCache.has(artistId)) {
                return artistCache.get(artistId);
            }

            const artistResponse = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (artistResponse.status === 200) {
                const artist = artistResponse.data;
                const artistData = {
                    artistId: artist.id,
                    artistName: artist.name,
                    artistImage: artist.images?.[0]?.url || null,
                };

                artistCache.set(artistId, artistData);
                return artistData;
            }
        }
    } catch (error) {
        console.error(`Error fetching track details for ${trackId}:`, error);
    }
    return null;
}

export default async function handler(req, res) {
    const { userId, timeRange } = req.query;

    if (!userId) {
        return res.status(400).json({ error: "Missing userId" });
    }

    try {
        const now = dayjs();
        let startDate;

        if (timeRange === "week") {
            startDate = now.subtract(7, "days").valueOf();
        } else if (timeRange === "month") {
            startDate = now.subtract(1, "month").valueOf();
        } else if (timeRange === "year") {
            startDate = now.subtract(1, "year").valueOf();
        } else {
            return res.status(400).json({ error: "Invalid time range" });
        }

        const userRef = doc(db, "recentlyPlayed", userId);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            return res.status(404).json({ error: "No data found for this user" });
        }

        const userData = userDoc.data();
        const artistPlayCounts = {};
        const trackIdsToFetch = [];

        for (const trackId in userData) {
            const trackInfo = userData[trackId];

            if (trackInfo.timestamps.some((ts) => ts >= startDate)) {
                trackIdsToFetch.push({ trackId, playCount: trackInfo.playCount });
            }
        }

        if (trackIdsToFetch.length === 0) {
            return res.status(200).json({ topArtists: [] });
        }

        const limit = pLimit(10);
        const trackDetailsPromises = trackIdsToFetch.map(({ trackId, playCount }) =>
            limit(async () => {
                const trackData = await fetchTrackDetails(userId, trackId);
                return { trackData, playCount };
            })
        );

        const resolvedTracks = await Promise.all(trackDetailsPromises);

        for (const { trackData, playCount } of resolvedTracks) {
            if (!trackData) continue;

            const { artistId, artistName, artistImage } = trackData;

            if (!artistPlayCounts[artistId]) {
                artistPlayCounts[artistId] = {
                    artistId,
                    artistName,
                    artistImage,
                    playCount: 0,
                };
            }

            artistPlayCounts[artistId].playCount += playCount;
        }

        const topArtists = Object.values(artistPlayCounts)
            .sort((a, b) => b.playCount - a.playCount)
            .slice(0, 50);

        res.status(200).json({ topArtists });
    } catch (error) {
        console.error("Error fetching top artists:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}