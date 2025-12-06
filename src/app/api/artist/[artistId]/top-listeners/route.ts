import { NextRequest } from "next/server";
import { sql } from "@/utils/db";
import { isValidId } from "@/utils/validation";
import { handleError, createSuccessResponse, createErrorResponse } from "@/utils/errorHandler";

interface CombinedListener {
    userId: string;
    name: string;
    playCount: number;
}

export async function GET(req: NextRequest) {
    try {
        const artistId = req.nextUrl.pathname.split("/").slice(-2, -1)[0];

        if (!isValidId(artistId)) {
            return createErrorResponse("Invalid or missing artist ID", 400);
        }

        const primaryListeners = await sql`
            SELECT th."userId", COUNT(*) AS "playCount", u.name
            FROM "trackHistory" th JOIN tracks t ON t."trackId" = th."trackId"
            JOIN users u ON u."userId" = th."userId"
            WHERE t."artistId" = ${artistId}
            GROUP BY u."userId", th."userId", u.name
            ORDER BY "playCount" DESC
            LIMIT 5;
        `;

        const featuredListeners = await sql`
            SELECT th."userId", COUNT(*) AS "playCount", u.name
            FROM "trackHistory" th JOIN tracks t ON t."trackId" = th."trackId"
            JOIN "trackFeaturedArtists" tf ON t."trackId" = tf."trackId"
            JOIN users u ON u."userId" = th."userId"
            WHERE tf."artistId" = ${artistId} AND t."artistId" != ${artistId}
            GROUP BY u."userId", th."userId", u.name
            ORDER BY "playCount" DESC
            LIMIT 5;
        `;

        const combinedListeners = [...primaryListeners, ...featuredListeners]
            .reduce((acc, listener) => {
                const existing = acc.find((item: CombinedListener) => item.userId === listener.userId);
                if (existing) {
                    existing.playCount += parseInt(listener.playCount);
                } else {
                    acc.push({ 
                        userId: listener.userId, 
                        name: listener.name, 
                        playCount: parseInt(listener.playCount) 
                    });
                }
                return acc;
            }, [] as CombinedListener[])
            .sort((a: CombinedListener, b: CombinedListener) => b.playCount - a.playCount).slice(0, 5);

        return createSuccessResponse(combinedListeners, 200);

    } catch (error) {
        return handleError(error);
    }
}