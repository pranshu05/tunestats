/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { formatFollowers } from "@/lib/format";
import Loader from "@/components/(layout)/Loader";

export default function TrackArtistInfo({ userId, artistId }) {
    const [artist, setArtist] = useState(null);

    useEffect(() => {
        const fetchArtist = async () => {
            try {
                const res = await fetch(`/api/getArtist/?artistId=${artistId}&userId=${userId}`);
                if (res.ok) {
                    const data = await res.json();
                    setArtist(data.artist);
                } else {
                    console.error("Failed to fetch artist:", await res.text());
                    setArtist(null);
                }
            } catch (error) {
                console.error("Error fetching artist:", error);
                setArtist(null);
            }
        };

        fetchArtist();

    }, [artistId, userId]);

    return (
        <div className="p-4 rounded-lg bg-zinc-900/50">
            {artist ? (
                <div className="flex flex-col justify-center items-center space-y-4">
                    <h1 className="text-2xl font-bold">Artist Info</h1>
                    <a className="w-36 lg:w-48" href={`/artist/${artist.artistId}`}><img src={artist.artistImageUrl} alt={artist.artistName} className="w-36 lg:w-48 rounded-md" /></a>
                    <div className="flex-col justify-center items-center text-center space-y-1">
                        <h1 className="text-xl font-bold">{artist.artistName}</h1>
                        <p className="text-gray-300">{formatFollowers(artist.artistFollowers)} followers</p>
                        <a href={artist.artistUrl} target="_blank" rel="noopener noreferrer"><p className="w-fit p-2 mx-auto rounded-md bg-zinc-800/50 mt-2">Listen on Spotify</p></a>
                    </div>
                </div>
            ) : (
                <Loader />
            )}
        </div>
    )
}