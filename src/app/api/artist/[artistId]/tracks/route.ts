import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/utils/db";

export async function GET(req: NextRequest) {
    const artistId = req.nextUrl.pathname.split("/").slice(-2, -1)[0];

    if (!artistId) {
        return new NextResponse("Missing query parameters", { status: 400 });
    }

    try {
        const primaryTracks = await sql`
            SELECT tracks.*, albums."imageUrl", true AS "isPrimaryArtist"
            FROM tracks 
            JOIN albums ON tracks."albumId" = albums."albumId"
            WHERE tracks."artistId" = ${artistId}
        `;

        const featuredTracks = await sql`
            SELECT t.*, a."imageUrl", false AS "isPrimaryArtist"
            FROM "trackFeaturedArtists" tf
            JOIN tracks t ON tf."trackId" = t."trackId"
            JOIN albums a ON t."albumId" = a."albumId"
            WHERE tf."artistId" = ${artistId}
        `;

        const allTracks = [...primaryTracks, ...featuredTracks];

        if (!allTracks || allTracks.length === 0) {
            return new NextResponse("No tracks found", { status: 404 });
        }

        return NextResponse.json(allTracks, { status: 200 });

    } catch (error) {
        console.error("Error fetching artist tracks:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}