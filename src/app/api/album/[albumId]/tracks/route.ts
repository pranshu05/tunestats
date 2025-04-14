import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/utils/db";

export async function GET(req: NextRequest) {
    const albumId = req.nextUrl.pathname.split("/").slice(-2, -1)[0];

    if (!albumId) {
        return new NextResponse("Missing query parameters", { status: 400 });
    }

    try{
        const result = await sql`
            SELECT t."trackId", t."name", t."duration", a."imageUrl"
            FROM tracks t
            JOIN albums a ON t."albumId" = a."albumId"
            WHERE t."albumId" = ${albumId}
        `;

        if (!result || result.length === 0) {
            return new NextResponse("No tracks found", { status: 404 });
        }
        
        return NextResponse.json(result, { status: 200 });

    } catch {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}