/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { getAccessToken } from "@/lib/getAccessToken";

export default function TopGenres({ userId }) {
    const [accessToken, setAccessToken] = useState(null);
    const [topGenres, setTopGenres] = useState([]);
    const [timeRange, setTimeRange] = useState("short_term");

    useEffect(() => {
        const fetchAccessToken = async () => {
            try {
                const token = await getAccessToken(userId);
                setAccessToken(token);
            } catch (error) {
                console.error("Error fetching access token:", error);
            }
        };

        if (userId) {
            fetchAccessToken();
        }
    }, [userId]);

    useEffect(() => {
        if (!accessToken) return;

        const fetchTopGenres = async () => {
            try {
                const res = await fetch(
                    `https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=50`,
                    {
                        method: "GET",
                        headers: { Authorization: `Bearer ${accessToken}` },
                    }
                );

                if (res.ok) {
                    const data = await res.json();

                    const genreCounts = {};
                    data.items.forEach((artist) => {
                        artist.genres.forEach((genre) => {
                            genreCounts[genre] = (genreCounts[genre] || 0) + 1;
                        });
                    });

                    const sortedGenres = Object.entries(genreCounts)
                        .map(([genre, count]) => ({ genre, count }))
                        .sort((a, b) => b.count - a.count)
                        .slice(0, 10);

                    setTopGenres(sortedGenres);
                } else {
                    console.error("Failed to fetch top artists", res.statusText);
                }
            } catch (error) {
                console.error("Error fetching top genres:", error);
            }
        };

        fetchTopGenres();
    }, [accessToken, timeRange]);

    const handleTimeRangeChange = (range) => {
        setTimeRange(range);
    };

    return (
        <div className="relative h-full overflow-y-auto bg-[#121212] rounded-lg flex flex-col p-3 gap-3">
            <div className="flex flex-col gap-3">
                <h2 className="text-2xl font-bold">Top Genres</h2>
                <div className="flex gap-2 justify-center">
                    <button onClick={() => handleTimeRangeChange("short_term")} className={`px-3 py-1 rounded-md ${timeRange === "short_term" ? "bg-[#1DB954]" : "bg-[#1F1F1F]"}`}>Last Week</button>
                    <button onClick={() => handleTimeRangeChange("medium_term")} className={`px-3 py-1 rounded-md ${timeRange === "medium_term" ? "bg-[#1DB954]" : "bg-[#1F1F1F]"}`}>Last Month</button>
                    <button onClick={() => handleTimeRangeChange("long_term")} className={`px-3 py-1 rounded-md ${timeRange === "long_term" ? "bg-[#1DB954]" : "bg-[#1F1F1F]"}`}>Last Yeart</button>
                </div>
            </div>
            <div className="flex flex-col gap-3">
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