import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { sql } from "@/utils/db";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.id !== userId)
        return new NextResponse("Unauthorized", { status: 401 });

    if (!userId) return new NextResponse("Missing userId", { status: 400 });

    try {
        const result = await sql`
            SELECT "commentId" FROM upvotes
            WHERE "userId" = ${userId}
        `;

        return NextResponse.json(result, { status: 200 });
    } catch {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}