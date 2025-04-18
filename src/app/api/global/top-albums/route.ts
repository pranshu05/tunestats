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
        const topAlbums = await sql`
            SELECT alb.*, COUNT(th."trackId") AS play_count
            FROM albums alb JOIN tracks t ON alb."albumId" = t."albumId"
            JOIN "trackHistory" th ON t."trackId" = th."trackId"
            WHERE th."timestamp" >= NOW() - ${sql.unsafe(`INTERVAL '${days} days'`)}
            GROUP BY alb."albumId" ORDER BY play_count DESC LIMIT 10
        `;

        return NextResponse.json({ range, albums: topAlbums }, { status: 200 });
    } catch {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}