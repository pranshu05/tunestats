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

        const artistResponse = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const artistDetails = {
            artistId: artistResponse.data.id,
            artistName: artistResponse.data.name,
            artistGenres: artistResponse.data.genres,
            artistPopularity: artistResponse.data.popularity,
            artistFollowers: artistResponse.data.followers?.total,
            artistImageUrl: artistResponse.data.images?.[0]?.url,
            artistUrl: artistResponse.data.external_urls?.spotify,
        };

        res.status(200).json({ artist: artistDetails });
    } catch (error) {
        const statusCode = error.response?.status || 500;
        const errorMessage = error.response?.data?.error?.message || "Failed to fetch artist details";

        console.error("Error fetching artist details:", {
            message: errorMessage,
            status: statusCode,
        });

        res.status(statusCode).json({ error: errorMessage });
    }
}