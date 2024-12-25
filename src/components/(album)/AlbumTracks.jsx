/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Grid } from "lucide-react";
import Loader from "@/components/(layout)/Loader";

export default function AlbumTracks({ userId, tracks }) {
    const [trackDetails, setTrackDetails] = useState([]);
    const [viewMode, setViewMode] = useState("list");

    useEffect(() => {
        const fetchTracks = async () => {
            try {
                const trackPromises = tracks.map(async (track) => {
                    const res = await fetch(`/api/getTrack?trackId=${track.id}&userId=${userId}`);
                    if (res.ok) {
                        const data = await res.json();
                        return data.track;
                    } else {
                        console.error(`Failed to fetch details for track ${track.id}`);
                        return null;
                    }
                });

                const resolvedTracks = await Promise.all(trackPromises);
                setTrackDetails(resolvedTracks.filter(Boolean));
            } catch (error) {
                console.error("Error fetching track details:", error);
            }
        };

        fetchTracks();
    }, [userId, tracks]);

    const toggleViewMode = () => {
        setViewMode(viewMode === "grid" ? "list" : "grid");
    };

    return (
        <div className="bg-zinc-900/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Tracks</h2>
                <Button variant="ghost" size="icon" onClick={toggleViewMode} className="rounded-full hover:bg-white/10">
                    {viewMode === "list" ? (
                        <LayoutGrid className="w-5 h-5" />
                    ) : (
                        <Grid className="w-5 h-5" />
                    )}
                </Button>
            </div>
            {trackDetails && trackDetails.length > 0 ? (
                viewMode === "list" ? (
                    <div className="overflow-x-auto">
                        <div className="w-max min-w-full">
                            <div className="flex gap-4">
                                {trackDetails.map((track) => (
                                    <a key={track.trackId} href={`/track/${track.trackId}`} className="w-32 lg:w-36 group">
                                        <div className="aspect-square mb-4">
                                            <img src={track.trackAlbumImageUrl || "/placeholder.svg"} alt={track.trackName} className="w-full h-full object-cover rounded-md" />
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
                        {trackDetails.map((track) => (
                            <a key={track.trackId} href={`/track/${track.trackId}`} className="group">
                                <div className="aspect-square mb-4">
                                    <img src={track.trackAlbumImageUrl || "/placeholder.svg"} alt={track.trackName} className="w-full h-full object-cover rounded-md" />
                                </div>
                                <div>
                                    <div className="font-medium mb-1 truncate group-hover:text-green-400">{track.trackName}</div>
                                    <div className="text-sm text-zinc-400 truncate">{track.trackArtists}</div>
                                </div>
                            </a>
                        ))}
                    </div>
                )
            ) : (
                <Loader />
            )}
        </div>
    );
}