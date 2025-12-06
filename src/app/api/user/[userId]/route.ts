import { NextRequest, NextResponse } from 'next/server';
import { sql } from "@/utils/db";

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    try {
        const userId = params.userId;

        if (!userId || typeof userId !== 'string' || userId.trim() === '') {
            return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
        }

        const user = await sql`
            SELECT "userId", name, "accountType"
            FROM users
            WHERE "userId" = ${userId}
            LIMIT 1
        `;

        if (!user || user.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user[0], { status: 200, headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120', }, });
    } catch {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}