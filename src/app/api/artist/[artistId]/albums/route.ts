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
        const albums = await sql`
            SELECT * FROM albums WHERE "artistId" = ${artistId}
        `;

        if (!albums || albums.length === 0) {
            return new NextResponse("No albums found", { status: 404 });
        }

        return NextResponse.json(albums, { status: 200 });
    } catch {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}