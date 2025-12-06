import axios from 'axios';
import { sql } from '@/utils/db';

export async function getAccessTokenFromUserId(userId: string): Promise<string | null> {
    try {
        if (!userId || typeof userId !== 'string' || userId.trim() === '') {
            return null;
        }

        const result = await sql`
            SELECT "refreshToken" FROM "users" WHERE "userId" = ${userId}
            LIMIT 1
        `;

        const refreshToken = result[0]?.refreshToken;
        if (!refreshToken) return null;

        if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
            throw new Error('Missing Spotify credentials in environment variables');
        }

        const response = await axios.post(
            "https://accounts.spotify.com/api/token",
            new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: refreshToken,
                client_id: process.env.SPOTIFY_CLIENT_ID,
                client_secret: process.env.SPOTIFY_CLIENT_SECRET,
            }),
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', },
                timeout: 10000,
            }
        );

        const accessToken = response.data.access_token;
        return accessToken || null;
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('[getAccessToken] Error:', error);
        }
        return null;
    }
}