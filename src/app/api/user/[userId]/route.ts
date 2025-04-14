import { NextRequest, NextResponse } from 'next/server';
import { sql } from "@/utils/db";

export async function GET(req: NextRequest) {
    const userId = req.nextUrl.pathname.split('/').pop();

    if (!userId) {
        return new NextResponse("Missing query parameters", { status: 400 });
    }

    try {
        const user = await sql`
            SELECT "userId", name, "accountType"
            FROM users
            WHERE "userId" = ${userId}
        `;

        if (!user || user.length === 0) {
            return new NextResponse("User not found", { status: 404 });
        }

        return NextResponse.json(user[0], { status: 200 });
    } catch {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}