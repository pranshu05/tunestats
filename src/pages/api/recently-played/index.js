import { getAccessToken } from "@/lib/getAccessToken";

export default async function handler(req, res) {
    const { userId } = req.query;

    try {
        const accessToken = await getAccessToken(userId);

        const response = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=50", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (response.ok) {
            const data = await response.json();
            const recentSongs = data.items.map((item) => ({
                id: item.track.id,
                title: item.track.name,
                artist: item.track.artists.map((artist) => artist.name).join(", "),
                album: item.track.album.name,
                image: item.track.album.images[0]?.url,
                songUrl: item.track.external_urls.spotify,
                played_at: item.played_at,
            }));
            res.status(200).json({ recentSongs });
        } else {
            console.error("Failed to fetch recently played songs", response.statusText);
            res.status(response.status).json({ error: "Failed to fetch recently played songs" });
        }
    } catch (error) {
        console.error("Error fetching recently played songs:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}