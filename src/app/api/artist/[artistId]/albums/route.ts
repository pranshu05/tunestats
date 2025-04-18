import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/utils/db";

export async function GET(req: NextRequest) {
    const artistId = req.nextUrl.pathname.split("/").slice(-2, -1)[0];

    if (!artistId) {
        return new NextResponse("Missing query parameters", { status: 400 });
    }

    try {
        const albums = await sql`
            SELECT * FROM albums WHERE "artistId" = ${artistId}
        `;

        if (!albums || albums.length === 0) {
            return NextResponse.json([], { status: 200 });
        }

        return NextResponse.json(albums, { status: 200 });
    } catch {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}