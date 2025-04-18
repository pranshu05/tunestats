import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/utils/db";

export async function GET(req: NextRequest) {
    const albumId = req.nextUrl.pathname.split("/").slice(-2, -1)[0];

    if (!albumId) {
        return new NextResponse("Missing query parameters", { status: 400 });
    }

    try {
        const tracks = await sql`
            SELECT "trackId"
            FROM tracks
            WHERE "albumId" = ${albumId}
        `;

        if (!tracks || tracks.length === 0) {
            return new NextResponse("No tracks found", { status: 404 });
        }

        const trackIds = tracks.map(track => track.trackId);

        const primaryArtist = await sql`
            SELECT DISTINCT ar.*
            FROM artists ar
            JOIN albums a ON ar."artistId" = a."artistId"
            WHERE a."albumId" = ${albumId}
        `;

        if (!primaryArtist || primaryArtist.length === 0) {
            return new NextResponse("No primary artists found", { status: 404 });
        }

        const featuredArtists = await sql`
            SELECT DISTINCT ar.*
            FROM artists ar
            JOIN "trackFeaturedArtists" tfa ON ar."artistId" = tfa."artistId"
            WHERE tfa."trackId" = ANY(${trackIds})
        `;

        const result = {
            primaryArtist: primaryArtist[0],
            featuredArtists: featuredArtists || []
        };

        return NextResponse.json(result, { status: 200 });

    } catch {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}