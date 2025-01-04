/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import Loader from "@/components/(layout)/Loader";

export default function TrackAlbumInfo({ userId, albumId }) {
    const [album, setAlbum] = useState(null);

    useEffect(() => {
        const fetchAlbum = async () => {
            try {
                const res = await fetch(`/api/getAlbum/?albumId=${albumId}&userId=${userId}`);
                if (res.ok) {
                    const data = await res.json();
                    setAlbum(data.album);
                } else {
                    console.error("Failed to fetch album");
                }
            } catch (error) {
                console.error("Error fetching album:", error);
            }
        };

        if (albumId) {
            fetchAlbum();
        }
    }, [albumId, userId]);

    return (
        <div className="p-4 rounded-lg bg-zinc-900/50">
            {album ? (
                <div className="flex flex-col h-full justify-center items-center space-y-4">
                    <h1 className="text-2xl font-bold">Album Info</h1>
                    <a href={`/album/${album.albumId}`} ><img src={album.albumImageUrl} alt={album.albumName} className="w-36 lg:w-48 rounded-md" /></a>
                    <div className="flex-col justify-center items-center text-center space-y-1">
                        <h1 className="text-xl font-bold">{album.albumName}</h1>
                        <a href={album.albumSpotifyUrl} target="_blank" rel="noopener noreferrer"><p className="w-fit p-2 mx-auto rounded-md bg-zinc-800/50 mt-2">Listen on Spotify</p></a>
                    </div>
                </div>
            ) : (
                <Loader />
            )}
        </div>
    )
}