import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/utils/db";

export async function GET(req: NextRequest) {
    const albumId = req.nextUrl.pathname.split("/").pop();

    if (!albumId) {
        return new NextResponse("Missing query parameters", { status: 400 });
    }

    try {
        const result = await sql`
            SELECT a.*, ar."name" as "artistName"
            FROM albums a
            JOIN artists ar ON a."artistId" = ar."artistId"
            WHERE a."albumId" = ${albumId}
        `;

        if (!result || result.length === 0) {
            return new NextResponse("Album not found", { status: 404 });
        }

        return NextResponse.json(result[0], { status: 200 });
    } catch {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}