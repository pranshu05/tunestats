import { NextRequest } from "next/server";
import { sql } from "@/utils/db";
import { isValidId, isValidTimeRange, TIME_RANGE_DAYS, TimeRange } from "@/utils/validation";
import { handleError, createSuccessResponse, createErrorResponse } from "@/utils/errorHandler";

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    try {
        const { searchParams } = new URL(req.url);
        const range = searchParams.get('range') ?? 'month';

        if (!isValidTimeRange(range)) {
            return createErrorResponse("Invalid range parameter. Must be 'week', 'month', or 'year'", 400);
        }

        const userId = params.userId;

        if (!isValidId(userId)) {
            return createErrorResponse("Invalid user ID", 400);
        }

        const days = TIME_RANGE_DAYS[range as TimeRange];

        const result = await sql`
            SELECT al."albumId", al."name", al."imageUrl", COUNT(*) AS "playCount"
            FROM "trackHistory" th
            JOIN "tracks" tr ON th."trackId" = tr."trackId"
            JOIN "albums" al ON tr."albumId" = al."albumId"
            WHERE th."userId" = ${userId}
            AND th."timestamp" >= NOW() - make_interval(days => ${days})
            GROUP BY al."albumId", al."name", al."imageUrl"
            ORDER BY "playCount" DESC NULLS LAST
            LIMIT 144
        `;

        if (!result || result.length === 0) {
            return createErrorResponse("No albums found", 404);
        }

        return createSuccessResponse(result, 200);
    } catch (error) {
        return handleError(error);
    }
}