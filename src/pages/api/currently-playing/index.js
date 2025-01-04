import { getAccessToken } from "@/lib/getAccessToken";

export default async function handler(req, res) {
    const { userId } = req.query;

    try {
        const accessToken = await getAccessToken(userId);

        const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (response.ok) {
            const data = await response.json();
            const progressPercent = (data.progress_ms / (data.item.duration_ms || 1)) * 100;
            const currentlyPlaying = {
                id: data.item.id,
                title: data.item.name,
                artist: data.item.artists.map((artist) => artist.name).join(", "),
                album: data.item.album.name,
                image: data.item.album.images[0]?.url,
                progressPercent: progressPercent,
                is_playing: data.is_playing,
            };
            res.status(200).json(currentlyPlaying);
        } else {
            res.status(response.status).json({ error: "Failed to fetch currently playing" });
        }
    } catch (error) {
        console.error("Error fetching currently playing track:", error);
        res.status(500).json({ error: "Internal Server Error" }); 
    }
}