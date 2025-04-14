import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/utils/db";

const PAGE_SIZE = 10;

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '0');
    const offset = page * PAGE_SIZE;

    if (!params) {
        return new NextResponse("Missing query parameters", { status: 400 });
    }

    try {
        const tracks = await sql`
            SELECT th."timestamp", t."name" AS "trackName", t."trackId" AS "trackId", a."name" AS "artistName", al."imageUrl"
            FROM "trackHistory" th
            JOIN "tracks" t ON th."trackId" = t."trackId"
            JOIN "artists" a ON th."artistId" = a."artistId"
            JOIN "albums" al ON t."albumId" = al."albumId"
            WHERE th."userId" = ${params.userId}
            ORDER BY th."timestamp" DESC
            LIMIT ${PAGE_SIZE} OFFSET ${offset}
        `;

        const totalCount = await sql`
            SELECT COUNT(*) FROM "trackHistory" WHERE "userId" = ${params.userId}
        `;

        const totalPages = Math.ceil(Number(totalCount[0].count) / PAGE_SIZE);

        if (!tracks || tracks.length === 0) {
            return new NextResponse("No tracks found", { status: 404 });
        }

        return NextResponse.json({ tracks, totalPages }, { status: 200 });
    } catch{
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}