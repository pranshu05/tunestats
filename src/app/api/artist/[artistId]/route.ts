import { NextRequest } from "next/server";
import { sql } from "@/utils/db";
import { isValidId } from "@/utils/validation";
import { handleError, createSuccessResponse, createErrorResponse } from "@/utils/errorHandler";

export async function GET(req: NextRequest) {
    try {
        const artistId = req.nextUrl.pathname.split("/").pop();

        if (!isValidId(artistId)) {
            return createErrorResponse("Invalid or missing artist ID", 400);
        }

        const result = await sql`
            SELECT *
            FROM artists
            WHERE "artistId" = ${artistId}
            LIMIT 1
        `;

        if (!result || result.length === 0) {
            return createErrorResponse("Artist not found", 404);
        }

        return createSuccessResponse(result[0], 200);
    } catch (error) {
        return handleError(error);
    }
}