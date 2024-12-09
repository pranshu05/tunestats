import { db } from "@/lib/firebaseConfig";
import { collection, getDocs, query, limit, startAfter, orderBy, writeBatch } from "firebase/firestore";
import { getAccessToken } from "@/lib/getAccessToken";
import axios from "axios";
import pLimit from "p-limit";

const BATCH_SIZE = 50;
const CONCURRENT_REQUESTS = 10;

export default async function handler(req, res) {
    try {
        const usersCollection = collection(db, "users");
        let lastVisible = null;
        let totalProcessed = 0;
        const limitConcurrency = pLimit(CONCURRENT_REQUESTS);

        do {
            const usersQuery = lastVisible
                ? query(usersCollection, orderBy("__name__"), startAfter(lastVisible), limit(BATCH_SIZE))
                : query(usersCollection, orderBy("__name__"), limit(BATCH_SIZE));

            const usersSnapshot = await getDocs(usersQuery);
            if (usersSnapshot.empty) break;

            const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const batch = writeBatch(db);

            const updatePromises = users.map(user =>
                limitConcurrency(async () => {
                    const { id: userId, lastUpdated, points = 0 } = user;
                    const currentTimestamp = Date.now();

                    if (lastUpdated && currentTimestamp - lastUpdated < 60 * 60 * 1000) {
                        return;
                    }

                    const token = await getAccessToken(userId);
                    if (!token) return;

                    const oneHourAgo = currentTimestamp - 1 * 60 * 60 * 1000;

                    let response;
                    for (let attempt = 1; attempt <= 3; attempt++) {
                        try {
                            response = await axios.get(`https://api.spotify.com/v1/me/player/recently-played?after=${oneHourAgo}&limit=50`, { headers: { Authorization: `Bearer ${token}` } });
                            break;
                        } catch (err) {
                            if (attempt === 3 || err.response?.status !== 429) throw err;
                            await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
                        }
                    }

                    const tracksPlayed = response?.data?.items?.length || 0;

                    const userDocRef = doc(db, "users", userId);
                    batch.update(userDocRef, {
                        points: points + tracksPlayed,
                        lastUpdated: currentTimestamp,
                    });
                })
            );

            await Promise.all(updatePromises);
            await batch.commit();

            totalProcessed += users.length;
            lastVisible = usersSnapshot.docs[usersSnapshot.docs.length - 1];
        } while (lastVisible);

        res.status(200).json({
            message: "Points update process completed.",
            totalProcessed,
        });
    } catch (error) {
        console.error("Error updating points:", error);
        res.status(500).json({ error: "Error updating points" });
    }
}