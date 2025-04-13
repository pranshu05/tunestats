/* eslint-disable @next/next/no-img-element */
'use client';
import { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/utils/fetcher';
import FetchError from '../(layout)/FetchError';
import FetchLoader from '../(layout)/FetchLoader';

type Track = {
    trackId: string;
    name: string;
    albumImage: string;
};

export default function TopTracks({ userId }: { userId: string }) {
    const [period, setPeriod] = useState('week');
    const { data: tracks, error } = useSWR<Track[]>(`/api/user/${userId}/top-tracks?period=${period}`, fetcher);
    
    if (error) return <FetchError />;
    if (!tracks) return <FetchLoader />;

    return (
        <div>
            <div className="flex justify-between mb-2">
                <h3 className="text-xl font-bold">Top Tracks</h3>
                <select value={period} onChange={(e) => setPeriod(e.target.value)} className="px-2 py-1 border border-white bg-black text-white">
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="year">Last Year</option>
                </select>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
                {tracks.map((track) => (
                    <a href={`/track/${track.trackId}`} key={track.trackId}className="w-32 lg:w-36 flex-shrink-0 rounded border border-white p-2">
                        <img src={track.albumImage} alt={track.name} className="w-full h-auto rounded" />
                        <p className="mt-1 text-sm font-semibold">{track.name}</p>
                    </a>
                ))}
            </div>
        </div>
    );
}