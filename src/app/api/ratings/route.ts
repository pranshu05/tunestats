import { NextRequest } from "next/server";
import { sql } from '@/utils/db';
import { requireAuth } from "@/utils/auth-middleware";
import { isValidEntityType, isValidId, isValidRating } from "@/utils/validation";
import { handleError, createSuccessResponse, createErrorResponse } from "@/utils/errorHandler";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const entityId = searchParams.get("entityId");
        const entityType = searchParams.get("entityType");

        if (!isValidId(entityId) || !isValidEntityType(entityType)) {
            return createErrorResponse("Invalid or missing query parameters", 400);
        }

        if (entityType === 'user') {
            return createErrorResponse("Cannot rate users", 400);
        }

        const ratings = await sql`
            SELECT "userId", "rating", "timestamp"
            FROM ratings
            WHERE "entityId" = ${entityId} AND "entityType" = ${entityType}
        `;

        const totalRatings = ratings.length;
        const averageRating = totalRatings > 0 ? ratings.reduce((acc, cur) => acc + cur.rating, 0) / totalRatings : 0;

        return createSuccessResponse({ averageRating, totalRatings, ratings }, 200);
    } catch (error) {
        return handleError(error);
    }
}

export async function POST(req: NextRequest) {
    try {
        const auth = await requireAuth();
        if (!auth.authenticated) return auth.response;

        const body = await req.json();
        const { entityId, entityType, rating } = body;

        if (!isValidId(entityId) || !isValidEntityType(entityType)) {
            return createErrorResponse("Invalid or missing fields", 400);
        }

        if (entityType === 'user') {
            return createErrorResponse("Cannot rate users", 400);
        }

        if (!isValidRating(rating)) {
            return createErrorResponse(`Rating must be an integer between 1 and 5`, 400);
        }

        const entityExists = await sql`
            SELECT 1
            FROM (
                SELECT "artistId" AS "entityId" FROM artists
                UNION ALL
                SELECT "albumId" AS "entityId" FROM albums
                UNION ALL
                SELECT "trackId" AS "entityId" FROM tracks
            ) AS entities
            WHERE "entityId" = ${entityId}
            LIMIT 1
        `;

        if (entityExists.length === 0) {
            return createErrorResponse("Entity does not exist", 404);
        }

        await sql`
            INSERT INTO ratings ("userId", "entityId", "entityType", "rating", "timestamp")
            VALUES (${auth.userId}, ${entityId}, ${entityType}, ${rating}, NOW())
            ON CONFLICT ("userId", "entityId", "entityType") DO UPDATE
            SET "rating" = EXCLUDED."rating", "timestamp" = NOW()
        `;

        return createSuccessResponse({ message: "Rating saved" }, 201);
    } catch (error) {
        return handleError(error);
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const auth = await requireAuth();
        if (!auth.authenticated) return auth.response;

        const body = await req.json();
        const { entityId, entityType } = body;

        if (!isValidId(entityId) || !isValidEntityType(entityType)) {
            return createErrorResponse("Invalid or missing fields", 400);
        }

        const result = await sql`
            DELETE FROM ratings
            WHERE "userId" = ${auth.userId}
            AND "entityId" = ${entityId}
            AND "entityType" = ${entityType}
        `;

        if (result.length === 0) {
            return createErrorResponse("Rating not found", 404);
        }

        return createSuccessResponse({ message: "Rating deleted" }, 200);
    } catch (error) {
        return handleError(error);
    }
}