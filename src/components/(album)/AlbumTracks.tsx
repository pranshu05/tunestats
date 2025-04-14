/* eslint-disable @next/next/no-img-element */
"use client"
import useSWR from "swr"
import { fetcher } from "@/utils/fetcher"
import FetchError from "../(layout)/FetchError"
import FetchLoader from "../(layout)/FetchLoader"
import { Music, Clock } from "lucide-react"

interface Track {
    trackId: string
    name: string
    image: string
    duration: number
    imageUrl: string
}

export default function AlbumTracks({ albumId }: { albumId: string }) {
    const { data: tracks, error } = useSWR<Track[]>(`/api/album/${albumId}/tracks`, fetcher)

    if (error) return <FetchError />
    if (!tracks) return <FetchLoader />

    return (
        <div className="rounded-lg bg-[#1e1814] border border-[#3d2e23] p-3 lg:p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-2 lg:mb-4">
                <Music className="text-[#c38e70]" />
                <h2 className="text-xl font-bold text-[#e6d2c0]">Tracks</h2>
            </div>
            <div className="space-y-2 lg:space-y-3">
                {tracks.map((track) => (
                    <a href={`/track/${track.trackId}`} key={track.trackId} className="bg-[#2a211c] hover:bg-[#342820] transition-colors rounded-lg p-2 lg:p-3 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-[#e6d2c0] p-1.5 rounded"><img src={track.imageUrl || "/placeholder.svg"} alt={track.name} className="w-12 h-12 object-cover rounded" /></div>
                            <p className="font-medium text-[#e6d2c0] line-clamp-1" title={track.name}>{track.name.length > 20 ? `${track.name.slice(0, 20)}...` : track.name}</p>                        </div>
                        <div className="flex items-center gap-2 text-[#a18072]">
                            <Clock size={14} />
                            <span>{Math.floor(track.duration / 1000 / 60)}:{String(Math.floor((track.duration / 1000) % 60)).padStart(2, "0")}</span>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    )
}