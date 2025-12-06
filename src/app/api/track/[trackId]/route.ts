import { NextRequest } from 'next/server';
import { sql } from "@/utils/db";
import { isValidId } from "@/utils/validation";
import { handleError, createSuccessResponse, createErrorResponse } from "@/utils/errorHandler";

export async function GET(req: NextRequest) {
    try {
        const trackId = req.nextUrl.pathname.split('/').pop();

        if (!isValidId(trackId)) {
            return createErrorResponse("Invalid or missing track ID", 400);
        }

        const track = await sql`
            SELECT tracks.*, albums."imageUrl" 
            FROM tracks 
            JOIN albums ON tracks."albumId" = albums."albumId" 
            WHERE tracks."trackId" = ${trackId}
            LIMIT 1
        `;

        if (!track || track.length === 0) {
            return createErrorResponse("Track not found", 404);
        }

        return createSuccessResponse(track[0], 200);
    } catch (error) {
        return handleError(error);
    }
}