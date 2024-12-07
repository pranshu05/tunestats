import { db } from "@/lib/firebaseConfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { getAccessToken } from "@/lib/getAccessToken";
import axios from "axios";

export default async function handler(req, res) {
    try {
        const usersCollection = collection(db, "users");

        const usersSnapshot = await getDocs(usersCollection);
        const users = usersSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        let updateMessage = [];

        for (const user of users) {
            const { id: userId, lastUpdated, points = 0 } = user;
            const token = await getAccessToken(userId);

            if (!token) {
                return res.status(400).json({ error: "Unable to fetch access token" });
            }

            const currentTimestamp = Date.now();
            if (lastUpdated && currentTimestamp - lastUpdated < 60 * 60 * 1000) {
                updateMessage.push(`User ${userId}'s points were already updated within the last hour.`);
                continue;
            }

            const oneHourAgo = currentTimestamp - 1 * 60 * 60 * 1000;

            const response = await axios.get(`https://api.spotify.com/v1/me/player/recently-played?after=${oneHourAgo}&limit=50`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const tracksPlayed = response.data.items.length;

            const userDocRef = doc(db, "users", userId);
            await updateDoc(userDocRef, {
                points: points + tracksPlayed,
                lastUpdated: currentTimestamp,
            });

            updateMessage.push(`User ${userId}'s points have been successfully updated.`);
        }

        res.status(200).json({
            message: "Points update process completed.",
            details: updateMessage,
        });
    } catch (error) {
        console.error("Error updating points:", error);
        res.status(500).json({ error: "Error updating points" });
    }
}