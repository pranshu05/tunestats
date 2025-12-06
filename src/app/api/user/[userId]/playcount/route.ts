import { NextRequest } from 'next/server';
import { sql } from "@/utils/db";
import { isValidId } from "@/utils/validation";
import { handleError, createSuccessResponse, createErrorResponse } from "@/utils/errorHandler";

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    try {
        const userId = params.userId;

        if (!isValidId(userId)) {
            return createErrorResponse("Invalid or missing user ID", 400);
        }

        const userExists = await sql`
            SELECT EXISTS (SELECT 1 FROM users WHERE "userId" = ${userId}) AS "exists"
        `;

        if (!userExists[0].exists) {
            return createErrorResponse("User not found", 404);
        }

        const userPlayCount = await sql`
        SELECT 
            (SELECT COUNT(*) FROM "trackHistory" WHERE "userId" = ${userId}) AS "playCount",
            (SELECT COUNT(DISTINCT "trackId") FROM "trackHistory" WHERE "userId" = ${userId}) AS "trackCount",
            (
            SELECT COUNT(DISTINCT "artistId") FROM (
                    SELECT "artistId"
                    FROM "trackHistory"
                    WHERE "userId" = ${userId}
                    UNION
                    SELECT fa."artistId"
                    FROM "trackHistory" th
                    JOIN "trackFeaturedArtists" fa ON th."trackId" = fa."trackId"
                    WHERE th."userId" = ${userId}
                ) AS combined_artists
            ) AS "artistCount"
        `;

        return createSuccessResponse(userPlayCount[0], 200);
    } catch (error) {
        return handleError(error);
    }
}