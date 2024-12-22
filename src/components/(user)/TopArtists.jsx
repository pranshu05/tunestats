/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Grid } from 'lucide-react';

export default function TopArtists({ userId, viewMode, onViewModeChange }) {
    const [topArtists, setTopArtists] = useState([]);
    const [timeRange, setTimeRange] = useState("short_term");

    const timeRanges = [
        { value: 'short_term', label: 'Last 4 weeks' },
        { value: 'medium_term', label: 'Last 6 months' },
        { value: 'long_term', label: 'All time' }
    ];

    useEffect(() => {
        const fetchTopArtists = async () => {
            try {
                const res = await fetch(`/api/top-artists?userId=${userId}&timeRange=${timeRange}`);
                if (res.ok) {
                    const data = await res.json();
                    setTopArtists(data.topArtists);
                } else {
                    console.error("Failed to fetch top artists");
                }
            } catch (error) {
                console.error("Error fetching top artists:", error);
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
            {viewMode === 'list' ? (
                <div className="overflow-x-auto">
                    <div className="w-max min-w-full">
                        <div className="flex gap-4">
                            {topArtists.map((artist, index) => (
                                <a key={artist.id} href={artist.url} target="_blank" rel="noopener noreferrer" className="w-48 group">
                                    <div className="aspect-square mb-4">
                                        <img src={artist.image || "/placeholder.svg"} alt={artist.name} className="w-full h-full object-cover rounded-full" />
                                    </div>
                                    <div>
                                        <div className="font-medium mb-1 truncate group-hover:text-green-400">{artist.name}</div>
                                        <div className="text-sm text-zinc-400 truncate">{artist.genres}</div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {topArtists.map((artist, index) => (
                        <a key={artist.id} href={artist.url} target="_blank" rel="noopener noreferrer" className="group">
                            <div className="aspect-square mb-4">
                                <img src={artist.image || "/placeholder.svg"} alt={artist.name} className="w-full h-full object-cover rounded-full" />
                            </div>
                            <div>
                                <div className="font-medium mb-1 truncate group-hover:text-green-400">{artist.name}</div>
                                <div className="text-sm text-zinc-400 truncate">{artist.genres}</div>
                            </div>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}