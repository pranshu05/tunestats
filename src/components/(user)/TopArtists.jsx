/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Grid } from 'lucide-react';
import Loader from "../(layout)/Loader";

export default function TopArtists({ userId, viewMode, onViewModeChange }) {
    const [topArtists, setTopArtists] = useState([]);
    const [timeRange, setTimeRange] = useState("week");
    const [loading, setLoading] = useState(true);

    const timeRanges = [
        { value: 'week', label: 'Last week' },
        { value: 'month', label: 'Last month' },
        { value: 'year', label: 'Last Year' }
    ];

    useEffect(() => {
        const fetchTopArtists = async () => {
            try {
                const res = await fetch(`/api/getUserTopArtists?userId=${userId}&timeRange=${timeRange}`);
                if (res.ok) {
                    const data = await res.json();
                    setTopArtists(data.topArtists);
                    setLoading(false);
                } else {
                    console.error("Failed to fetch top artists");
                }
            } catch (error) {
                console.error("Error fetching top artists:", error);
                setLoading(false);
            }
        };

        if (userId) {
            fetchTopArtists();
        }
    }, [userId, timeRange]);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Top Artists</h2>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-[180px] mt-2 bg-transparent border-none text-sm text-zinc-400 hover:text-white"><SelectValue /></SelectTrigger>
                        <SelectContent>{timeRanges.map(range => (<SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>))}</SelectContent>
                    </Select>
                </div>
                <Button variant="ghost" size="icon" onClick={() => onViewModeChange(viewMode === 'grid' ? 'list' : 'grid')} className="rounded-full hover:bg-white/10">{viewMode === 'list' ? <LayoutGrid className="w-5 h-5" /> : <Grid className="w-5 h-5" />}</Button>
            </div>
            {loading ? <Loader /> : (
                viewMode === 'list' ? (
                    <div className="overflow-x-auto">
                        <div className="w-max min-w-full">
                            <div className="flex gap-4">
                                {topArtists.map((artist) => (
                                    <a key={artist.artistId} href={`/artist/${artist.artistId}`} className="w-32 lg:w-36 group">
                                        <div className="aspect-square mb-4">
                                            <img src={artist.artistImage || "/placeholder.svg"} alt={artist.artistName} className="w-full h-full object-cover rounded-full" />
                                        </div>
                                        <div>
                                            <div className="font-medium mb-1 truncate group-hover:text-green-400">{artist.artistName}</div>
                                            <div className="text-sm text-zinc-400 truncate">{artist.artistGenres}</div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {topArtists.map((artist) => (
                            <a key={artist.artistId} href={`/artist/${artist.artistId}`} className="group">
                                <div className="aspect-square mb-4">
                                    <img src={artist.artistImage || "/placeholder.svg"} alt={artist.artistName} className="w-full h-full object-cover rounded-full" />
                                </div>
                                <div>
                                    <div className="font-medium mb-1 truncate group-hover:text-green-400">{artist.artistName}</div>
                                    <div className="text-sm text-zinc-400 truncate">{artist.artistGenres}</div>
                                </div>
                            </a>
                        ))}
                    </div>
                )
            )}
        </div>
    );
}