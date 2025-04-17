import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { sql } from "@/utils/db";

export async function DELETE(req: NextRequest) {
    const commentId = req.nextUrl.pathname.split("/").pop();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
        return new NextResponse("Unauthorized", { status: 401 });

    if (!commentId) {
        return new NextResponse("Missing query parameters", { status: 400 });
    }

    try {
        const comment = await sql`
            SELECT * FROM comments
            WHERE "commentId" = ${commentId}
        `;

        if (comment[0]?.userId !== session.user.id) {
            return new NextResponse("Forbidden", { status: 403 });
        }
        
        if (comment.length === 0) {
            return new NextResponse("Comment not found", { status: 404 });
        }

        await sql`
            DELETE FROM comments
            WHERE "commentId" = ${commentId} AND "userId" = ${session.user.id}
        `;

        return new NextResponse('Deleted', { status: 200 });
    } catch {
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}