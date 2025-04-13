/* eslint-disable @next/next/no-img-element */
"use client";
import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";
import FetchError from '../(layout)/FetchError';
import FetchLoader from '../(layout)/FetchLoader';

interface Artist {
    artistId: string;
    name: string;
    imageUrl: string;
    genres: string[];
    followers: number;
}

export default function ArtistCard({ artistId }: { artistId: string }) {
    const { data: artist, error } = useSWR<Artist>(`/api/artist/${artistId}`, fetcher);
    const { data: playcount, error: playcountError } = useSWR<{ playcount: string }>(`/api/artist/${artistId}/playcount`, fetcher);

    if (error) return <FetchError />;
    if (playcountError) return <FetchError />;
    if (!artist) return <FetchLoader />;
    if (!playcount) return <FetchLoader />;

    return (
        <div className="flex items-center space-x-4">
            <img src={artist.imageUrl} alt={artist.name} className="w-28 h-28 rounded object-cover" />
            <div>
                <h1 className="text-3xl font-bold">{artist.name}</h1>
                <p className="text-gray-400">Genres: {artist.genres}</p>
                <p className="text-gray-400">Followers: {artist.followers}</p>
                <p className="text-gray-400">Global Playcount: {playcount.playcount}</p>
            </div>
        </div>
    )
}