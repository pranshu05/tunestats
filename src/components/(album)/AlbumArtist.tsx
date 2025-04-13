/* eslint-disable @next/next/no-img-element */
'use client';
import useSWR from 'swr';
import { fetcher } from '@/utils/fetcher';
import FetchError from '../(layout)/FetchError';
import FetchLoader from '../(layout)/FetchLoader';

interface Artist {
    artistId: string;
    name: string;
    imageUrl: string;
}

export default function AlbumArtist({ albumId }: { albumId: string }) {
    const { data: artist, error } = useSWR<Artist>(`/api/album/${albumId}/artist`, fetcher);

    if (error) return <FetchError />;
    if (!artist) return <FetchLoader />;

    return (
        <div className="flex flex-col space-y-2">
            <h1 className="text-2xl font-bold">Artist</h1>
            <a href={`/artist/${artist.artistId}`} className="w-32 lg:w-36 flex-shrink-0 rounded border border-white p-2">
                <img src={artist.imageUrl} alt={artist.name} className="w-full h-auto rounded" />
                <h2 className="mt-1 text-sm font-semibold">{artist.name}</h2>
            </a>
        </div>
    );
}