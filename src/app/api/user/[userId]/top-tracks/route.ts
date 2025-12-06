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
            return createSuccessResponse([], 200, 'public, s-maxage=300, stale-while-revalidate=600');
        }

        return createSuccessResponse(result, 200, 'public, s-maxage=300, stale-while-revalidate=600');
    } catch (error) {
        return handleError(error);
    }
}