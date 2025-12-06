import { NextRequest } from "next/server";
import { sql } from "@/utils/db";
import { requireAuth } from "@/utils/auth-middleware";
import { isValidId } from "@/utils/validation";
import { handleError, createSuccessResponse, createErrorResponse } from "@/utils/errorHandler";

async function checkFriendship(userId: string, friendId: string): Promise<boolean> {
    const result = await sql`
        SELECT 1 FROM friends 
        WHERE "userId" = ${userId} AND "friendId" = ${friendId}
        LIMIT 1
    `;
    return result.length > 0;
}

export async function POST(req: NextRequest) {
    try {
        const auth = await requireAuth();
        if (!auth.authenticated) return auth.response;

        const body = await req.json();
        const { friendId } = body;

        if (!isValidId(friendId)) {
            return createErrorResponse("Invalid friend ID", 400);
        }

        if (friendId === auth.userId) {
            return createErrorResponse("Cannot add yourself as a friend", 400);
        }

        const userExists = await sql`
            SELECT 1 FROM users 
            WHERE "userId" = ${friendId}
            LIMIT 1
        `;

        if (userExists.length === 0) {
            return createErrorResponse("User not found", 404);
        }

        const isAlreadyFriend = await checkFriendship(auth.userId, friendId);
        if (isAlreadyFriend) {
            return createErrorResponse("Already friends", 400);
        }

        await sql`
            INSERT INTO friends ("userId", "friendId")
            VALUES (${auth.userId}, ${friendId})
            ON CONFLICT DO NOTHING
        `;

        return createSuccessResponse({ message: "Friend added successfully" }, 201);
    } catch (error) {
        return handleError(error);
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const auth = await requireAuth();
        if (!auth.authenticated) return auth.response;

        const { searchParams } = new URL(req.url);
        const friendId = searchParams.get("friendId");

        if (!isValidId(friendId)) {
            return createErrorResponse("Invalid friend ID", 400);
        }

        if (friendId === auth.userId) {
            return createErrorResponse("Invalid operation", 400);
        }

        const isFriend = await checkFriendship(auth.userId, friendId);
        if (!isFriend) {
            return createErrorResponse("Friendship does not exist", 404);
        }

        await sql`
            DELETE FROM friends 
            WHERE "userId" = ${auth.userId} AND "friendId" = ${friendId}
        `;

        return createSuccessResponse({ message: "Friend removed successfully" }, 200);
    } catch (error) {
        return handleError(error);
    }
}

export async function GET(req: NextRequest) {
    try {
        const auth = await requireAuth();
        if (!auth.authenticated) return auth.response;

        const { searchParams } = new URL(req.url);
        const friendId = searchParams.get("friendId");

        if (!isValidId(friendId)) {
            return createErrorResponse("Invalid friend ID", 400);
        }

        const isFriend = await checkFriendship(auth.userId, friendId);
        return createSuccessResponse({ isFriend }, 200);
    } catch (error) {
        return handleError(error);
    }
}