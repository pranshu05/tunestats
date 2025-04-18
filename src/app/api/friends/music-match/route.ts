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
        const oneWeekAgoIso = oneWeekAgo.toISOString();

        const friendCompatibilityResults = [];

        for (const friend of friends) {
            const friendId = friend.friend_id;

            const compatibilityData = await sql`
                WITH 
                user_history AS (
                    SELECT th."trackId", th."artistId"
                    FROM "trackHistory" th
                    WHERE th."userId" = ${session.user.id}
                    AND th."timestamp" >= ${oneWeekAgoIso}
                ),
                friend_history AS (
                    SELECT th."trackId", th."artistId"
                    FROM "trackHistory" th
                    WHERE th."userId" = ${friendId}
                    AND th."timestamp" >= ${oneWeekAgoIso}
                ),
                user_artists AS (
                    -- Primary artists from user's history 
                    SELECT DISTINCT uh."artistId" 
                    FROM user_history uh
                    UNION
                    -- Featured artists from user's tracks
                    SELECT DISTINCT tf."artistId"
                    FROM user_history uh
                    JOIN "trackFeaturedArtists" tf ON uh."trackId" = tf."trackId"
                ),
                friend_artists AS (
                    -- Primary artists from friend's history
                    SELECT DISTINCT fh."artistId" 
                    FROM friend_history fh
                    UNION
                    -- Featured artists from friend's tracks
                    SELECT DISTINCT tf."artistId"
                    FROM friend_history fh
                    JOIN "trackFeaturedArtists" tf ON fh."trackId" = tf."trackId"
                ),
                user_genres AS (
                    SELECT DISTINCT unnest(a.genres) as genre
                    FROM user_artists ua
                    JOIN artists a ON ua."artistId" = a."artistId"
                ),
                friend_genres AS (
                    SELECT DISTINCT unnest(a.genres) as genre
                    FROM friend_artists fa
                    JOIN artists a ON fa."artistId" = a."artistId"
                ),
                shared_tracks AS (
                    SELECT COUNT(DISTINCT uh."trackId") as count
                    FROM user_history uh
                    JOIN friend_history fh ON uh."trackId" = fh."trackId"
                ),
                shared_artists AS (
                    SELECT COUNT(DISTINCT ua."artistId") as count
                    FROM user_artists ua
                    JOIN friend_artists fa ON ua."artistId" = fa."artistId"
                ),
                total_unique_tracks AS (
                    SELECT COUNT(DISTINCT "trackId") as count
                    FROM (
                        SELECT "trackId" FROM user_history
                        UNION
                        SELECT "trackId" FROM friend_history
                    ) as combined
                ),
                total_unique_artists AS (
                    SELECT COUNT(DISTINCT "artistId") as count
                    FROM (
                        SELECT "artistId" FROM user_artists
                        UNION
                        SELECT "artistId" FROM friend_artists
                    ) as combined
                ),
                shared_genres AS (
                    SELECT COUNT(DISTINCT ug.genre) as count
                    FROM user_genres ug
                    JOIN friend_genres fg ON ug.genre = fg.genre
                ),
                total_unique_genres AS (
                    SELECT COUNT(DISTINCT genre) as count
                    FROM (
                        SELECT genre FROM user_genres
                        UNION
                        SELECT genre FROM friend_genres
                    ) as combined
                )
                SELECT 
                    CASE 
                        WHEN tug.count = 0 THEN 0
                        ELSE ROUND(
                            -- Genre similarity has 70% weight
                            ((sg.count::float / NULLIF(tug.count, 0)) * 0.7 + 
                            -- Artist similarity has 20% weight
                             (CASE WHEN tua.count = 0 THEN 0 
                              ELSE (sa.count::float / NULLIF(tua.count, 0)) END) * 0.2 +
                            -- Track similarity has 10% weight
                             (CASE WHEN tut.count = 0 THEN 0 
                              ELSE (st.count::float / NULLIF(tut.count, 0)) END) * 0.1) * 100
                        )
                    END as compatibility_score,
                    st.count as shared_tracks_count,
                    tut.count as total_unique_tracks,
                    sa.count as shared_artists_count,
                    tua.count as total_unique_artists,
                    sg.count as shared_genres_count,
                    tug.count as total_unique_genres
                FROM shared_tracks st, shared_artists sa, shared_genres sg,
                total_unique_tracks tut, total_unique_artists tua, total_unique_genres tug
            `;

            const sharedItems = await sql`
                WITH 
                user_history AS (
                    SELECT th."trackId", th."artistId"
                    FROM "trackHistory" th
                    WHERE th."userId" = ${session.user.id}
                    AND th."timestamp" >= ${oneWeekAgoIso}
                ),
                friend_history AS (
                    SELECT th."trackId", th."artistId"
                    FROM "trackHistory" th
                    WHERE th."userId" = ${friendId}
                    AND th."timestamp" >= ${oneWeekAgoIso}
                ),
                user_artists AS (
                    -- Primary artists from user's history 
                    SELECT DISTINCT uh."artistId" 
                    FROM user_history uh
                    UNION
                    -- Featured artists from user's tracks
                    SELECT DISTINCT tf."artistId"
                    FROM user_history uh
                    JOIN "trackFeaturedArtists" tf ON uh."trackId" = tf."trackId"
                ),
                friend_artists AS (
                    -- Primary artists from friend's history
                    SELECT DISTINCT fh."artistId" 
                    FROM friend_history fh
                    UNION
                    -- Featured artists from friend's tracks
                    SELECT DISTINCT tf."artistId"
                    FROM friend_history fh
                    JOIN "trackFeaturedArtists" tf ON fh."trackId" = tf."trackId"
                ),
                shared_artists_data AS (
                    SELECT DISTINCT a."artistId", a."name"
                    FROM user_artists ua
                    JOIN friend_artists fa ON ua."artistId" = fa."artistId"
                    JOIN artists a ON ua."artistId" = a."artistId"
                    LIMIT 5
                ),
                shared_tracks_data AS (
                    SELECT DISTINCT t."trackId", t."name", a."name" as "artistName"
                    FROM user_history uh
                    JOIN friend_history fh ON uh."trackId" = fh."trackId"
                    JOIN tracks t ON uh."trackId" = t."trackId"
                    JOIN artists a ON t."artistId" = a."artistId"
                    LIMIT 5
                ),
                user_genres AS (
                    SELECT DISTINCT unnest(a.genres) as genre
                    FROM user_artists ua
                    JOIN artists a ON ua."artistId" = a."artistId"
                ),
                friend_genres AS (
                    SELECT DISTINCT unnest(a.genres) as genre
                    FROM friend_artists fa
                    JOIN artists a ON fa."artistId" = a."artistId"
                ),
                shared_genres_data AS (
                    SELECT DISTINCT ug.genre
                    FROM user_genres ug
                    JOIN friend_genres fg ON ug.genre = fg.genre
                    LIMIT 8
                )
                SELECT 
                    json_agg(DISTINCT sad.*) as shared_artists,
                    (SELECT json_agg(DISTINCT std.*) FROM shared_tracks_data std) as shared_tracks,
                    (SELECT json_agg(DISTINCT sgd.genre) FROM shared_genres_data sgd) as shared_genres
                FROM shared_artists_data sad
            `;

            const friendInfo = await sql`
                SELECT "userId", name, email FROM users WHERE "userId" = ${friendId}
            `;

            const compatibilityResult = compatibilityData[0];
            const sharedArtists = sharedItems[0]?.shared_artists || [];
            const sharedTracks = sharedItems[0]?.shared_tracks || [];
            const sharedGenres = sharedItems[0]?.shared_genres || [];

            let compatibilityScore = compatibilityResult?.compatibility_score || 0;

            if (compatibilityResult?.shared_genres_count > 0) {
                const genreSimilarityRatio = compatibilityResult.shared_genres_count /
                    compatibilityResult.total_unique_genres;

                if (genreSimilarityRatio >= 0.6) {
                    compatibilityScore = Math.min(100, Math.round(compatibilityScore * 1.3));
                } else if (genreSimilarityRatio >= 0.4) {
                    compatibilityScore = Math.min(100, Math.round(compatibilityScore * 1.2));
                } else if (genreSimilarityRatio >= 0.2) {
                    compatibilityScore = Math.min(100, Math.round(compatibilityScore * 1.1));
                }
            }

            friendCompatibilityResults.push({
                friendId,
                friendInfo: friendInfo[0] || null,
                compatibilityScore,
                stats: {
                    sharedTracks: compatibilityResult?.shared_tracks_count || 0,
                    totalUniqueTracks: compatibilityResult?.total_unique_tracks || 0,
                    sharedArtists: compatibilityResult?.shared_artists_count || 0,
                    totalUniqueArtists: compatibilityResult?.total_unique_artists || 0,
                    sharedGenres: compatibilityResult?.shared_genres_count || 0,
                    totalUniqueGenres: compatibilityResult?.total_unique_genres || 0
                },
                topSharedArtists: sharedArtists,
                topSharedTracks: sharedTracks,
                topSharedGenres: sharedGenres
            });
        }

        friendCompatibilityResults.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

        return NextResponse.json(friendCompatibilityResults, { status: 200 });
    } catch (error) {
        console.error("Error calculating compatibility:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}