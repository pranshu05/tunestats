import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/utils/db";

const timeRangeDays = {
    week: 7,
    month: 30,
    year: 365,
};

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') ?? 'week';
    const days = timeRangeDays[range as keyof typeof timeRangeDays] ?? 7;

    if (!params) {
        return new NextResponse("Missing query parameters", { status: 400 });
    }

    try {
        const result = await sql`
            SELECT ar."artistId", ar."name", ar."imageUrl", COUNT(*) AS "playCount"
            FROM "artistHistory" ah
            JOIN "artists" ar ON ah."artistId" = ar."artistId"
            WHERE ah."userId" = ${params.userId} AND ah."timestamp" >= NOW() - ${sql.unsafe(`INTERVAL '${days} days'`)}
            GROUP BY ar."artistId", ar."name", ar."imageUrl"
            ORDER BY "playCount" DESC
            LIMIT 50
        `;

        if (!result || result.length === 0) {
            return new NextResponse("No artists found", { status: 404 });
        }

        return NextResponse.json(result, { status: 200 });
    } catch {
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}