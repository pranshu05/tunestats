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
        await sql`
            DELETE FROM comments
            WHERE "commentId" = ${commentId} AND "userId" = ${session.user.id}
        `;

        return new NextResponse('Deleted', { status: 200 });
    } catch {
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}