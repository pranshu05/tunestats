import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { sql } from "@/utils/db";

async function checkFriendship(userId: string, friendId: string) {
    const result = await sql`
        SELECT * FROM Friends 
        WHERE "userId" = ${userId} AND "friendId" = ${friendId}
    `;
    return result.length > 0;
}

export async function POST(req: NextRequest) {
    const { friendId } = await req.json();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
        return new NextResponse("Unauthorized", { status: 401 });

    if (!friendId || friendId === session.user.id) {
        return new NextResponse("Invalid friend ID", { status: 400 });
    }

    try {
        const isAlreadyFriend = await checkFriendship(session.user.id, friendId);

        const userExists = await sql`
            SELECT 1 FROM Users 
            WHERE "userId" = ${friendId}
        `;

        if (userExists.length === 0) {
            return new NextResponse("User with this friendId does not exist", { status: 400 });
        }

        if (isAlreadyFriend) {
            return new NextResponse("Already friends", { status: 400 });
        }

        await sql`
            INSERT INTO Friends ("userId", "friendId")
            VALUES (${session.user.id}, ${friendId})
            ON CONFLICT DO NOTHING
        `;

        return NextResponse.json("Friend added successfully", { status: 201 });
    } catch {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const friendId = searchParams.get("friendId");

    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
        return new NextResponse("Unauthorized", { status: 401 });

    if (!friendId || friendId === session.user.id) {
        return new NextResponse("Invalid friend ID", { status: 400 });
    }

    try {
        const isFriend = await checkFriendship(session.user.id, friendId);

        if (!isFriend) {
            return new NextResponse("Friendship does not exist", { status: 400 });
        }

        await sql`
            DELETE FROM Friends 
            WHERE "userId" = ${session.user.id} AND "friendId" = ${friendId}
        `;

        return NextResponse.json("Friend removed successfully", { status: 200 });
    } catch {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const friendId = searchParams.get("friendId");

    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
        return new NextResponse("Unauthorized", { status: 401 });

    if (!friendId) {
        return new NextResponse("Friend ID is required", { status: 400 });
    }

    try {
        const isFriend = await checkFriendship(session.user.id, friendId);
        return NextResponse.json({ isFriend }, { status: 200 });
    } catch {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}