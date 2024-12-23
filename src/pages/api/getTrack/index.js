import { getAccessToken } from "@/lib/getAccessToken";
import axios from "axios";

export default async function handler(req, res) {
    const { userId, trackId } = req.query;

    if (!userId || !trackId) {
        return res.status(400).json({ error: "Missing userId or trackId" });
    }

    try {
        const token = await getAccessToken(userId);

        if (!token) {return res.status(401).json({ error: "Failed to retrieve access token" });}

        const trackResponse = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const trackDetails = {
            trackId: trackResponse.data.id,
            trackName: trackResponse.data.name,
            trackArtists: trackResponse.data.artists.map((artist) => artist.name).join(", "),
            trackArtistId: trackResponse.data.artists[0].id,
            trackAlbum: trackResponse.data.album.name,
            trackAlbumImageUrl: trackResponse.data.album.images[0].url,
            trackAlbumId: trackResponse.data.album.id,
            trackDuration: trackResponse.data.duration_ms,
            trackUrl: trackResponse.data.external_urls.spotify,
            trackPopularity: trackResponse.data.popularity,
        }

        res.status(200).json({
            track: trackDetails,
        });
    } catch (error) {
        console.error("Error fetching track details:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch track details" });
    }
}