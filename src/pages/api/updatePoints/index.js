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

        for (const user of users) {
            const { id: userId } = user;
            const token = await getAccessToken(userId);

            if (!token) {return res.status(400).json({ error: "Unable to fetch access token" });}

            const sixHoursAgo = Date.now() - 6 * 60 * 60 * 1000;

            const response = await axios.get(`https://api.spotify.com/v1/me/player/recently-played?after=${sixHoursAgo}`,{headers: {Authorization: `Bearer ${token}`,},});
            const tracksPlayed = response.data.items.length;

            const userDocRef = doc(db, "users", userId);
            await updateDoc(userDocRef, {
                points: (user.points || 0) + tracksPlayed,
            });
        }

        res.status(200).json({ message: "Points updated successfully!" });
    } catch (error) {
        console.error("Error updating points:", error);
        res.status(500).json({ error: "Error updating points" });
    }
}