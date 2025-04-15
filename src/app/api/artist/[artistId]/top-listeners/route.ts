import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/utils/db";

export async function GET(req: NextRequest) {
    const artistId = req.nextUrl.pathname.split("/").slice(-2, -1)[0];

    if (!artistId) {
        return new NextResponse("Missing query parameters", { status: 400 });
    }

    try {
        const result = await sql`
            SELECT th."userId", COUNT(*) AS "playCount", u.name
            FROM "trackHistory" th JOIN tracks t ON t."trackId" = th."trackId"
            JOIN users u ON u."userId" = th."userId"
            WHERE t."artistId" = ${artistId}
            GROUP BY u."userId", th."userId"
            ORDER BY "playCount" DESC
            LIMIT 5;
        `;

        if (!result || result.length === 0) {
            return new NextResponse("No top listeners found", { status: 404 });
        }

        return NextResponse.json(result, { status: 200 });

    } catch {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}