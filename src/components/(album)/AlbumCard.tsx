/* eslint-disable @next/next/no-img-element */
"use client";
import useSWR from "swr";
import {fetcher} from "@/utils/fetcher";
import FetchError from '../(layout)/FetchError';
import FetchLoader from '../(layout)/FetchLoader';

interface Album {
    albumId: string;
    name: string;
    imageUrl: string;
    releaseDate: string;
    totalTracks: number;
    artistId: string;
    artistName: string;
}

export default function AlbumCard({ albumId }: { albumId: string }) {
    const { data: album, error } = useSWR<Album>(`/api/album/${albumId}`, fetcher);

    if (error) return <FetchError />;
    if (!album) return <FetchLoader />;

    return (
        <div className="p-4 space-y-4 text-white">
            <div className="flex gap-6">
                <img src={album.imageUrl} alt={album.name} className="w-48 h-48 rounded shadow border border-white" />
                <div>
                    <h1 className="text-3xl font-bold">{album.name}</h1>
                    <p className="text-zinc-400">by {album.artistName}</p>
                    <p className="text-zinc-500 text-sm">Released: {album.releaseDate}</p>
                    <p className="text-zinc-500 text-sm">Total Tracks: {album.totalTracks}</p>
                </div>
            </div>
        </div>
    );
}