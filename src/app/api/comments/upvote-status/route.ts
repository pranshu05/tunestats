import { NextRequest } from "next/server";
import { sql } from "@/utils/db";
import { requireAuth, isAuthorized } from "@/utils/auth-middleware";
import { isValidId } from "@/utils/validation";
import { handleError, createSuccessResponse, createErrorResponse } from "@/utils/errorHandler";

export async function GET(req: NextRequest) {
    try {
        const auth = await requireAuth();
        if (!auth.authenticated) return auth.response;

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!isValidId(userId)) {
            return createErrorResponse("Invalid user ID", 400);
        }

        if (!isAuthorized(auth.userId, userId)) {
            return createErrorResponse("Forbidden: You can only view your own upvote status", 403);
        }

        const result = await sql`
            SELECT "commentId" FROM upvotes
            WHERE "userId" = ${userId}
        `;

        return createSuccessResponse(result, 200);
    } catch (error) {
        return handleError(error);
    }
}