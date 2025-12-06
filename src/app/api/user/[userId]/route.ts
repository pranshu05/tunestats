import { NextRequest } from 'next/server';
import { sql } from "@/utils/db";
import { isValidId } from "@/utils/validation";
import { handleError, createSuccessResponse, createErrorResponse } from "@/utils/errorHandler";

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    try {
        const userId = params.userId;

        if (!isValidId(userId)) {
            return createErrorResponse("Invalid user ID", 400);
        }

        const user = await sql`
            SELECT "userId", name, "accountType"
            FROM users
            WHERE "userId" = ${userId}
            LIMIT 1
        `;

        if (!user || user.length === 0) {
            return createErrorResponse("User not found", 404);
        }

        return createSuccessResponse(user[0], 200, 'public, s-maxage=60, stale-while-revalidate=120');
    } catch (error) {
        return handleError(error);
    }
}