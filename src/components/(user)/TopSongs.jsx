/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";

export default function TopSongs({ userId }) {
    const [topTracks, setTopTracks] = useState([]);
    const [timeRange, setTimeRange] = useState("short_term");

    useEffect(() => {
        const fetchTopTracks = async () => {
            try {
                const res = await fetch(`/api/top-tracks?userId=${userId}&timeRange=${timeRange}`);
                if (res.ok) {
                    const data = await res.json();
                    setTopTracks(data.topTracks);
                } else {
                    console.error("Failed to fetch top tracks");
                }
            } catch (error) {
                console.error("Error fetching top tracks:", error);
            }
        };

        if (userId) {
            fetchTopTracks();
        }
    }, [userId, timeRange]);

    const handleTimeRangeChange = (range) => {
        setTimeRange(range);
    };

    return (
        <div className="flex flex-col rounded-md gap-3 overflow-y-auto">
            <div className="flex flex-col lg:flex-row lg:justify-between items-center gap-3">
                <h2 className="text-2xl font-bold">Top Songs</h2>
                <div className="flex gap-2">
                    <button onClick={() => handleTimeRangeChange("short_term")} className={`px-3 py-1 rounded-md ${timeRange === "short_term" ? "bg-[#1DB954]" : "bg-[#1F1F1F]"}`}>Last Month</button>
                    <button onClick={() => handleTimeRangeChange("medium_term")} className={`px-3 py-1 rounded-md ${timeRange === "medium_term" ? "bg-[#1DB954]" : "bg-[#1F1F1F]"}`}>Last 6 Months</button>
                    <button onClick={() => handleTimeRangeChange("long_term")} className={`px-3 py-1 rounded-md ${timeRange === "long_term" ? "bg-[#1DB954]" : "bg-[#1F1F1F]"}`}>All Time</button>
                </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {topTracks.map((track) => (
                    <a href={track.url} target="_blank" key={track.id} className="flex flex-col items-center bg-[#1F1F1F] rounded-lg p-3 text-center">
                        <img src={track.image || "https://via.placeholder.com/150"} alt={track.name} className="w-24 h-24 rounded-full mb-2 object-cover" />
                        <h3 className="text-base font-semibold">{track.name}</h3>
                        <p className="text-sm text-[#888]">{track.artist}</p>
                    </a>
                ))}
            </div>
        </div>
    );
}