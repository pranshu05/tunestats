import { NextRequest } from 'next/server';
import { sql } from "@/utils/db";
import { requireAuth } from "@/utils/auth-middleware";
import { isValidEntityType, isValidId, isValidCommentText, sanitizeString } from "@/utils/validation";
import { handleError, createSuccessResponse, createErrorResponse } from "@/utils/errorHandler";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const entityId = searchParams.get('entityId');
        const entityType = searchParams.get('entityType');

        const auth = await requireAuth();
        if (!auth.authenticated) return auth.response;

        if (!isValidId(entityId) || !isValidEntityType(entityType)) {
            return createErrorResponse("Invalid or missing query parameters", 400);
        }

        const comments = await sql`
            SELECT 
                c.*, 
                u.name, 
                (SELECT COUNT(*) FROM upvotes u2 WHERE u2."commentId" = c."commentId") AS "upvoteCount"
            FROM comments c
            JOIN users u ON c."userId" = u."userId"
            WHERE c."entityId" = ${entityId} 
                AND c."entityType" = ${entityType}
            ORDER BY c."timestamp" ASC
        `;

        return createSuccessResponse(comments || [], 200, 'public, s-maxage=30, stale-while-revalidate=60');
    } catch (error) {
        return handleError(error);
    }
}

export async function POST(req: NextRequest) {
    try {
        const auth = await requireAuth();
        if (!auth.authenticated) return auth.response;

        const body = await req.json();
        const { entityId, entityType, parentCommentId, text } = body;

        if (!isValidId(entityId) || !isValidEntityType(entityType)) {
            return createErrorResponse("Invalid or missing required fields", 400);
        }

        if (!isValidCommentText(text)) {
            return createErrorResponse(`Comment must be between 1 and 2000 characters`, 400);
        }

        const trimmedText = sanitizeString(text);

        if (parentCommentId !== null && parentCommentId !== undefined) {
            if (!isValidId(parentCommentId)) {
                return createErrorResponse("Invalid parent comment ID", 400);
            }

            const parentComment = await sql`
                SELECT "commentId" 
                FROM comments 
                WHERE "commentId" = ${parentCommentId}
                LIMIT 1
            `;

            if (!parentComment || parentComment.length === 0) {
                return createErrorResponse("Parent comment not found", 404);
            }
        }

        const entityExists = await sql`
            SELECT EXISTS (
                SELECT 1 FROM (
                    SELECT "userId" AS id FROM users 
                    UNION ALL
                    SELECT "albumId" AS id FROM albums 
                    UNION ALL
                    SELECT "artistId" AS id FROM artists 
                    UNION ALL
                    SELECT "trackId" AS id FROM tracks
                ) AS entities
                WHERE id = ${entityId}
            ) AS "exists"
        `;

        if (!entityExists[0]?.exists) {
            return createErrorResponse("Entity not found", 404);
        }

        await sql`
            INSERT INTO comments ("userId", "entityId", "entityType", "text", "parentCommentId")
            VALUES (
                ${auth.userId}, 
                ${entityId}, 
                ${entityType}, 
                ${trimmedText}, 
                ${parentCommentId || null}
            )
        `;

        return createSuccessResponse({ message: "Comment added successfully" }, 201);
    } catch (error) {
        return handleError(error);
    }
}