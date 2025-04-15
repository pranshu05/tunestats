import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { sql } from "@/utils/db";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
        return new NextResponse("Unauthorized", { status: 401 });

    try {
        const friends = await sql`
            SELECT CASE WHEN "userId" = ${session.user.id} THEN "friendId" ELSE "userId" END as friend_id
            FROM Friends WHERE "userId" = ${session.user.id} OR "friendId" = ${session.user.id}
        `;

        if (friends.length === 0) {
            return NextResponse.json([], { status: 200 });
        }

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const friendCompatibilityResults = [];

        for (const friend of friends) {
            const friendId = friend.friend_id;

            const compatibilityResult = await sql`
                WITH user_tracks AS (
                    SELECT "trackId", COUNT(*) as play_count
                    FROM "trackHistory"
                    WHERE "userId" = ${session.user.id}
                    AND "timestamp" >= ${oneWeekAgo.toISOString()}
                    GROUP BY "trackId"
                ),
                friend_tracks AS (
                    SELECT "trackId", COUNT(*) as play_count
                    FROM "trackHistory"
                    WHERE "userId" = ${friendId}
                    AND "timestamp" >= ${oneWeekAgo.toISOString()}
                    GROUP BY "trackId"
                ),
                user_artists AS (
                    SELECT "artistId", COUNT(*) as listen_count
                    FROM "trackHistory" 
                    WHERE "userId" = ${session.user.id}
                    AND "timestamp" >= ${oneWeekAgo.toISOString()}
                    GROUP BY "artistId"
                ),
                friend_artists AS (
                    SELECT "artistId", COUNT(*) as listen_count
                    FROM "trackHistory"
                    WHERE "userId" = ${friendId}
                    AND "timestamp" >= ${oneWeekAgo.toISOString()}
                    GROUP BY "artistId"
                ),
                shared_tracks AS (
                    SELECT COUNT(DISTINCT ut."trackId") as count
                    FROM user_tracks ut
                    JOIN friend_tracks ft ON ut."trackId" = ft."trackId"
                ),
                shared_artists AS (
                    SELECT COUNT(DISTINCT ua."artistId") as count
                    FROM user_artists ua
                    JOIN friend_artists fa ON ua."artistId" = fa."artistId"
                ),
                total_unique_tracks AS (
                    SELECT COUNT(DISTINCT "trackId") as count
                    FROM (
                        SELECT "trackId" FROM user_tracks
                        UNION
                        SELECT "trackId" FROM friend_tracks
                    ) as combined
                ),
                total_unique_artists AS (
                    SELECT COUNT(DISTINCT "artistId") as count
                    FROM (
                        SELECT "artistId" FROM user_artists
                        UNION
                        SELECT "artistId" FROM friend_artists
                    ) as combined
                )
                SELECT 
                    CASE 
                        WHEN (tut.count = 0 OR tua.count = 0) THEN 0
                        ELSE ROUND(((st.count::float / NULLIF(tut.count, 0)) * 0.5 + (sa.count::float / NULLIF(tua.count, 0)) * 0.5) * 100)
                    END as compatibility_score,
                    st.count as shared_tracks_count,
                    tut.count as total_unique_tracks,
                    sa.count as shared_artists_count,
                    tua.count as total_unique_artists
                    FROM shared_tracks st, shared_artists sa, 
                    total_unique_tracks tut, total_unique_artists tua
            `;

            const sharedArtists = await sql`
                WITH user_artists AS (
                    SELECT DISTINCT a."artistId", a."name"
                    FROM "trackHistory" th
                    JOIN artists a ON th."artistId" = a."artistId"
                    WHERE th."userId" = ${session.user.id}
                    AND th."timestamp" >= ${oneWeekAgo.toISOString()}
                ),
                friend_artists AS (
                    SELECT DISTINCT a."artistId", a."name"
                    FROM "trackHistory" th
                    JOIN artists a ON th."artistId" = a."artistId"
                    WHERE th."userId" = ${friendId}
                    AND th."timestamp" >= ${oneWeekAgo.toISOString()}
                )
                SELECT ua.*
                FROM user_artists ua
                JOIN friend_artists fa ON ua."artistId" = fa."artistId"
                LIMIT 5
            `;

            const sharedTracks = await sql`
                WITH user_tracks AS (
                    SELECT DISTINCT t."trackId", t."name", a."name" as "artistName"
                    FROM "trackHistory" th
                    JOIN tracks t ON th."trackId" = t."trackId"
                    JOIN artists a ON t."artistId" = a."artistId"
                    WHERE th."userId" = ${session.user.id}
                    AND th."timestamp" >= ${oneWeekAgo.toISOString()}
                ),
                friend_tracks AS (
                    SELECT DISTINCT t."trackId", t."name", a."name" as "artistName"
                    FROM "trackHistory" th
                    JOIN tracks t ON th."trackId" = t."trackId"
                    JOIN artists a ON t."artistId" = a."artistId"
                    WHERE th."userId" = ${friendId}
                    AND th."timestamp" >= ${oneWeekAgo.toISOString()}
                )
                SELECT ut.*
                FROM user_tracks ut
                JOIN friend_tracks ft ON ut."trackId" = ft."trackId"
                LIMIT 5
            `;

            const friendInfo = await sql`
                SELECT "userId", name, email FROM users WHERE "userId" = ${friendId}
            `;

            friendCompatibilityResults.push({
                friendId,
                friendInfo: friendInfo[0] || null,
                compatibilityScore: compatibilityResult[0]?.compatibility_score || 0,
                stats: {
                    sharedTracks: compatibilityResult[0]?.shared_tracks_count || 0,
                    totalUniqueTracks: compatibilityResult[0]?.total_unique_tracks || 0,
                    sharedArtists: compatibilityResult[0]?.shared_artists_count || 0,
                    totalUniqueArtists: compatibilityResult[0]?.total_unique_artists || 0
                },
                topSharedArtists: sharedArtists,
                topSharedTracks: sharedTracks
            });
        }

        return NextResponse.json(friendCompatibilityResults, { status: 200 });
    } catch {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}