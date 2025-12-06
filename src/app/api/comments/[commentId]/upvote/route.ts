import { NextRequest } from "next/server";
import { sql } from "@/utils/db";
import { requireAuth } from "@/utils/auth-middleware";
import { isValidId } from "@/utils/validation";
import { handleError, createSuccessResponse, createErrorResponse } from "@/utils/errorHandler";

export async function POST(req: NextRequest) {
    try {
        const auth = await requireAuth();
        if (!auth.authenticated) return auth.response;

        const commentId = req.nextUrl.pathname.split("/").slice(-2, -1)[0];

        if (!isValidId(commentId)) {
            return createErrorResponse("Invalid comment ID", 400);
        }

        const commentExists = await sql`
            SELECT 1 FROM comments WHERE "commentId" = ${commentId}
            LIMIT 1
        `;

        if (commentExists.length === 0) {
            return createErrorResponse("Comment not found", 404);
        }

        await sql`
            INSERT INTO upvotes ("userId", "commentId", "timestamp")
            VALUES (${auth.userId}, ${commentId}, NOW())
            ON CONFLICT ("userId", "commentId") DO NOTHING
        `;

        return createSuccessResponse({ message: "Upvote added" }, 201);
    } catch (error) {
        return handleError(error);
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const auth = await requireAuth();
        if (!auth.authenticated) return auth.response;

        const commentId = req.nextUrl.pathname.split("/").slice(-2, -1)[0];

        if (!isValidId(commentId)) {
            return createErrorResponse("Invalid comment ID", 400);
        }

        const commentExists = await sql`
            SELECT 1 FROM comments WHERE "commentId" = ${commentId}
            LIMIT 1
        `;

        if (commentExists.length === 0) {
            return createErrorResponse("Comment not found", 404);
        }

        await sql`
            DELETE FROM upvotes
            WHERE "userId" = ${auth.userId} AND "commentId" = ${commentId}
        `;

        return createSuccessResponse({ message: "Upvote removed" }, 200);
    } catch (error) {
        return handleError(error);
    }
}