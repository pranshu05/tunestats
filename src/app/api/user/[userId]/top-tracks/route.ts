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
            SELECT 
                t."trackId", 
                t."name", 
                a."imageUrl" AS "albumImage", 
                COUNT(*) AS "playCount", 
                ar.name AS "artistName",
                COALESCE(
                    (
                        SELECT json_agg(art."name")
                        FROM "trackFeaturedArtists" tfa
                        JOIN "artists" art ON tfa."artistId" = art."artistId"
                        WHERE tfa."trackId" = t."trackId"
                    ),
                    '[]'::json
                ) AS "featuredArtists"
            FROM "trackHistory" th
            JOIN "tracks" t ON th."trackId" = t."trackId"
            JOIN "albums" a ON t."albumId" = a."albumId"
            JOIN "artists" ar ON a."artistId" = ar."artistId"
            WHERE th."userId" = ${userId} 
                AND th."timestamp" >= NOW() - make_interval(days => ${days})
            GROUP BY t."trackId", t."name", a."imageUrl", ar.name
            ORDER BY "playCount" DESC
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