import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/utils/db";

export async function GET(req: NextRequest) {
    const trackId = req.nextUrl.pathname.split("/").slice(-2, -1)[0];

    if (!trackId) {
        return new NextResponse("Missing query parameters", { status: 400 });
    }

    try {
        const primaryArtist = await sql`
            SELECT t."trackId", ar.*
            FROM tracks t
            JOIN artists ar ON t."artistId" = ar."artistId"
            WHERE t."trackId" = ${trackId}
        `;

        if (!primaryArtist || primaryArtist.length === 0) {
            return new NextResponse("No artist found", { status: 404 });
        }

        const featuredArtists = await sql`
            SELECT ar.*
            FROM "trackFeaturedArtists" tf
            JOIN artists ar ON tf."artistId" = ar."artistId"
            WHERE tf."trackId" = ${trackId}
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