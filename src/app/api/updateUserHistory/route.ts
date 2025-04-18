"use server";
import { getAccessTokenFromUserId } from '@/utils/getAccessToken';
import { NextRequest, NextResponse } from 'next/server';
import { sql } from "@/utils/db";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limitParam = searchParams.get('limit');
        const forceRefresh = searchParams.get('forceRefresh') === 'true';

        const users = await sql`SELECT "userId" FROM users`;

        if (users.length === 0) {
            return NextResponse.json("No users found matching criteria", { status: 404 });
        }

        for (const { userId } of users) {
            const accessToken = await getAccessTokenFromUserId(userId);
            if (!accessToken) {
                continue;
            }

            const limit = limitParam ? parseInt(limitParam) : 1;
            const spotifyResponse = await fetch(
                `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    cache: forceRefresh ? 'no-store' : 'default'
                }
            );

            if (!spotifyResponse.ok) {
                continue;
            }

            const spotifyData = await spotifyResponse.json();
            const items = spotifyData.items;

            if (!items || items.length === 0) {
                continue;
            }

            for (const item of items) {
                const { played_at, track } = item;
                const { id: trackId, artists, album } = track;
                const primaryArtist = artists[0];
                const featuredArtists = artists.slice(1);

                if (!forceRefresh) {
                    const existingHistory = await sql`
                        SELECT 1 FROM "trackHistory"
                        WHERE "userId" = ${userId} AND "trackId" = ${trackId} AND timestamp = ${played_at}
                        LIMIT 1
                    `;
                    if (existingHistory.length > 0) {
                        continue;
                    }
                }

                const artistExists = await sql`
                    SELECT 1 FROM artists WHERE "artistId" = ${primaryArtist.id} LIMIT 1
                `;
                if (!artistExists.length) {
                    const artistResponse = await fetch(
                        `https://api.spotify.com/v1/artists/${primaryArtist.id}`,
                        {
                            headers: { Authorization: `Bearer ${accessToken}` }
                        }
                    );

                    if (!artistResponse.ok) {
                        continue;
                    }

                    const artistData = await artistResponse.json();

                    await sql`
                        INSERT INTO artists ("artistId", name, genres, "imageUrl") 
                        VALUES (
                            ${artistData.id},
                            ${artistData.name},
                            ${artistData.genres},
                            ${artistData.images?.[0]?.url ?? null}
                        )
                    `;
                }

                for (const featuredArtist of featuredArtists) {
                    const featuredArtistExists = await sql`
                        SELECT 1 FROM artists WHERE "artistId" = ${featuredArtist.id} LIMIT 1
                    `;

                    if (!featuredArtistExists.length) {
                        const artistResponse = await fetch(
                            `https://api.spotify.com/v1/artists/${featuredArtist.id}`,
                            {
                                headers: { Authorization: `Bearer ${accessToken}` }
                            }
                        );

                        if (!artistResponse.ok) {
                            continue;
                        }

                        const artistData = await artistResponse.json();

                        await sql`
                            INSERT INTO artists ("artistId", name, genres, "imageUrl") 
                            VALUES (
                                ${artistData.id},
                                ${artistData.name},
                                ${artistData.genres},
                                ${artistData.images?.[0]?.url ?? null}
                            )
                        `;
                    }

                    await sql`
                        INSERT INTO "trackFeaturedArtists" ("trackId", "artistId")
                        VALUES (${trackId}, ${featuredArtist.id})
                        ON CONFLICT ("trackId", "artistId") DO NOTHING
                    `;
                }

                const albumExists = await sql`
                    SELECT 1 FROM albums WHERE "albumId" = ${album.id} LIMIT 1
                `;
                if (!albumExists.length) {
                    const albumResponse = await fetch(
                        `https://api.spotify.com/v1/albums/${album.id}`,
                        {
                            headers: { Authorization: `Bearer ${accessToken}` }
                        }
                    );

                    if (!albumResponse.ok) {
                        continue;
                    }

                    const albumData = await albumResponse.json();

                    let releaseDate = albumData.release_date;
                    if (/^\d{4}$/.test(releaseDate)) {
                        releaseDate = `${releaseDate}-01-01`;
                    } else if (/^\d{4}-\d{2}$/.test(releaseDate)) {
                        releaseDate = `${releaseDate}-01`;
                    }

                    await sql`
                        INSERT INTO albums ("albumId", name, "artistId", "releaseDate", "albumType", label, "imageUrl")
                        VALUES (
                            ${albumData.id},
                            ${albumData.name},
                            ${primaryArtist.id}, 
                            ${releaseDate},
                            ${albumData.album_type},
                            ${albumData.label},
                            ${albumData.images?.[0]?.url ?? null}
                        )
                    `;
                }

                const trackExists = await sql`
                    SELECT 1 FROM tracks WHERE "trackId" = ${trackId} LIMIT 1
                `;
                if (!trackExists.length) {
                    await sql`
                        INSERT INTO tracks ("trackId", name, "albumId", "artistId", duration, explicit) 
                        VALUES (
                            ${trackId},
                            ${track.name},
                            ${album.id},
                            ${primaryArtist.id},
                            ${track.duration_ms},
                            ${track.explicit}
                        )
                    `;
                }

                await sql`
                    INSERT INTO "trackHistory" ("trackId", "userId", "artistId", timestamp) 
                    VALUES (${trackId}, ${userId}, ${primaryArtist.id}, ${played_at})
                `;
            }
        }

        return NextResponse.json({ success: true, processedUsers: users.length, message: 'Data processed successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}