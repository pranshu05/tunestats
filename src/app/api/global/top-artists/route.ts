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
        const topArtists = await sql`
            SELECT a.*, COUNT(th."artistId") AS playcount
            FROM artists a JOIN "trackHistory" th ON a."artistId" = th."artistId"
            WHERE th."timestamp" >= NOW() - ${sql.unsafe(`INTERVAL '${days} days'`)}
            GROUP BY a."artistId" ORDER BY playcount DESC
            LIMIT 10
        `;

        return NextResponse.json({ range, artists: topArtists }, { status: 200 });
    } catch {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}