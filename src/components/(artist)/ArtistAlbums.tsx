/* eslint-disable @next/next/no-img-element */
"use client";
import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";
import FetchError from '../(layout)/FetchError';
import FetchLoader from '../(layout)/FetchLoader';

interface Album {
    albumId: string;
    imageUrl: string;
    name: string;
    releaseDate: string;
}

export default function ArtistAlbums({ artistId }: { artistId: string }) {
    const { data: albums, error } = useSWR<Album[]>(`/api/artist/${artistId}/albums`, fetcher);

    if (error) return <FetchError />;
    if (!albums) return <FetchLoader />;

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Albums</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
                {albums.map(album => (
                    <a href={`/album/${album.albumId}`} key={album.albumId} className="w-32 lg:w-36 flex-shrink-0 rounded border border-white p-2 text-center">
                        <div className="aspect-square">
                            <img src={album.imageUrl} alt={album.name} className="w-full h-full rounded object-cover" />
                        </div>
                        <p className="mt-1 text-sm font-semibold">{album.name}</p>
                    </a>
                ))}
            </div>
        </div>
    );
}