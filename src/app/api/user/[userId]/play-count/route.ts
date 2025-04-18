import { NextRequest, NextResponse } from 'next/server';
import { sql } from "@/utils/db";

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    const userId = params.userId;

    if (!userId) {
        return new NextResponse("Missing query parameters", { status: 400 });
    }

    try {
        const userExists = await sql`
            SELECT EXISTS (SELECT 1 FROM users WHERE "userId" = ${userId}) AS "exists"
        `;

        if (!userExists[0].exists) {
            return new NextResponse("User not found", { status: 404 });
        }

        const userPlayCount = await sql`
            SELECT 
                (SELECT COUNT(*) FROM "trackHistory" WHERE "userId" = ${userId}) AS "playCount",
                (SELECT COUNT(DISTINCT "trackId") FROM "trackHistory" WHERE "userId" = ${userId}) AS "trackCount",
                (SELECT COUNT(DISTINCT "artistId") FROM "trackHistory" WHERE "userId" = ${userId}) AS "artistCount"
        `;

        return NextResponse.json(userPlayCount[0], { status: 200 });
    } catch {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}