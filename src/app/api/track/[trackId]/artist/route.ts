import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/utils/db";

export async function GET(req: NextRequest) {
    const trackId = req.nextUrl.pathname.split("/").slice(-2, -1)[0];

    if (!trackId) {
        return new NextResponse("Missing query parameters", { status: 400 });
    }

    try {
        const result = await sql`
            SELECT t."trackId", ar.*
            FROM tracks t
            JOIN artists ar ON t."artistId" = ar."artistId"
            WHERE t."trackId" = ${trackId}
        `;

        if (!result || result.length === 0) {
            return new NextResponse("No artist found", { status: 404 });
        }

        return NextResponse.json(result[0], { status: 200 });
    } catch {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}