import { NextRequest } from "next/server";
import { sql } from "@/utils/db";
import { isValidTimeRange, TIME_RANGE_DAYS } from "@/utils/validation";
import { handleError, createSuccessResponse, createErrorResponse } from "@/utils/errorHandler";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const range = searchParams.get('range') ?? 'week';

        if (!isValidTimeRange(range)) {
            return createErrorResponse("Invalid time period. Use 'week', 'month', or 'year'.", 400);
        }

        const days = TIME_RANGE_DAYS[range];

        const topTracks = await sql`
            SELECT t.*, COUNT(th."trackId") AS playcount, a."imageUrl" AS "imageUrl"
            FROM tracks t JOIN "trackHistory" th ON t."trackId" = th."trackId"
            JOIN albums a ON t."albumId" = a."albumId"
            WHERE th."timestamp" >= NOW() - make_interval(days => ${days})
            GROUP BY t."trackId", a."imageUrl" ORDER BY playcount DESC
            LIMIT 10
        `;

        return createSuccessResponse({ range, tracks: topTracks }, 200);
    } catch (error) {
        return handleError(error);
    }
}