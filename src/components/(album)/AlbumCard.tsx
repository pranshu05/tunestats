/* eslint-disable @next/next/no-img-element */
"use client"
import useSWR from "swr"
import { fetcher } from "@/utils/fetcher"
import FetchError from "../(layout)/FetchError"
import FetchLoader from "../(layout)/FetchLoader"
import { Calendar, Music } from "lucide-react"
import { BsVinyl } from "react-icons/bs"

interface Album {
    albumId: string
    name: string
    imageUrl: string
    releaseDate: string
    trackCount: number
    artistId: string
    artistName: string
    label: string
}

export default function AlbumCard({ albumId }: { albumId: string }) {
    const { data: album, error } = useSWR<Album>(`/api/album/${albumId}`, fetcher)
    const { data: playcount, error: playcountError } = useSWR<{ playcount: string }>(`/api/album/${albumId}/playcount`, fetcher,)

    if (error) return <FetchError />
    if (playcountError) return <FetchError />
    if (!album) return <FetchLoader />
    if (!playcount) return <FetchLoader />

    const formattedPlaycount = Number.parseInt(playcount.playcount).toLocaleString()

    return (
        <div className="rounded-lg bg-[#1e1814] border border-[#3d2e23] p-3 lg:p-6 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-6 lg:items-center">
                <div className="bg-[#e6d2c0] p-3 rounded lg:w-48 lg:h-48 flex-shrink-0">
                    <img src={album.imageUrl || "/placeholder.svg"} alt={album.name} className="w-full h-full object-cover rounded" />
                </div>
                <div className="flex flex-col justify-between flex-grow">
                    <div>
                        <h1 className="text-xl lg:text-3xl font-bold text-[#e6d2c0] mb-2">{album.name}</h1>
                        <p className="text-[#a18072] mb-4">by{" "}<a href={`/artist/${album.artistId}`} className="text-[#c38e70] hover:underline">{album.artistName}</a></p>
                        <div className="space-y-4 mt-4">
                            <div className="flex items-center gap-2 text-[#a18072]">
                                <Calendar size={18} className="text-[#c38e70]" />
                                <span className="text-[#e6d2c0]">Released: {album.releaseDate}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[#a18072]">
                                <Music size={18} className="text-[#c38e70]" />
                                <span className="text-[#e6d2c0]">Tracks: {album.trackCount}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[#a18072]">
                                <BsVinyl size={18} className="text-[#c38e70]" />
                                <span className="text-[#e6d2c0]">Label: {album.label}</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 p-4 bg-[#2a211c] rounded-lg">
                        <p className="text-[#a18072] mb-1">Global Playcount</p>
                        <p className="text-2xl font-bold text-[#e6d2c0]">{formattedPlaycount}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}