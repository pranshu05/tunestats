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
            res.status(200).json(data);
        } else {
            res.status(response.status).json({ error: "Failed to fetch currently playing" });
        }
    } catch (error) {
        console.error("Error fetching currently playing track:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}