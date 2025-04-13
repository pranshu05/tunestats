/* eslint-disable @next/next/no-img-element */
'use client';
import { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/utils/fetcher';
import FetchError from '../(layout)/FetchError';
import FetchLoader from '../(layout)/FetchLoader';

type Artist = {
    artistId: string;
    name: string;
    imageUrl: string;
};

export default function TopArtists({ userId }: { userId: string }) {
    const [period, setPeriod] = useState('week');
    const { data: artists, error } = useSWR<Artist[]>(`/api/user/${userId}/top-artists?period=${period}`, fetcher);

    if (error) return <FetchError />;
    if (!artists) return <FetchLoader />;

    return (
        <div>
            <div className="flex justify-between mb-2">
                <h3 className="text-xl font-bold">Top Artists</h3>
                <select value={period} onChange={(e) => setPeriod(e.target.value)} className="px-2 py-1 border border-white bg-black text-white">
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="year">Last Year</option>
                </select>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
                {artists.map((artist) => (
                    <a href={`/artist/${artist.artistId}`} key={artist.artistId} className="w-32 lg:w-36 flex-shrink-0 rounded border border-white p-2 text-center">
                        <div className="aspect-square">
                            <img src={artist.imageUrl} alt={artist.name} className="w-full h-full rounded object-cover" />
                        </div>
                        <p className="mt-1 text-sm font-semibold">{artist.name}</p>
                    </a>
                ))}
            </div>
        </div>
    );
}