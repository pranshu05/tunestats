import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/utils/db";

const timeRangeDays = {
    week: 7,
    month: 30,
    year: 365,
};

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') ?? 'week';
    const days = timeRangeDays[range as keyof typeof timeRangeDays] ?? 7;

    if (!params) {
        return new NextResponse("Missing query parameters", { status: 400 });
    }

    try {
        const result = await sql`
            SELECT t."trackId", t."name", a."imageUrl" AS "albumImage", COUNT(*) AS "playCount", ar.name AS "artistName",
            (
            SELECT json_agg(art."name")
            FROM "trackFeaturedArtists" tfa
            JOIN "artists" art ON tfa."artistId" = art."artistId"
            WHERE tfa."trackId" = t."trackId"
            ) AS "featuredArtists"
            FROM "trackHistory" th
            JOIN "tracks" t ON th."trackId" = t."trackId"
            JOIN "albums" a ON t."albumId" = a."albumId"
            JOIN "artists" ar ON a."artistId" = ar."artistId"
            WHERE th."userId" = ${params.userId} AND th."timestamp" >= NOW() - ${sql.unsafe(`INTERVAL '${days} days'`)}
            GROUP BY t."trackId", t."name", a."imageUrl", ar.name
            ORDER BY "playCount" DESC
            LIMIT 50
        `;

        if (!result || result.length === 0) {
            return new NextResponse("No tracks found", { status: 404 });
        }

        return NextResponse.json(result, { status: 200 });
    } catch {
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}