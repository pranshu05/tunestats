/* eslint-disable @next/next/no-img-element */
"use client"
import useSWR from "swr"
import { fetcher } from "@/utils/fetcher"
import FetchError from "../(layout)/FetchError"
import FetchLoader from "../(layout)/FetchLoader"
import { Disc } from "lucide-react"

interface Album {
    albumId: string
    name: string
    imageUrl: string
}

export default function TrackAlbum({ trackId }: { trackId: string }) {
    const { data: album, error } = useSWR<Album>(`/api/track/${trackId}/album`, fetcher)

    if (error) return <FetchError />
    if (!album) return <FetchLoader />

    return (
        <div className="rounded-lg bg-[#1e1814] border border-[#3d2e23] p-3 lg:p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
                <Disc className="size-5 lg:size-6 text-[#c38e70]" />
                <h2 className="text-lg lg:text-xl font-bold text-[#e6d2c0]">Album</h2>
            </div>
            <a href={`/album/${album.albumId}`} className="w-[220px] block bg-[#2a211c] rounded-lg p-3 transform transition-transform hover:-translate-y-1 shadow-md hover:shadow-lg">
                <div className="relative mb-3 bg-[#e6d2c0] p-2 rounded">
                    <img src={album.imageUrl || "/placeholder.svg"} alt={album.name} className="w-full aspect-square object-cover rounded" />
                </div>
                <h3 className="font-bold text-[#e6d2c0] text-center">{album.name}</h3>
            </a>
        </div>
    )
}