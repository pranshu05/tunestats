/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Grid } from 'lucide-react';
import Loader from "../(layout)/Loader";

export default function TopSongs({ userId, viewMode, onViewModeChange }) {
    const [topTracks, setTopTracks] = useState([]);
    const [timeRange, setTimeRange] = useState("week");
    const [loading, setLoading] = useState(true);

    const timeRanges = [
        { value: 'week', label: 'Last Week' },
        { value: 'month', label: 'Last Month' },
        { value: 'year', label: 'Last Year' }
    ];

    useEffect(() => {
        const fetchTopTracks = async () => {
            try {
                const res = await fetch(`/api/getUserTopTracks?userId=${userId}&timeRange=${timeRange}`);
                if (res.ok) {
                    const data = await res.json();
                    setTopTracks(data.topTracks);
                    setLoading(false);
                } else {
                    console.error("Failed to fetch top tracks");
                }
            } catch (error) {
                console.error("Error fetching top tracks:", error);
                setLoading(false);
            }
        };

        if (userId) {
            fetchTopTracks();
        }
    }, [userId, timeRange]);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Top Songs</h2>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-[180px] mt-2 bg-transparent border-none text-sm text-zinc-400 hover:text-white"><SelectValue /></SelectTrigger>
                        <SelectContent>{timeRanges.map(range => (<SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>))}</SelectContent>
                    </Select>
                </div>
                <Button variant="ghost" size="icon" onClick={() => onViewModeChange(viewMode === 'grid' ? 'list' : 'grid')} className="rounded-full hover:bg-white/10">{viewMode === 'list' ? <LayoutGrid className="w-5 h-5" /> : <Grid className="w-5 h-5" />}</Button>
            </div>
            {loading ? <Loader /> :
                viewMode === 'list' ? (
                    <div className="overflow-x-auto">
                        <div className="w-max min-w-full">
                            <div className="flex gap-4">
                                {topTracks.map((track) => (
                                    <a key={track.trackId} href={`/track/${track.trackId}`} className="w-32 lg:w-36 group">
                                        <div className="aspect-square mb-4">
                                            <img src={track.trackAlbumImage || "/placeholder.svg"} alt={track.trackname} className="w-full h-full object-cover rounded-md" />
                                        </div>
                                        <div>
                                            <div className="font-medium mb-1 truncate group-hover:text-green-400">{track.trackName}</div>
                                            <div className="text-sm text-zinc-400 truncate">{track.trackArtists}</div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {topTracks.map((track) => (
                            <a key={track.trackId} href={`/track/${track.trackId}`} className="group">
                                <div className="aspect-square mb-4">
                                    <img src={track.trackAlbumImage || "/placeholder.svg"} alt={track.trackName} className="w-full h-full object-cover rounded-md" />
                                </div>
                                <div>
                                    <div className="font-medium mb-1 truncate group-hover:text-green-400">{track.trackName}</div>
                                    <div className="text-sm text-zinc-400 truncate">{track.trackArtists}</div>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
        </div>
    );
}