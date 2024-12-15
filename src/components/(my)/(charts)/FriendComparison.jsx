/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { isMutualFriend } from "@/lib/isMutualFriend";
import { getAccessToken } from "@/lib/getAccessToken";
import { db } from "@/lib/firebaseConfig";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Tooltip, LabelList } from "recharts";
import Link from "next/link";
import Loader from "@/components/(layout)/Loader";

export default function FriendComparison({ userId }) {
    const [friends, setFriends] = useState([]);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTopGenres = async (userId) => {
        try {
            const accessToken = await getAccessToken(userId);
            const res = await fetch("https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=50", {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (!res.ok) throw new Error("Failed to fetch top artists");

            const data = await res.json();
            return data.items.flatMap((artist) => artist.genres);
        } catch (error) {
            console.error("Error fetching top genres:", error);
            return [];
        }
    };

    const calculateGenreMatch = (genres1, genres2) => {
        if (!genres1.length || !genres2.length) return 0;

        const uniqueGenres1 = new Set(genres1);
        const uniqueGenres2 = new Set(genres2);
        const intersection = [...uniqueGenres1].filter((genre) => uniqueGenres2.has(genre));

        return Math.round((intersection.length / Math.max(uniqueGenres1.size, uniqueGenres2.size)) * 100);
    };

    useEffect(() => {
        const fetchFriends = async () => {
            setLoading(true);
            try {
                const userRef = doc(db, "users", userId);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const allFriends = userDoc.data().friends || [];

                    const mutualFriends = [];
                    for (const friendId of allFriends) {
                        const isMutual = await isMutualFriend(userId, friendId);
                        if (isMutual) {
                            mutualFriends.push(friendId);
                        }
                    }
                    setFriends(mutualFriends);
                }
            } catch (error) {
                console.error("Error fetching friends:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFriends();
    }, [userId]);

    useEffect(() => {
        if (!friends.length) return;

        const fetchMatches = async () => {
            setLoading(true);
            try {
                const userGenres = await fetchTopGenres(userId);
                const results = await Promise.all(
                    friends.map(async (friendId) => {
                        const friendGenres = await fetchTopGenres(friendId);
                        const matchPercentage = calculateGenreMatch(userGenres, friendGenres);
                        const friendRef = doc(db, "users", friendId);
                        const friendDoc = await getDoc(friendRef);
                        const friendData = friendDoc.data();
                        return {
                            friendId,
                            matchPercentage,
                            name: friendData.name,
                            image: friendData.image
                        };
                    })
                );

                results.sort((a, b) => b.matchPercentage - a.matchPercentage);
                setMatches(results);
            } catch (error) {
                console.error("Error fetching matches:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, [friends, userId]);

    if (loading || !matches.length) return <Loader />;

    const topMatches = matches.slice(0, 3);
    const otherMatches = matches.slice(3);
    const maxMatchPercentage = otherMatches.length > 0 ? otherMatches[0].matchPercentage : 1;

    const adjustedMatches = otherMatches.map((match, index) => ({ ...match, fullWidth: index === 0 ? match.matchPercentage : 100, adjustedPercentage: (match.matchPercentage / maxMatchPercentage) * 100, }));

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#1F1F1F] p-2 rounded-md">
                    <p className="text-[#1DB954] font-bold">{`${payload[0].payload.matchPercentage}%`}</p>
                </div>
            );
        }
        return null;
    };

    const CustomBar = (props) => {
        const { x, y, width, height, friendId } = props;
        return (
            <Link href={`/user/${friendId}`}>
                <rect x={x} y={y} width={width} height={height} fill="#1DB954" rx={4} />
            </Link>
        );
    };

    const renderCustomizedLabel = (props) => {
        const { x, y, width, height, name, matchPercentage } = props;

        return (
            <g className="flex flex-col lg:flex-row items-center lg:justify-between gap-2">
                <text x={x + width - 35} y={y + height / 2} fill="#ffffff" textAnchor="end" dominantBaseline="central" className="text-sm font-medium">{matchPercentage}</text>
                <text x={x + 10} y={y + height / 2} fill="#ffffff" textAnchor="start" dominantBaseline="central" className="text-sm font-medium">{name}</text>
            </g>
        );
    };

    return (
        <div className="flex flex-col items-center p-3 gap-3 bg-[#121212] rounded-md w-full">
            <h2 className="text-2xl font-bold text-center">Friends Music Matches</h2>
            <div className="w-full">
                <h3 className="text-xl font-bold text-[#1DB954] mb-4">Top Matches</h3>
                <div className="space-y-4">
                    {topMatches.map((match, index) => (
                        <Link href={`/user/${match.friendId}`} key={match.friendId} className="flex items-center justify-between bg-[#1F1F1F] p-4 rounded-lg">
                            <div className="flex items-center gap-4">
                                <span className="text-2xl font-bold">{index + 1}</span>
                                <img src={match.image === "unknown" ? "https://github.com/user-attachments/assets/bf57cb96-b259-4290-b35b-0ede9d618802" : match.image} alt={match.name} className="w-12 h-12 rounded-full object-cover" />
                                <div>
                                    <p className="font-semibold">{match.name}</p>
                                    <p className="text-sm text-[#888]">Music Match</p>
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-[#1DB954]">
                                {match.matchPercentage}%
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            {adjustedMatches.length > 0 && (
                <div className="w-full mt-8">
                    <h3 className="text-xl font-bold mb-4">Other Matches</h3>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={adjustedMatches} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <XAxis type="number" domain={[0, 100]} hide />
                                <YAxis dataKey="name" type="category" hide />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="adjustedPercentage" shape={<CustomBar />}>
                                    <LabelList dataKey="adjustedPercentage" content={renderCustomizedLabel} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
}