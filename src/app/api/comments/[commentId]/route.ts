import { NextRequest } from "next/server";
import { sql } from "@/utils/db";
import { requireAuth, isAuthorized } from "@/utils/auth-middleware";
import { isValidId } from "@/utils/validation";
import { handleError, createSuccessResponse, createErrorResponse } from "@/utils/errorHandler";

export async function DELETE(req: NextRequest) {
    try {
        const auth = await requireAuth();
        if (!auth.authenticated) return auth.response;

        const commentId = req.nextUrl.pathname.split("/").pop();

        if (!isValidId(commentId)) {
            return createErrorResponse("Invalid comment ID", 400);
        }

        const comment = await sql`
            SELECT "userId" FROM comments
            WHERE "commentId" = ${commentId}
            LIMIT 1
        `;

        if (comment.length === 0) {
            return createErrorResponse("Comment not found", 404);
        }

        if (!isAuthorized(auth.userId, comment[0].userId)) {
            return createErrorResponse("Forbidden: You can only delete your own comments", 403);
        }

        await sql`
            DELETE FROM comments
            WHERE "commentId" = ${commentId} AND "userId" = ${auth.userId}
        `;

        return createSuccessResponse({ message: "Comment deleted" }, 200);
    } catch (error) {
        return handleError(error);
    }
}