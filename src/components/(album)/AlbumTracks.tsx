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
        <div className="rounded-lg bg-[#1e1814] border border-[#3d2e23] p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-6">
                <Music className="text-[#c38e70]" />
                <h2 className="text-xl font-bold text-[#e6d2c0]">Tracks</h2>
            </div>
            <div className="space-y-3">
                {tracks.map((track) => (
                    <a href={`/track/${track.trackId}`} key={track.trackId} className="bg-[#2a211c] hover:bg-[#342820] transition-colors rounded-lg p-3 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-[#e6d2c0] p-1.5 rounded"><img src={track.imageUrl || "/placeholder.svg"} alt={track.name} className="w-12 h-12 object-cover rounded" /></div>
                            <span className="font-medium text-[#e6d2c0]">{track.name}</span>
                        </div>
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