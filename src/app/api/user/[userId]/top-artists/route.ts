import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/utils/db";

const timeRangeDays: Record<string, number> = {
    week: 7,
    month: 30,
    year: 365,
};

const VALID_RANGES = ['week', 'month', 'year'] as const;
type ValidRange = typeof VALID_RANGES[number];

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    try {
        const { searchParams } = new URL(req.url);
        const range = searchParams.get('period') ?? 'week';

        if (!VALID_RANGES.includes(range as ValidRange)) {
            return NextResponse.json({ error: "Invalid range parameter. Must be 'week', 'month', or 'year'" }, { status: 400 });
        }

        const userId = params.userId;

        if (!userId || typeof userId !== 'string' || userId.trim() === '') {
            return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
        }

        const days = timeRangeDays[range as ValidRange];

        const result = await sql`
            WITH main_artists AS (
                SELECT ar."artistId", ar."name", ar."imageUrl", COUNT(*) AS "playCount"
                FROM "trackHistory" th
                JOIN "artists" ar ON th."artistId" = ar."artistId"
                WHERE th."userId" = ${userId}
                    AND th."timestamp" >= NOW() - make_interval(days => ${days})
                GROUP BY ar."artistId", ar."name", ar."imageUrl"
            ),
            featured_artists AS (
                SELECT fa."artistId", ar."name", ar."imageUrl", COUNT(*) AS "playCount"
                FROM "trackHistory" th
                JOIN "trackFeaturedArtists" fa ON th."trackId" = fa."trackId"
                JOIN "artists" ar ON fa."artistId" = ar."artistId"
                WHERE th."userId" = ${userId}
                    AND th."timestamp" >= NOW() - make_interval(days => ${days})
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
            LIMIT 50
        `;

        if (!result || result.length === 0) {
            return NextResponse.json([], { status: 200, headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', }, });
        }

        return NextResponse.json(result, { status: 200, headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', }, });
    } catch {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}