import { NextRequest } from "next/server";
import { sql } from "@/utils/db";
import { isValidId, isValidTimeRange, TIME_RANGE_DAYS, TimeRange } from "@/utils/validation";
import { handleError, createSuccessResponse, createErrorResponse } from "@/utils/errorHandler";

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    try {
        const { searchParams } = new URL(req.url);
        const range = searchParams.get('period') ?? 'week';

        if (!isValidTimeRange(range)) {
            return createErrorResponse("Invalid range parameter. Must be 'week', 'month', or 'year'", 400);
        }

        const userId = params.userId;

        if (!isValidId(userId)) {
            return createErrorResponse("Invalid user ID", 400);
        }

        const days = TIME_RANGE_DAYS[range as TimeRange];

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
            return createSuccessResponse([], 200, 'public, s-maxage=300, stale-while-revalidate=600');
        }

        return createSuccessResponse(result, 200, 'public, s-maxage=300, stale-while-revalidate=600');
    } catch (error) {
        return handleError(error);
    }
}