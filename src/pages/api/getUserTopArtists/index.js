import { getAccessToken } from "@/lib/getAccessToken";

export default async function handler(req, res) {
    const { userId, timeRange } = req.query;

    try {
        const accessToken = await getAccessToken(userId);

        const response = await fetch(
            `https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=50`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        if (response.ok) {
            const data = await response.json();
            const topArtists = data.items.map((artist) => ({
                id: artist.id,
                name: artist.name,
                genres: artist.genres.slice(0, 2).join(", "),
                url: artist.external_urls.spotify,
                image: artist.images[0]?.url,
            }))
            res.status(200).json({ topArtists});
        } else {
            console.error("Failed to fetch top artists", response.statusText);
            res.status(response.status).json({ error: "Failed to fetch top artists" });
        }
    } catch (error) {
        console.error("Error fetching top artists:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}