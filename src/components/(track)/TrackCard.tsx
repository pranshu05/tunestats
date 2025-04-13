/* eslint-disable @next/next/no-img-element */
'use client';
import useSWR from 'swr';
import { fetcher } from '@/utils/fetcher';
import FetchError from '../(layout)/FetchError';
import FetchLoader from '../(layout)/FetchLoader';

interface Track {
    trackId: string;
    name: string;
    imageUrl: string;
    duration: number;
    popularity: number;
};

export default function TrackCard({ trackId }: { trackId: string }) {
    const { data: track, error } = useSWR<Track>(`/api/track/${trackId}`, fetcher);

    if (error) return <FetchError />;
    if (!track) return <FetchLoader />;

    return (
        <div className="border border-white bg-black rounded-md p-4 flex flex-col md:flex-row gap-4 w-full">
            <img src={track.imageUrl} alt={track.name} width={150} height={150} className="rounded-md object-cover" />
            <div className="flex flex-col">
                <h1 className="text-2xl font-bold mb-1">{track.name}</h1>
                <p className="text-sm text-gray-400">Duration: {Math.floor(track.duration / 1000 / 60)}:{String(track.duration % 60).padStart(2, "0")} mins</p>
                <p className="text-sm text-gray-400">Popularity: {track.popularity}</p>
            </div>
        </div>
    );
}