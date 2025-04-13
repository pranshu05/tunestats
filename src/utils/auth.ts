import SpotifyProvider from 'next-auth/providers/spotify';
import { sql } from '@/utils/db';
import type { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
    providers: [
        SpotifyProvider({
            clientId: process.env.SPOTIFY_CLIENT_ID!,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
            authorization: {
                url: 'https://accounts.spotify.com/authorize',
                params: {
                    scope: [
                        'user-read-email',
                        'user-read-private',
                        'user-read-recently-played',
                        'user-top-read',
                        'user-library-read',
                        'user-read-playback-state',
                        'user-modify-playback-state',
                        'user-read-currently-playing',
                        'playlist-read-private',
                        'playlist-read-collaborative',
                    ].join(' '),
                },
            },
            profile(profile) {
                return {
                    id: profile.id,
                    name: profile.display_name,
                    email: profile.email,
                    image: profile.images?.[0]?.url ?? null,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account, user }) {
            if (account && user) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.userId = account.providerAccountId as string;

                await sql`
                    INSERT INTO "users" ("userId", "email", "name", "accountType", "refreshToken", "image")
                    VALUES (
                        ${account.providerAccountId},
                        ${user.email},
                        ${user.name},
                        'public',
                        ${account.refresh_token},
                        ${user.image ?? null}
                    )
                    ON CONFLICT ("userId") DO UPDATE SET
                        "email" = EXCLUDED.email,
                        "name" = EXCLUDED.name,
                        "accountType" = EXCLUDED."accountType",
                        "refreshToken" = EXCLUDED."refreshToken",
                        "image" = EXCLUDED.image
                `;
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user && token.userId) {
                session.user.id = token.userId as string;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};