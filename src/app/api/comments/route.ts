import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/auth';
import { sql } from "@/utils/db";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const entityId = searchParams.get('entityId');
    const entityType = searchParams.get('entityType');

    if (!entityId || !entityType) {
        return new NextResponse("Missing query parameters", { status: 400 });
    }

    try {
        const comments = await sql`
            SELECT c.*, u.name, u.image,
                (SELECT COUNT(*) FROM upvotes u2 WHERE u2."commentId" = c."commentId") AS "upvoteCount"
            FROM comments c
            JOIN users u ON c."userId" = u."userId"
            WHERE c."entityId" = ${entityId} AND c."entityType" = ${entityType}
            ORDER BY c."timestamp" ASC
        `;

        if (!comments) {
            return new NextResponse('No comments found', { status: 404 });
        }

        return NextResponse.json(comments, { status: 200 });
    } catch {
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const { entityId, entityType, parentCommentId, text } = await req.json();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
        return new NextResponse("Unauthorized", { status: 401 });

    if (!entityId || !entityType || !text) {
        return new NextResponse('Missing required fields', { status: 400 });
    }

    try {
        await sql`
            INSERT INTO comments ("userId", "entityId", "entityType", "text", "parentCommentId")
            VALUES (${session.user.id}, ${entityId}, ${entityType}, ${text}, ${parentCommentId})
            RETURNING *
        `;
        
        return NextResponse.json("Added Comment", { status: 201 });
    } catch {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}