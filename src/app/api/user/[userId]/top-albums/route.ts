import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/utils/db";

const timeRangeDays = {
    week: 7,
    month: 30,
    year: 365,
};

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') ?? 'month';
    const days = timeRangeDays[range as keyof typeof timeRangeDays] ?? 30;

    if (!params) {
        return new NextResponse("Missing query parameters", { status: 400 });
    }

    try {
        const result = await sql`
            SELECT al."albumId", al."name", al."imageUrl", COUNT(*) AS "playCount"
            FROM "trackHistory" th
            JOIN "tracks" tr ON th."trackId" = tr."trackId"
            JOIN "albums" al ON tr."albumId" = al."albumId"
            WHERE th."userId" = ${params.userId}
            AND th."timestamp" >= NOW() - ${sql.unsafe(`INTERVAL '${days} days'`)}
            GROUP BY al."albumId", al."name", al."imageUrl"
            ORDER BY "playCount" DESC NULLS LAST
            LIMIT 50
        `;

        if (!result || result.length === 0) {
            return new NextResponse("No albums found", { status: 404 });
        }

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Error fetching top albums:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}