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

            const genreCounts = {};
            data.items.forEach((artist) => {
                artist.genres.forEach((genre) => {
                    genreCounts[genre] = (genreCounts[genre] || 0) + 1;
                });
            });

            const sortedGenres = Object.entries(genreCounts)
                .map(([genre, count]) => ({ genre, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 30);

            res.status(200).json({ topGenres: sortedGenres });
        } else {
            console.error("Failed to fetch top artists", response.statusText);
            res.status(response.status).json({ error: "Failed to fetch top artists" });
        }
    } catch (error) {
        console.error("Error fetching top genres:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}