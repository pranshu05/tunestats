import { getAccessToken } from "@/lib/getAccessToken";
import axios from "axios";

export default async function handler(req, res) {
    const { userId, artistId } = req.body;

    if (!userId || !artistId) {
        return res.status(400).json({ error: "Missing userId or artistId" });
    }

    try {
        const token = await getAccessToken(userId);

        if (!token) {
            return res.status(401).json({ error: "Failed to retrieve access token" });
        }

        await axios.put(`https://api.spotify.com/v1/me/following`, null, {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                type: 'artist',
                ids: artistId
            }
        });

        res.status(204).end();
    } catch (error) {
        console.error("Error following artist:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to follow artist" });
    }
}