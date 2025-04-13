/* eslint-disable @next/next/no-img-element */
'use client';
import { useState } from 'react';
import useSWR from 'swr';
import ReactPaginate from 'react-paginate';
import { fetcher } from '@/utils/fetcher';
import FetchError from '../(layout)/FetchError';
import FetchLoader from '../(layout)/FetchLoader';

type Track = {
    imageUrl: string;
    trackName: string;
    artistName: string;
    trackId: string;
}

export default function TrackHistory({ userId }: { userId: string }) {
    const [page, setPage] = useState(0);
    const { data, error } = useSWR(`/api/user/${userId}/track-history?page=${page}`, fetcher);

    if (error) return <FetchError />;
    if (!data) return <FetchLoader />;

    return (
        <div>
            <div className="grid gap-2">
                {data.tracks.map((t: Track) => (
                    <a href={`/track/${t.trackId}`} key={t.trackId} className="border p-2 rounded flex items-center gap-4">
                        <img alt={t.trackName} src={t.imageUrl} className="w-12 h-12 object-cover" />
                        <div>
                            <p>{t.trackName}</p>
                            <p className="text-sm text-gray-400">{t.artistName}</p>
                        </div>
                    </a>
                ))}
            </div>
            <ReactPaginate pageCount={data.totalPages} onPageChange={({ selected }) => setPage(selected)} containerClassName="flex gap-2 mt-4" pageClassName="px-3 py-1 border" activeClassName="bg-white text-black" />
        </div>
    );
}