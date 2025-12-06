import { NextRequest } from "next/server";
import { sql } from "@/utils/db";
import { isValidId } from "@/utils/validation";
import { handleError, createSuccessResponse, createErrorResponse } from "@/utils/errorHandler";

export async function GET(req: NextRequest) {
    try {
        const albumId = req.nextUrl.pathname.split("/").pop();

        if (!isValidId(albumId)) {
            return createErrorResponse("Invalid or missing album ID", 400);
        }

        const result = await sql`
            SELECT a.*, ar."name" as "artistName", COUNT(t."trackId") as "trackCount"
            FROM albums a
            JOIN artists ar ON a."artistId" = ar."artistId"
            LEFT JOIN tracks t ON a."albumId" = t."albumId"
            WHERE a."albumId" = ${albumId}
            GROUP BY a."albumId", ar."name"
            LIMIT 1
        `;

        if (!result || result.length === 0) {
            return createErrorResponse("Album not found", 404);
        }

        return createSuccessResponse(result[0], 200);
    } catch (error) {
        return handleError(error);
    }
}