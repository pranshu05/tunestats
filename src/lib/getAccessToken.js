import axios from "axios";
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export async function getAccessToken(userId) {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
        throw new Error("User not found");
    }

    const { refreshToken } = userDoc.data(); 
    if (!refreshToken) {
        throw new Error("No refresh token found for the user");
    }

    try {
        const response = await axios.post("https://accounts.spotify.com/api/token", null, {
            params: {
                grant_type: "refresh_token",
                refresh_token: refreshToken,
                client_id: process.env.SPOTIFY_CLIENT_ID,
                client_secret: process.env.SPOTIFY_CLIENT_SECRET,
            },
        });

        const accessToken = response.data.access_token;

        return accessToken;
    } catch (error) {
        console.error("Error refreshing Spotify access token:", error.response?.data || error.message);
        throw new Error("Failed to refresh access token");
    }
}