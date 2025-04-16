import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/utils/db";

const timeRangeDays = {
    week: 7,
    month: 30,
    year: 365,
};

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') ?? 'week';
    const days = timeRangeDays[range as keyof typeof timeRangeDays] ?? 7;

    if (!["week", "month", "year"].includes(range)) {
        return new NextResponse("Invalid time period. Use 'week', 'month', or 'year'.", { status: 400 });
    }

    try {
        const topTracks = await sql`
            SELECT t.*, COUNT(th."trackId") AS playcount, a."imageUrl" AS "imageUrl"
            FROM tracks t JOIN "trackHistory" th ON t."trackId" = th."trackId"
            JOIN albums a ON t."albumId" = a."albumId"
            WHERE th."timestamp" >= NOW() - ${sql.unsafe(`INTERVAL '${days} days'`)}
            GROUP BY t."trackId", a."imageUrl" ORDER BY playcount DESC
            LIMIT 10
        `;

        return NextResponse.json({ range, tracks: topTracks }, { status: 200 });
    } catch {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}