import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/auth';
import { sql } from "@/utils/db";

const MAX_COMMENT_LENGTH = 2000;
const MIN_COMMENT_LENGTH = 1;

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const entityId = searchParams.get('entityId');
        const entityType = searchParams.get('entityType');

        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!entityId || !entityType) {
            return NextResponse.json({ error: "Missing query parameters" }, { status: 400 });
        }

        const validEntityTypes = ['user', 'track', 'album', 'artist'];
        if (!validEntityTypes.includes(entityType)) {
            return NextResponse.json({ error: "Invalid entity type" }, { status: 400 });
        }

        const comments = await sql`
            SELECT 
                c.*, 
                u.name, 
                (SELECT COUNT(*) FROM upvotes u2 WHERE u2."commentId" = c."commentId") AS "upvoteCount"
            FROM comments c
            JOIN users u ON c."userId" = u."userId"
            WHERE c."entityId" = ${entityId} 
                AND c."entityType" = ${entityType}
            ORDER BY c."timestamp" ASC
        `;

        return NextResponse.json(comments || [], {
            status: 200, headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60', },
        });
    } catch {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { entityId, entityType, parentCommentId, text } = body;

        if (!entityId || !entityType || !text) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const validEntityTypes = ['user', 'track', 'album', 'artist'];
        if (!validEntityTypes.includes(entityType)) {
            return NextResponse.json({ error: "Invalid entity type" }, { status: 400 });
        }

        const trimmedText = text.trim();
        if (trimmedText.length < MIN_COMMENT_LENGTH || trimmedText.length > MAX_COMMENT_LENGTH) {
            return NextResponse.json({ error: `Comment must be between ${MIN_COMMENT_LENGTH} and ${MAX_COMMENT_LENGTH} characters` }, { status: 400 });
        }

        if (parentCommentId !== null && parentCommentId !== undefined) {
            const parentComment = await sql`
                SELECT "commentId" 
                FROM comments 
                WHERE "commentId" = ${parentCommentId}
                LIMIT 1
            `;

            if (!parentComment || parentComment.length === 0) {
                return NextResponse.json({ error: "Parent comment not found" }, { status: 404 });
            }
        }

        const entityExists = await sql`
            SELECT EXISTS (
                SELECT 1 FROM (
                    SELECT "userId" AS id FROM users 
                    UNION ALL
                    SELECT "albumId" AS id FROM albums 
                    UNION ALL
                    SELECT "artistId" AS id FROM artists 
                    UNION ALL
                    SELECT "trackId" AS id FROM tracks
                ) AS entities
                WHERE id = ${entityId}
            ) AS "exists"
        `;

        if (!entityExists[0]?.exists) {
            return NextResponse.json({ error: "Entity not found" }, { status: 404 });
        }

        await sql`
            INSERT INTO comments ("userId", "entityId", "entityType", "text", "parentCommentId")
            VALUES (
                ${session.user.id}, 
                ${entityId}, 
                ${entityType}, 
                ${trimmedText}, 
                ${parentCommentId || null}
            )
        `;

        return NextResponse.json({ message: "Comment added successfully" }, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}