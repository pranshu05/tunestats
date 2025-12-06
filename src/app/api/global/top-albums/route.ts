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

        const topAlbums = await sql`
            SELECT alb.*, COUNT(th."trackId") AS play_count
            FROM albums alb JOIN tracks t ON alb."albumId" = t."albumId"
            JOIN "trackHistory" th ON t."trackId" = th."trackId"
            WHERE th."timestamp" >= NOW() - make_interval(days => ${days})
            GROUP BY alb."albumId" ORDER BY play_count DESC LIMIT 10
        `;

        return createSuccessResponse({ range, albums: topAlbums }, 200);
    } catch (error) {
        return handleError(error);
    }
}