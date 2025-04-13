import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { sql } from "@/utils/db";

export async function GET(req: NextRequest) {
    const albumId = req.nextUrl.pathname.split("/").slice(-2, -1)[0];

    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
        return new NextResponse("Unauthorized", { status: 401 });

    if (!albumId) {
        return new NextResponse("Missing query parameters", { status: 400 });
    }

    try {
        const result = await sql`
            SELECT t."albumId", COUNT(*) AS "playcount" 
            FROM "trackHistory" th JOIN tracks t ON t."trackId" = th."trackId" 
            WHERE t."albumId" = ${albumId} GROUP BY t."albumId";
        `;

        if (!result || result.length === 0) {
            return new NextResponse("No playcount found", { status: 404 });
        }

        return NextResponse.json(result[0], { status: 200 });

    } catch {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}