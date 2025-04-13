import axios from 'axios';
import { sql } from '@/utils/db';

export async function getAccessTokenFromUserId(userId: string): Promise<string | null> {
    const result = await sql`SELECT "refreshToken" FROM "users" WHERE "userId" = ${userId}`;
    const refreshToken = result[0]?.refreshToken;
    if (!refreshToken) return null;

    try {
        const response = await axios.post("https://accounts.spotify.com/api/token", null, {
            params: {
                grant_type: "refresh_token",
                refresh_token: refreshToken,
                client_id: process.env.SPOTIFY_CLIENT_ID,
                client_secret: process.env.SPOTIFY_CLIENT_SECRET,
            },
        });

        const accessToken = response.data.access_token;
        return accessToken;
    } catch {
        return null;
    }
}