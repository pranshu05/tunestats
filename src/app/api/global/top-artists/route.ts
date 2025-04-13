import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
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

    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
        return new NextResponse("Unauthorized", { status: 401 });

    if (!["week", "month", "year"].includes(range)) {
        return new NextResponse("Invalid time period. Use 'week', 'month', or 'year'.", { status: 400 });
    }

    try {
        const topArtists = await sql`
            SELECT a.*, COUNT(ah."artistId") AS playcount
            FROM artists a JOIN "artistHistory" ah ON a."artistId" = ah."artistId"
            WHERE ah."timestamp" >= NOW() - ${sql.unsafe(`INTERVAL '${days} days'`)}
            GROUP BY a."artistId" ORDER BY playcount DESC
            LIMIT 10
        `;

        return NextResponse.json({ range, artists: topArtists }, { status: 200 });
    } catch {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}