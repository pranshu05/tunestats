import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Loader from "../(layout)/Loader";

export default function TopGenres({ userId }) {
    const [topGenres, setTopGenres] = useState([]);
    const [timeRange, setTimeRange] = useState("short_term");
    const [loading, setLoading] = useState(true);

    const timeRanges = [
        { value: 'short_term', label: 'Last 4 weeks' },
        { value: 'medium_term', label: 'Last 6 months' },
        { value: 'long_term', label: 'All time' }
    ];

    useEffect(() => {
        const fetchTopGenres = async () => {
            try {
                const res = await fetch(`/api/getUserTopGenres?userId=${userId}&timeRange=${timeRange}`);
                if (res.ok) {
                    const data = await res.json();
                    setTopGenres(data.topGenres);
                    setLoading(false);
                } else {
                    console.error("Failed to fetch top genres");
                }
            } catch (error) {
                console.error("Error fetching top genres:", error);
                setLoading(false);
            }
        };

        if (userId) {
            fetchTopGenres();
        }
    }, [userId, timeRange]);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Top Genres</h2>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-[180px] mt-2 bg-transparent border-none text-sm text-zinc-400 hover:text-white"><SelectValue /></SelectTrigger>
                        <SelectContent>{timeRanges.map(range => (<SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>))}</SelectContent>
                    </Select>
                </div>
            </div>
            {loading && <Loader />}
            <div className="overflow-x-auto">
                <div className="w-max min-w-full">
                    <div className="flex gap-4">
                        {topGenres.map((genre) => (
                            <div key={genre.genre} className="px-4 py-2 bg-zinc-800/50 rounded-lg">
                                <div className="font-medium text-base">{genre.genre}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}