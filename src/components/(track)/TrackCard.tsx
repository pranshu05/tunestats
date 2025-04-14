/* eslint-disable @next/next/no-img-element */
"use client"
import useSWR from "swr"
import { fetcher } from "@/utils/fetcher"
import FetchError from "../(layout)/FetchError"
import FetchLoader from "../(layout)/FetchLoader"
import { Clock, BarChart3 } from "lucide-react"

interface Track {
    trackId: string
    name: string
    imageUrl: string
    duration: number
    popularity: number
}

export default function TrackCard({ trackId }: { trackId: string }) {
    const { data: track, error } = useSWR<Track>(`/api/track/${trackId}`, fetcher)
    const { data: playcount, error: playcountError } = useSWR<{ playcount: string }>(`/api/track/${trackId}/playcount`, fetcher,)

    if (playcountError) return <FetchError />
    if (error) return <FetchError />
    if (!track) return <FetchLoader />
    if (!playcount) return <FetchLoader />

    const minutes = Math.floor(track.duration / 1000 / 60)
    const seconds = Math.floor((track.duration / 1000) % 60)
    const formattedDuration = `${minutes}:${seconds.toString().padStart(2, "0")}`
    const formattedPlaycount = Number.parseInt(playcount.playcount).toLocaleString()

    return (
        <div className="rounded-lg bg-[#1e1814] border border-[#3d2e23] p-3 lg:p-6 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-6 lg:items-center">
                <div className="bg-[#e6d2c0] p-3 rounded lg:w-48 lg:h-48 flex-shrink-0">
                    <img src={track.imageUrl || "/placeholder.svg"} alt={track.name} className="w-full h-full object-cover rounded" />
                </div>
                <div className="flex flex-col justify-between flex-grow">
                    <div>
                        <h1 className="text-xl lg:text-3xl font-bold text-[#e6d2c0] mb-2">{track.name}</h1>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                            <div className="flex items-center gap-2 text-[#a18072]">
                                <Clock size={18} className="text-[#c38e70]" />
                                <span className="text-[#e6d2c0]">{formattedDuration}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[#a18072]">
                                <BarChart3 size={18} className="text-[#c38e70]" />
                                <span className="text-[#e6d2c0]">Popularity: {track.popularity}/100</span>
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