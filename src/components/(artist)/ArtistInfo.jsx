/* eslint-disable @next/next/no-img-element */
import { formatFollowers } from "@/lib/format";

export default function ArtistInfo({ artist }) {
    return (
        <div className="p-4 rounded-lg bg-zinc-900/50">
            <div className="flex items-center space-x-4">
                <img src={artist.artistImageUrl} alt={artist.artistName} className="w-36 lg:w-48 rounded-md" />
                <div className="flex-col space-y-1">
                    <h1 className="text-xl font-bold">{artist.artistName}</h1>
                    <p className="text-gray-300">{artist.artistGenres.join(", ")}</p>
                    <p className="text-gray-300 text-lg font-medium">{formatFollowers(artist.artistFollowers)} followers</p>
                    <a href={artist.artistUrl} target="_blank" rel="noopener noreferrer"><p className="w-fit p-2 rounded-md bg-zinc-800/50 mt-2">View on Spotify</p></a>
                </div>
            </div>
        </div>
    );
} 