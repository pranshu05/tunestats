/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { getAccessToken } from "@/lib/getAccessToken";

export default function TopArtists({ userId }) {
    const [accessToken, setAccessToken] = useState(null);
    const [topArtists, setTopArtists] = useState([]);
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

        const fetchTopArtists = async () => {
            try {
                const res = await fetch(`https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=9`, { method: "GET", headers: { Authorization: `Bearer ${accessToken}` }, });

                if (res.ok) {
                    const data = await res.json();
                    setTopArtists(data.items);
                } else {
                    console.error("Failed to fetch top artists", res.statusText);
                }
            } catch (error) {
                console.error("Error fetching top artists data:", error);
            }
        };

        fetchTopArtists();
    }, [accessToken, timeRange]);

    const handleTimeRangeChange = (range) => {
        setTimeRange(range);
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col lg:flex-row lg:justify-between items-center gap-3">
                <h2 className="text-2xl font-bold">Top Artists</h2>
                <div className="flex gap-2">
                    <button onClick={() => handleTimeRangeChange("short_term")} className={`px-3 py-1 rounded-md ${timeRange === "short_term" ? "bg-[#1DB954]" : "bg-[#1F1F1F]"}`}>Last Month</button>
                    <button onClick={() => handleTimeRangeChange("medium_term")} className={`px-3 py-1 rounded-md ${timeRange === "medium_term" ? "bg-[#1DB954]" : "bg-[#1F1F1F]"}`}>Last 6 Months</button>
                    <button onClick={() => handleTimeRangeChange("long_term")} className={`px-3 py-1 rounded-md ${timeRange === "long_term" ? "bg-[#1DB954]" : "bg-[#1F1F1F]"}`}>Last Year</button>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-4">
                {topArtists.map((artist) => (
                    <a href={artist.external_urls.spotify} target="_blank" key={artist.id}className="flex flex-col items-center bg-[#1F1F1F] rounded-lg p-3 text-center">
                        <img src={artist.images[0]?.url || "https://via.placeholder.com/150"}alt={artist.name}className="w-24 h-24 rounded-full mb-2 object-cover"/>
                        <h3 className="text-base font-semibold">{artist.name}</h3>
                        <p className="text-sm text-[#888]">{artist.genres.slice(0, 2).join(", ")}</p>
                    </a>
                ))}
            </div>
        </div>
    );
}