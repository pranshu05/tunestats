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

        const tracksResponse = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const tracks = tracksResponse.data.tracks.map((track) => ({
            trackId: track.id,
            trackName: track.name,
            trackAlbum: track.album.name,
            trackAlbumImageUrl: track.album.images[0]?.url,
            trackUrl: track.external_urls.spotify,
        }));

        res.status(200).json({ tracks });
    } catch (error) {
        console.error("Error fetching artist top tracks:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch artist top tracks" });
    }
}