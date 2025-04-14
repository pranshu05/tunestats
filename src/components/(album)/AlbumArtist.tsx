/* eslint-disable @next/next/no-img-element */
"use client"
import useSWR from "swr"
import { fetcher } from "@/utils/fetcher"
import FetchError from "../(layout)/FetchError"
import FetchLoader from "../(layout)/FetchLoader"
import { User } from "lucide-react"

interface Artist {
    artistId: string
    name: string
    imageUrl: string
}

export default function AlbumArtist({ albumId }: { albumId: string }) {
    const { data: artist, error } = useSWR<Artist>(`/api/album/${albumId}/artist`, fetcher)

    if (error) return <FetchError />
    if (!artist) return <FetchLoader />

    return (
        <div className="rounded-lg bg-[#1e1814] border border-[#3d2e23] p-3 lg:p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
                <User className="text-[#c38e70]" />
                <h2 className="text-xl font-bold text-[#e6d2c0]">Artist</h2>
            </div>
            <a href={`/artist/${artist.artistId}`} className="w-[220px] block bg-[#2a211c] rounded-lg p-3 transform transition-transform hover:-translate-y-1 shadow-md hover:shadow-lg">
                <div className="relative mb-3 bg-[#e6d2c0] p-2 rounded">
                    <img src={artist.imageUrl || "/placeholder.svg"} alt={artist.name} className="w-full aspect-square object-cover rounded" />
                </div>
                <h3 className="font-bold text-[#e6d2c0] text-center">{artist.name}</h3>
            </a>
        </div>
    )
}