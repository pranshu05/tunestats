/* eslint-disable @next/next/no-img-element */
"use client";
import useSWR from "swr";
import {fetcher} from "@/utils/fetcher";
import FetchError from '../(layout)/FetchError';
import FetchLoader from '../(layout)/FetchLoader';

interface Track {
    trackId: string;
    name: string;
    image: string;
    duration: number;
    imageUrl: string;
}

export default function AlbumTracks({ albumId }: { albumId: string }) {
    const { data: tracks, error } = useSWR<Track[]>(`/api/album/${albumId}/tracks`, fetcher);

    if (error) return <FetchError />;
    if (!tracks) return <FetchLoader />;

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Tracks</h2>
            <ul className="space-y-2">
                {tracks.map((track) => (
                    <a href={`/track/${track.trackId}`} key={track.trackId} className="border border-white rounded p-2 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <img src={track.imageUrl} alt={track.name} className="w-12 h-12 rounded" />
                            <span>{track.name}</span>
                        </div>
                        <span className="text-sm text-zinc-400">{Math.floor(track.duration / 1000 / 60)}:{String(track.duration % 60).padStart(2, "0")}</span>
                    </a>
                ))}
            </ul>
        </div>
    )
}