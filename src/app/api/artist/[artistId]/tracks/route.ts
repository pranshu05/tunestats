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

        const primaryTracks = await sql`
            SELECT tracks.*, albums."imageUrl", true AS "isPrimaryArtist"
            FROM tracks 
            JOIN albums ON tracks."albumId" = albums."albumId"
            WHERE tracks."artistId" = ${artistId}
        `;

        const featuredTracks = await sql`
            SELECT t.*, a."imageUrl", false AS "isPrimaryArtist"
            FROM "trackFeaturedArtists" tf
            JOIN tracks t ON tf."trackId" = t."trackId"
            JOIN albums a ON t."albumId" = a."albumId"
            WHERE tf."artistId" = ${artistId}
        `;

        const allTracks = [...primaryTracks, ...featuredTracks];

        if (!allTracks || allTracks.length === 0) {
            return createErrorResponse("No tracks found", 404);
        }

        return createSuccessResponse(allTracks, 200);

    } catch (error) {
        return handleError(error);
    }
}