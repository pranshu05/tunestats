import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/utils/db";

export async function GET(req: NextRequest) {
    const artistId = req.nextUrl.pathname.split("/").slice(-2, -1)[0];

    if (!artistId) {
        return new NextResponse("Missing query parameters", { status: 400 });
    }

    try {
        const result = await sql`
            SELECT "artistId", COUNT(*) AS "playcount" 
            FROM "artistHistory" WHERE "artistId" = ${artistId} GROUP BY "artistId";
        `;

        if (!result || result.length === 0) {
            return new NextResponse("No playcount found", { status: 404 });
        }

        return NextResponse.json(result[0], { status: 200 });

    } catch {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}