import { NextRequest } from "next/server";
import { sql } from "@/utils/db";
import { isValidId } from "@/utils/validation";
import { handleError, createSuccessResponse, createErrorResponse } from "@/utils/errorHandler";

const PAGE_SIZE = 10;

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    try {
        const { searchParams } = new URL(req.url);
        const pageParam = searchParams.get('page');
        const page = Math.max(0, parseInt(pageParam || '0', 10) || 0);
        const offset = page * PAGE_SIZE;

        const userId = params.userId;

        if (!isValidId(userId)) {
            return createErrorResponse("Invalid user ID", 400);
        }

        if (offset > 10000) {
            return createErrorResponse("Page number too large", 400);
        }

        const [tracks, totalCount] = await Promise.all([
            sql`
                SELECT 
                    th."timestamp", 
                    t."name" AS "trackName", 
                    t."trackId" AS "trackId", 
                    a."name" AS "artistName", 
                    al."imageUrl",
                    COALESCE(
                        (
                            SELECT json_agg(art."name")
                            FROM "trackFeaturedArtists" tfa
                            JOIN "artists" art ON tfa."artistId" = art."artistId"
                            WHERE tfa."trackId" = t."trackId"
                        ),
                        '[]'::json
                    ) AS "featuredArtists"
                FROM "trackHistory" th
                JOIN "tracks" t ON th."trackId" = t."trackId"
                JOIN "artists" a ON th."artistId" = a."artistId"
                JOIN "albums" al ON t."albumId" = al."albumId"
                WHERE th."userId" = ${userId}
                ORDER BY th."timestamp" DESC
                LIMIT ${PAGE_SIZE} OFFSET ${offset}
            `,
            sql`
                SELECT COUNT(*) as count 
                FROM "trackHistory" 
                WHERE "userId" = ${userId}
            `
        ]);

        const totalPages = Math.ceil(Number(totalCount[0]?.count || 0) / PAGE_SIZE);

        if (!tracks || tracks.length === 0) {
            return createSuccessResponse({ tracks: [], totalPages: 0 }, 200, 'public, s-maxage=60, stale-while-revalidate=120');
        }

        return createSuccessResponse({ tracks, totalPages }, 200, 'public, s-maxage=60, stale-while-revalidate=120');
    } catch (error) {
        return handleError(error);
    }
}