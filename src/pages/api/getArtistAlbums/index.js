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

        const albumsResponse = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/albums`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const albums = albumsResponse.data.items.map((album) => ({
            albumId: album.id,
            albumName: album.name,
            albumImageUrl: album.images[0]?.url,
            albumReleaseDate: album.release_date,
            albumUrl: album.external_urls.spotify,
        }));

        res.status(200).json({ albums });
    } catch (error) {
        console.error("Error fetching artist albums:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch artist albums" });
    }
}