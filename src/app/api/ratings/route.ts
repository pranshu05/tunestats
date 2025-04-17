import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { sql } from '@/utils/db';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const entityId = searchParams.get("entityId");
    const entityType = searchParams.get("entityType");

    if (!entityId || !entityType) {
        return new NextResponse("Missing query parameters", { status: 400 });
    }

    try {
        const ratings = await sql`
            SELECT "userId", "rating"
            FROM ratings
            WHERE "entityId" = ${entityId} AND "entityType" = ${entityType}
        `;

        const totalRatings = ratings.length;
        const averageRating = totalRatings > 0 ? ratings.reduce((acc, cur) => acc + cur.rating, 0) / totalRatings : 0;

        return NextResponse.json({ averageRating, totalRatings, ratings }, { status: 200 });
    } catch {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
        return new NextResponse("Unauthorized", { status: 401 });

    const { entityId, entityType, rating } = await req.json();
    if (!entityId || !entityType || !rating) {
        return new NextResponse("Missing fields", { status: 400 });
    }

    try {
        const entityExists = await sql`
            SELECT 1
            FROM (
                SELECT "artistId" AS "entityId" FROM artists
                UNION ALL
                SELECT "albumId" AS "entityId" FROM albums
                UNION ALL
                SELECT "trackId" AS "entityId" FROM tracks
            ) AS entities
            WHERE "entityId" = ${entityId}
            LIMIT 1
        `;

        if (entityExists.length === 0) {
            return new NextResponse("Entity does not exist", { status: 404 });
        }

        await sql`
            INSERT INTO ratings ("userId", "entityId", "entityType", "rating")
            VALUES (${session.user.id}, ${entityId}, ${entityType}, ${rating})
            ON CONFLICT ("userId", "entityId", "entityType") DO UPDATE
            SET "rating" = EXCLUDED."rating"
        `;

        return new NextResponse("Rating saved", { status: 201 });
    } catch {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}