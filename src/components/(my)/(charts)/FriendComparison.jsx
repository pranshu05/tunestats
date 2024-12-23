/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import Link from "next/link";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Tooltip, LabelList } from "recharts";
import Loader from "@/components/(layout)/Loader";

export default function FriendComparison({ userId }) {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatches = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/friend-comparison?userId=${userId}`);
                if (res.ok) {
                    const data = await res.json();
                    setMatches(data.matches);
                } else {
                    console.error("Failed to fetch friend matches");
                }
            } catch (error) {
                console.error("Error fetching friend matches:", error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchMatches();
        }
    }, [userId]);

    if (loading) return <Loader />;

    const topMatches = matches.slice(0, 3);
    const otherMatches = matches.slice(3);
    const maxMatchPercentage = otherMatches.length > 0 ? otherMatches[0].matchPercentage : 1;

    const adjustedMatches = otherMatches.map((match, index) => ({
        ...match,
        fullWidth: index === 0 ? match.matchPercentage : 100,
        adjustedPercentage: (match.matchPercentage / maxMatchPercentage) * 100,
    }));

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-zinc-900 p-2 rounded-md">
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
            <g>
                <text x={x + width - 35} y={y + height / 2} fill="#ffffff" textAnchor="end" dominantBaseline="central" className="text-sm font-medium">{matchPercentage}</text>
                <text x={x + 10} y={y + height / 2} fill="#ffffff" textAnchor="start" dominantBaseline="central" className="text-sm font-medium">{name}</text>
            </g>
        );
    };

    return (
        <div className="flex flex-col items-center p-4 gap-4 bg-zinc-900/50 rounded-md w-full">
            <h2 className="text-2xl font-bold text-center">Friends Music Matches</h2>
            <div className="w-full">
                <h3 className="text-xl font-bold text-[#1DB954] mb-4">Top Matches</h3>
                <div className="space-y-4">
                    {topMatches.map((match, index) => (
                        <Link href={`/user/${match.friendId}`} key={match.friendId} className="flex items-center justify-between bg-zinc-800/50 p-4 rounded-lg">
                            <div className="flex items-center gap-4">
                                <span className="text-2xl font-bold">{index + 1}</span>
                                <img src={match.image} alt={match.name} className="w-12 h-12 rounded-full object-cover" />
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