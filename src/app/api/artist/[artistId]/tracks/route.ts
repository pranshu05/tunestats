import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { sql } from "@/utils/db";

export async function GET(req: NextRequest) {
    const artistId = req.nextUrl.pathname.split("/").slice(-2, -1)[0];

    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
        return new NextResponse("Unauthorized", { status: 401 });

    if (!artistId) {
        return new NextResponse("Missing query parameters", { status: 400 });
    }

    try {
        const tracks = await sql`
            SELECT tracks.*, albums."imageUrl" 
            FROM tracks 
            JOIN albums ON tracks."albumId" = albums."albumId"
            WHERE tracks."artistId" = ${artistId}
        `;

        if (!tracks || tracks.length === 0) {
            return new NextResponse("No tracks found", { status: 404 });
        }

        return NextResponse.json(tracks, { status: 200 });

    } catch {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}