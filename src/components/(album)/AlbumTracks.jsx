/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import Loader from "@/components/(layout)/Loader";

export default function AlbumTracks({ userId, tracks }) {
    const [trackDetails, setTrackDetails] = useState([]);

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

    return (
        <div className="bg-zinc-900/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Tracks</h2>
            </div>
            {trackDetails && trackDetails.length > 0 ? (
                <div className="space-y-2">
                    {trackDetails.map((track) => (
                        <a href={`/track/${track.trackId}`} key={track.trackId} className="flex items-center gap-4 p-2 rounded-lg hover:bg-zinc-800/50 transition-colors">
                            <img src={track.trackAlbumImageUrl || "/placeholder.svg"} alt={track.trackName} className="w-12 h-12 rounded-md object-cover" />
                            <div className="flex-grow min-w-0">
                                <h4 className="text-sm font-semibold truncate">{track.trackName}</h4>
                                <p className="text-xs text-gray-400 truncate">{track.trackArtists}</p>
                            </div>
                        </a>
                    ))}
                </div>
            ) : (
                <Loader />
            )}
        </div>
    );
}