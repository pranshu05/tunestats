import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { sql } from "@/utils/db";

export async function POST(req: NextRequest) {
    const commentId = req.nextUrl.pathname.split("/").slice(-2, -1)[0];

    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
        return new NextResponse("Unauthorized", { status: 401 });

    if (!commentId) {
        return new NextResponse("Missing query parameters", { status: 400 });
    }

    try {
        const commentExists = await sql`
            SELECT 1 FROM comments WHERE "commentId" = ${commentId}
        `;

        if (commentExists.length === 0) {
            return new NextResponse("Comment not found", { status: 404 });
        }

        await sql`
            INSERT INTO upvotes ("userId", "commentId")
            VALUES (${session.user.id}, ${commentId})
            ON CONFLICT ("userId", "commentId") DO NOTHING
        `;

        return new NextResponse("Added Upvote", { status: 201 });
    } catch {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const commentId = req.nextUrl.pathname.split("/").slice(-2, -1)[0];

    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
        return new NextResponse("Unauthorized", { status: 401 });

    if (!commentId) {
        return new NextResponse("Missing query parameters", { status: 400 });
    }

    try {
        const commentExists = await sql`
            SELECT 1 FROM comments WHERE "commentId" = ${commentId}
        `;

        if (commentExists.length === 0) {
            return new NextResponse("Comment not found", { status: 404 });
        }

        await sql`
            DELETE FROM upvotes
            WHERE "userId" = ${session.user.id} AND "commentId" = ${commentId}
        `;

        return new NextResponse("Removed upvote", { status: 200 });
    } catch {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}