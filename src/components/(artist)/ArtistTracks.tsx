/* eslint-disable @next/next/no-img-element */
"use client";
import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";
import FetchError from '../(layout)/FetchError';
import FetchLoader from '../(layout)/FetchLoader';

interface Track {
    trackId: string;
    imageUrl: string;
    name: string;
    albumName: string;
}

export default function ArtistTracks({ artistId }: { artistId: string }) {
    const { data: tracks, error } = useSWR<Track[]>(`/api/artist/${artistId}/tracks`, fetcher);

    if (error) return <FetchError />;
    if (!tracks) return <FetchLoader />;

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Tracks</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
                {tracks.map(track => (
                    <a href={`/track/${track.trackId}`} key={track.trackId} className="w-32 lg:w-36 flex-shrink-0 rounded border border-white p-2 text-center">
                        <div className="aspect-square">
                            <img src={track.imageUrl} alt={track.name} className="w-full h-full rounded object-cover" />
                        </div>
                        <p className="mt-1 text-sm font-semibold">{track.name}</p>
                    </a>
                ))}
            </div>
        </div>
    );
}