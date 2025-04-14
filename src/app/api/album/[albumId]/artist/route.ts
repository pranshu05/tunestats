import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/utils/db";

export async function GET(req: NextRequest) {
    const albumId = req.nextUrl.pathname.split("/").slice(-2, -1)[0];

    if (!albumId) {
        return new NextResponse("Missing query parameters", { status: 400 });
    }

    try {
        const result = await sql`
            SELECT ar."artistId", ar."name", ar."imageUrl"
            FROM artists ar
            JOIN albums a ON ar."artistId" = a."artistId"
            WHERE a."albumId" = ${albumId}
        `;

        if (!result || result.length === 0) {
            return new NextResponse("No tracks found", { status: 404 });
        }

        return NextResponse.json(result[0], { status: 200 });

    } catch {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}