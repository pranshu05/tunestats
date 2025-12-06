import { NextRequest } from "next/server";
import { sql } from "@/utils/db";
import { isValidId } from "@/utils/validation";
import { handleError, createSuccessResponse, createErrorResponse } from "@/utils/errorHandler";

export async function GET(req: NextRequest) {
    try {
        const artistId = req.nextUrl.pathname.split("/").slice(-2, -1)[0];

        if (!isValidId(artistId)) {
            return createErrorResponse("Invalid or missing artist ID", 400);
        }

        const primaryPlays = await sql`
            SELECT COUNT(*) AS "primaryPlaycount" 
            FROM "trackHistory" 
            WHERE "artistId" = ${artistId}
        `;

        const featuredPlays = await sql`
            SELECT COUNT(*) AS "featuredPlaycount" 
            FROM "trackHistory" th
            JOIN "trackFeaturedArtists" tf ON th."trackId" = tf."trackId"
            WHERE tf."artistId" = ${artistId} 
            AND th."artistId" != ${artistId}
        `;

        if ((!primaryPlays || primaryPlays.length === 0) && (!featuredPlays || featuredPlays.length === 0)) {
            return createErrorResponse("No playcount found", 404);
        }

        const primaryCount = primaryPlays.length > 0 ? parseInt(primaryPlays[0].primaryPlaycount) : 0;
        const featuredCount = featuredPlays.length > 0 ? parseInt(featuredPlays[0].featuredPlaycount) : 0;
        const totalPlaycount = primaryCount + featuredCount;

        const result = {
            artistId: artistId,
            primaryPlaycount: primaryCount,
            featuredPlaycount: featuredCount,
            playcount: totalPlaycount
        };

        return createSuccessResponse(result, 200);

    } catch (error) {
        return handleError(error);
    }
}