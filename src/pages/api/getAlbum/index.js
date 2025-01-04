import { getAccessToken } from "@/lib/getAccessToken";
import axios from "axios";

export default async function handler(req, res) {
    const { userId, albumId } = req.query;

    if (!userId || !albumId) {
        return res.status(400).json({ error: "Missing userId or albumId" });
    }

    try {
        const token = await getAccessToken(userId);

        if (!token) { return res.status(401).json({ error: "Failed to retrieve access token" }); }

        const albumResponse = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const albumDetails = {
            albumId: albumResponse.data.id,
            albumName: albumResponse.data.name,
            albumArtists: albumResponse.data.artists.map((artist) => ({
                id: artist.id,
                name: artist.name,
            })),
            albumPopularity: albumResponse.data.popularity,
            albumImageUrl: albumResponse.data.images[0]?.url || "",
            albumReleaseDate: albumResponse.data.release_date,
            albumTotalTracks: albumResponse.data.total_tracks,
            albumTotalDuration: albumResponse.data.tracks.items.reduce((acc, track) => acc + track.duration_ms, 0),
            albumSpotifyUrl: albumResponse.data.external_urls.spotify,
            albumTracks: albumResponse.data.tracks.items.map((track) => ({
                id: track.id,
                name: track.name,
            })),
        };

        res.status(200).json({
            album: albumDetails,
        });
    } catch (error) {
        console.error("Error fetching album details:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch album details" });
    }
}