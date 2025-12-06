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

        const albums = await sql`
            SELECT * FROM albums WHERE "artistId" = ${artistId}
        `;

        if (!albums || albums.length === 0) {
            return createSuccessResponse([], 200);
        }

        return createSuccessResponse(albums, 200);
    } catch (error) {
        return handleError(error);
    }
}