/* eslint-disable @next/next/no-img-element */
'use client';
import useSWR from 'swr';
import { fetcher } from '@/utils/fetcher';
import FetchError from '../(layout)/FetchError';
import FetchLoader from '../(layout)/FetchLoader';

interface Album {
    albumId: string;
    name: string;
    imageUrl: string;
}

export default function TrackAlbum({ trackId }: { trackId: string }) {
    const { data: album, error } = useSWR<Album>(`/api/track/${trackId}/album`, fetcher);

    if (error) return <FetchError />;
    if (!album) return <FetchLoader />;

    return (
        <div className="flex flex-col space-y-2">
            <h1 className="text-2xl font-bold">Album</h1>
            <a href={`/album/${album.albumId}`} className="w-32 lg:w-36 flex-shrink-0 rounded border border-white p-2">
                <img src={album.imageUrl} alt={album.name} className="w-full h-auto rounded" />
                <h2 className="mt-1 text-sm font-semibold">{album.name}</h2>
            </a>
        </div>
    );
}