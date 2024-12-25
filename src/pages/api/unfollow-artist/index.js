import { getAccessToken } from "@/lib/getAccessToken";

export default async function handler(req, res) {
    const { userId, artistId } = req.body;

    if (!userId || !artistId) {
        return res.status(400).json({ error: "Missing userId or artistId" });
    }

    try {
        const token = await getAccessToken(userId);

        if (!token) {
            return res.status(401).json({ error: "Failed to retrieve access token" });
        }

        const response = await fetch(`https://api.spotify.com/v1/me/following?type=artist&ids=${artistId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.ok) {
            res.status(204).end();
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error.message);
        }
    } catch (error) {
        console.error("Error unfollowing artist:", error.message);
        res.status(500).json({ error: "Failed to unfollow artist" });
    }
}