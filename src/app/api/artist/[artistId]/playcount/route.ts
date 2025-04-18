import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/utils/db";

export async function GET(req: NextRequest) {
    const artistId = req.nextUrl.pathname.split("/").slice(-2, -1)[0];

    if (!artistId) {
        return new NextResponse("Missing query parameters", { status: 400 });
    }

    try {
        const primaryPlays = await sql`
            SELECT COUNT(*) AS "primaryPlaycount" 
            FROM "trackHistory" 
            WHERE "artistId" = ${artistId}
        `;

        const featuredPlays = await sql`
            SELECT COUNT(*) AS "featuredPlaycount" 
            FROM "trackHistory" th
            JOIN "trackFeaturedArtists" tf ON th."trackId" = tf."trackId"
            WHERE tf."artistId" = ${artistId} 
            AND th."artistId" != ${artistId}
        `;

        if ((!primaryPlays || primaryPlays.length === 0) &&
            (!featuredPlays || featuredPlays.length === 0)) {
            return new NextResponse("No playcount found", { status: 404 });
        }

        const primaryCount = primaryPlays.length > 0 ? parseInt(primaryPlays[0].primaryPlaycount) : 0;
        const featuredCount = featuredPlays.length > 0 ? parseInt(featuredPlays[0].featuredPlaycount) : 0;
        const totalPlaycount = primaryCount + featuredCount;

        const result = {
            artistId: artistId,
            primaryPlaycount: primaryCount,
            featuredPlaycount: featuredCount,
            playcount: totalPlaycount
        };

        return NextResponse.json(result, { status: 200 });

    } catch (error) {
        console.error("Error fetching artist playcount:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}