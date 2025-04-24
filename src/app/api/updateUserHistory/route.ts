"use server";
import { getAccessTokenFromUserId } from '@/utils/getAccessToken';
import { NextRequest, NextResponse } from 'next/server';
import { sql } from "@/utils/db";

const CONCURRENT_USER_LIMIT = 5;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') ?? '1');
        const forceRefresh = searchParams.get('forceRefresh') === 'true';

        const users = await sql`SELECT "userId" FROM users`;
        if (users.length === 0) {
            return NextResponse.json("No users found", { status: 404 });
        }

        const userChunks = chunkArray(users, CONCURRENT_USER_LIMIT);
        const artistCache = new Map();
        const albumCache = new Map();

        for (const chunk of userChunks) {
            await Promise.allSettled(chunk.map(({ userId }) =>
                processUser(userId, limit, forceRefresh, artistCache, albumCache)
            ));
        }

        return NextResponse.json({ success: true, processedUsers: users.length }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

function chunkArray<T>(arr: T[], size: number): T[][] {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
}

async function processUser(userId: string, limit: number, forceRefresh: boolean, artistCache: Map<string, boolean>, albumCache: Map<string, boolean>) {
    const accessToken = await getAccessTokenFromUserId(userId);
    if (!accessToken) return;

    const response = await fetch(`https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: forceRefresh ? 'no-store' : 'default'
    });

    if (!response.ok) return;
    const { items } = await response.json();
    if (!items || !items.length) return;

    for (const item of items) {
        const { played_at, track } = item;
        const { id: trackId, artists, album } = track;
        const primaryArtist = artists[0];
        const featuredArtists = artists.slice(1);

        if (!forceRefresh) {
            const exists = await sql`
                SELECT 1 FROM "trackHistory" WHERE "userId" = ${userId} AND "trackId" = ${trackId} AND timestamp = ${played_at} LIMIT 1
            `;
            if (exists.length) continue;
        }

        await insertArtist(primaryArtist, accessToken, artistCache);
        await insertAlbum(album, primaryArtist.id, accessToken, albumCache);
        await insertTrack(track, album.id, primaryArtist.id);

        for (const fa of featuredArtists) {
            await insertArtist(fa, accessToken, artistCache);
            await sql`
                INSERT INTO "trackFeaturedArtists" ("trackId", "artistId")
                VALUES (${trackId}, ${fa.id}) ON CONFLICT DO NOTHING
            `;
        }

        await sql`
            INSERT INTO "trackHistory" ("trackId", "userId", "artistId", timestamp)
            VALUES (${trackId}, ${userId}, ${primaryArtist.id}, ${played_at})
        `;
    }
}

interface Artist {
    id: string;
    name: string;
    genres?: string[];
    images?: { url: string }[];
}

async function insertArtist(artist: Artist, accessToken: string, cache: Map<string, boolean>) {
    if (cache.has(artist.id)) return;

    const exists = await sql`SELECT 1 FROM artists WHERE "artistId" = ${artist.id} LIMIT 1`;
    if (exists.length) {
        cache.set(artist.id, true);
        return;
    }

    const res = await fetch(`https://api.spotify.com/v1/artists/${artist.id}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!res.ok) return;
    const data = await res.json();
    await sql`
        INSERT INTO artists ("artistId", name, genres, "imageUrl")
        VALUES (${data.id}, ${data.name}, ${data.genres}, ${data.images?.[0]?.url ?? null})
    `;
    cache.set(artist.id, true);
}

interface Album {
    id: string;
    name: string;
    release_date: string;
    album_type: string;
    label?: string;
    images?: { url: string }[];
}

async function insertAlbum(album: Album, artistId: string, accessToken: string, cache: Map<string, boolean>) {
    if (cache.has(album.id)) return;

    const exists = await sql`SELECT 1 FROM albums WHERE "albumId" = ${album.id} LIMIT 1`;
    if (exists.length) {
        cache.set(album.id, true);
        return;
    }

    const res = await fetch(`https://api.spotify.com/v1/albums/${album.id}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!res.ok) return;
    const data = await res.json();

    let releaseDate = data.release_date;
    if (/^\d{4}$/.test(releaseDate)) releaseDate += "-01-01";
    else if (/^\d{4}-\d{2}$/.test(releaseDate)) releaseDate += "-01";

    await sql`
        INSERT INTO albums ("albumId", name, "artistId", "releaseDate", "albumType", label, "imageUrl")
        VALUES (
            ${data.id}, ${data.name}, ${artistId}, ${releaseDate},
            ${data.album_type}, ${data.label}, ${data.images?.[0]?.url ?? null}
        )
    `;
    cache.set(album.id, true);
}

interface Track {
    id: string;
    name: string;
    duration_ms: number;
    explicit: boolean;
}

async function insertTrack(track: Track, albumId: string, artistId: string) {
    const exists = await sql`SELECT 1 FROM tracks WHERE "trackId" = ${track.id} LIMIT 1`;
    if (exists.length) return;

    await sql`
        INSERT INTO tracks ("trackId", name, "albumId", "artistId", duration, explicit)
        VALUES (
            ${track.id}, ${track.name}, ${albumId},
            ${artistId}, ${track.duration_ms}, ${track.explicit}
        )
    `;
}