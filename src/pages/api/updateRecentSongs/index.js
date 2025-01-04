import { getAccessToken } from "@/lib/getAccessToken";
import { db } from "@/lib/firebaseConfig";
import { fetchAllUserIds } from "@/lib/fetchUserIds";
import { doc, setDoc, getDoc } from "firebase/firestore";
import pLimit from "p-limit";

async function fetchUserRecentlyPlayed(userId) {
    try {
        const token = await getAccessToken(userId);

        const response = await fetch(
            `https://api.spotify.com/v1/me/player/recently-played?limit=1`,
            { headers: { Authorization: `Bearer ${token}` }, }
        );

        if (!response.ok) {
            console.error(`Error fetching recently played for user ${userId}:`, response.statusText);
            return null;
        }

        const data = await response.json();
        if (data.items.length === 0) return null;

        const latestTrack = data.items[0];
        return {
            trackId: latestTrack.track.id,
            playedAt: new Date(latestTrack.played_at).getTime(),
        };
    } catch (error) {
        console.error(`Error fetching recently played for user ${userId}:`, error);
        return null;
    }
}

async function updateUserRecentSongs(userId, trackData) {
    if (!trackData) return;

    const userRef = doc(db, "recentlyPlayed", userId);
    const userDoc = await getDoc(userRef);
    const { trackId, playedAt } = trackData;

    let shouldAddNewTrack = true;

    if (userDoc.exists()) {
        const userData = userDoc.data();
        const latestTimestamp = Object.values(userData)
            .flatMap((entry) => entry.timestamps)
            .reduce((max, timestamp) => Math.max(max, timestamp), 0);

        if (playedAt <= latestTimestamp) {
            shouldAddNewTrack = false;
        }
    }

    if (shouldAddNewTrack) {
        let updatedData = {
            [trackId]: {
                playCount: 1,
                timestamps: [playedAt],
            },
        };

        if (userDoc.exists()) {
            const userData = userDoc.data();
            const trackEntry = userData[trackId];

            if (trackEntry) {
                updatedData = {
                    ...userData,
                    [trackId]: {
                        playCount: trackEntry.playCount + 1,
                        timestamps: [...trackEntry.timestamps, playedAt],
                    },
                };
            } else {
                updatedData = {
                    ...userData,
                    [trackId]: {
                        playCount: 1,
                        timestamps: [playedAt],
                    },
                };
            }
        }

        await setDoc(userRef, updatedData, { merge: true });
    }
}

export default async function handler(req, res) {
    try {
        const userIds = await fetchAllUserIds();
        const limit = pLimit(10);

        const tasks = userIds.map((userId) =>
            limit(async () => {
                const trackData = await fetchUserRecentlyPlayed(userId);
                await updateUserRecentSongs(userId, trackData);
            })
        );

        await Promise.all(tasks);
        res.status(200).json({ message: "Updated recent songs for all users." });
    } catch (error) {
        console.error("Error updating recent songs:", error);
        res.status(500).json({ error: "Failed to update recent songs." });
    }
}