import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/auth';
import { sql } from "@/utils/db";

export async function GET(req: NextRequest) {
    const trackId = req.nextUrl.pathname.split('/').pop();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
        return new NextResponse("Unauthorized", { status: 401 });

    if (!trackId) {
        return new NextResponse("Missing query parameters", { status: 400 });
    }

    try {
        const track = await sql`
            SELECT tracks.*, albums."imageUrl" 
            FROM tracks 
            JOIN albums ON tracks."albumId" = albums."albumId" 
            WHERE tracks."trackId" = ${trackId}
        `;

        if (!track || track.length === 0) {
            return new NextResponse("Track not found", { status: 404 });
        }

        return NextResponse.json(track[0], { status: 200 });
    } catch {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}