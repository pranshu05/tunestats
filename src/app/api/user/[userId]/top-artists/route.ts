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
        WITH main_artists AS (
            SELECT ar."artistId", ar."name", ar."imageUrl", COUNT(*) AS "playCount"
            FROM "trackHistory" th
            JOIN "artists" ar ON th."artistId" = ar."artistId"
            WHERE th."userId" = ${params.userId}
            AND th."timestamp" >= NOW() - ${sql.unsafe(`INTERVAL '${days} days'`)}
            GROUP BY ar."artistId", ar."name", ar."imageUrl"
        ),
        featured_artists AS (
            SELECT fa."artistId", ar."name", ar."imageUrl", COUNT(*) AS "playCount"
            FROM "trackHistory" th
            JOIN "trackFeaturedArtists" fa ON th."trackId" = fa."trackId"
            JOIN "artists" ar ON fa."artistId" = ar."artistId"
            WHERE th."userId" = ${params.userId}
            AND th."timestamp" >= NOW() - ${sql.unsafe(`INTERVAL '${days} days'`)}
            GROUP BY fa."artistId", ar."name", ar."imageUrl"
        ),
        combined_artists AS (
            SELECT * FROM main_artists
            UNION ALL
            SELECT * FROM featured_artists
        )
        SELECT
            "artistId",
            "name",
            "imageUrl",
            SUM("playCount") AS "playCount"
        FROM combined_artists
        GROUP BY "artistId", "name", "imageUrl"
        ORDER BY "playCount" DESC NULLS LAST
        LIMIT 50;
        `;

        if (!result || result.length === 0) {
            return new NextResponse("No artists found", { status: 404 });
        }

        return NextResponse.json(result, { status: 200 });
    } catch {
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}