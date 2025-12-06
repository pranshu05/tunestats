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

        const topArtists = await sql`
            SELECT a.*, COUNT(th."artistId") AS playcount
            FROM artists a JOIN "trackHistory" th ON a."artistId" = th."artistId"
            WHERE th."timestamp" >= NOW() - make_interval(days => ${days})
            GROUP BY a."artistId" ORDER BY playcount DESC
            LIMIT 10
        `;

        return createSuccessResponse({ range, artists: topArtists }, 200);
    } catch (error) {
        return handleError(error);
    }
}