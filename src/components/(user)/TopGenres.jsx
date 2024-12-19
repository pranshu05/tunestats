/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";

export default function TopGenres({ userId }) {
    const [topGenres, setTopGenres] = useState([]);
    const [timeRange, setTimeRange] = useState("short_term");

    useEffect(() => {
        const fetchTopGenres = async () => {
            try {
                const res = await fetch(`/api/top-genres?userId=${userId}&timeRange=${timeRange}`);
                if (res.ok) {
                    const data = await res.json();
                    setTopGenres(data.topGenres);
                } else {
                    console.error("Failed to fetch top genres");
                }
            } catch (error) {
                console.error("Error fetching top genres:", error);
            }
        };

        if (userId) {
            fetchTopGenres();
        }
    }, [userId, timeRange]);

    const handleTimeRangeChange = (range) => {
        setTimeRange(range);
    };

    return (
        <div className="relative h-full overflow-y-auto bg-[#121212] rounded-lg flex flex-col p-3 gap-3">
            <div className="flex flex-col gap-3">
                <h2 className="text-2xl font-bold">Top Genres</h2>
                <div className="flex gap-2 justify-center">
                    <button onClick={() => handleTimeRangeChange("short_term")} className={`px-3 py-1 rounded-md ${timeRange === "short_term" ? "bg-[#1DB954]" : "bg-[#1F1F1F]"}`}>Last Month</button>
                    <button onClick={() => handleTimeRangeChange("medium_term")} className={`px-3 py-1 rounded-md ${timeRange === "medium_term" ? "bg-[#1DB954]" : "bg-[#1F1F1F]"}`}>Last 6 Months</button>
                    <button onClick={() => handleTimeRangeChange("long_term")} className={`px-3 py-1 rounded-md ${timeRange === "long_term" ? "bg-[#1DB954]" : "bg-[#1F1F1F]"}`}>All Time</button>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                {topGenres.map((genre) => (
                    <div key={genre.genre} className="flex flex-col items-center bg-[#1F1F1F] rounded-lg p-3 text-center">
                        <h3 className="text-base font-semibold">{genre.genre}</h3>
                        <p className="text-sm text-[#888]">{genre.count} artists</p>
                    </div>
                ))}
            </div>
        </div>
    );
}