import { getAccessToken } from "@/lib/getAccessToken";
import axios from "axios";

export default async function handler(req, res) {
    const { userId, artistId } = req.query;

    if (!userId || !artistId) {
        return res.status(400).json({ error: "Missing userId or artistId" });
    }

    try {
        const token = await getAccessToken(userId);

        if (!token) {
            return res.status(401).json({ error: "Failed to retrieve access token" });
        }

        const response = await axios.get(`https://api.spotify.com/v1/me/following/contains`, {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                type: 'artist',
                ids: artistId
            }
        });

        const isFollowing = response.data[0];
        res.status(200).json({ isFollowing });
    } catch (error) {
        console.error("Error checking if user follows artist:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to check if user follows artist" });
    }
}