/* eslint-disable @next/next/no-img-element */
"use client"
import useSWR from "swr"
import { fetcher } from "@/utils/fetcher"
import FetchError from "../(layout)/FetchError"
import FetchLoader from "../(layout)/FetchLoader"
import { Music, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

interface Track {
    trackId: string
    imageUrl: string
    name: string
}

export default function ArtistTracks({ artistId }: { artistId: string }) {
    const { data: tracks, error } = useSWR<Track[]>(`/api/artist/${artistId}/tracks`, fetcher)
    const scrollContainerRef = useState<HTMLDivElement | null>(null)

    if (error) return <FetchError />
    if (!tracks) return <FetchLoader />

    const scrollLeft = () => {
        if (scrollContainerRef[0]) {
            scrollContainerRef[0].scrollBy({ left: -300, behavior: "smooth" })
        }
    }

    const scrollRight = () => {
        if (scrollContainerRef[0]) {
            scrollContainerRef[0].scrollBy({ left: 300, behavior: "smooth" })
        }
    }

    return (
        <div className="rounded-lg bg-[#1e1814] border border-[#3d2e23] p-3 lg:p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-2 lg:mb-4">
                <Music className="text-[#c38e70]" />
                <h2 className="text-xl font-bold text-[#e6d2c0]">Popular Tracks</h2>
            </div>
            <div className="relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10"><button onClick={scrollLeft} className="p-2 rounded-full bg-[#2a211c] text-[#e6d2c0] hover:bg-[#3d2e23] shadow-lg"><ChevronLeft size={20} /></button></div>
                <div ref={(el) => { scrollContainerRef[0] = el; }} className="flex gap-2 lg:gap-5 overflow-x-auto px-2 hide-scrollbar snap-x snap-mandatory">
                    {tracks.map((track) => (
                        <a href={`/track/${track.trackId}`} key={track.trackId} className="snap-start flex-shrink-0 w-[150px] lg:w-[220px] group">
                            <div className="bg-[#2a211c] rounded-lg p-3 transform transition-transform group-hover:-translate-y-1 shadow-md hover:shadow-lg">
                                <div className="relative mb-3 bg-[#e6d2c0] p-2 rounded">
                                    <img src={track.imageUrl || "/placeholder.svg"} alt={track.name} className="w-full aspect-square object-cover rounded" />
                                </div>
                                <h4 className="font-bold text-[#e6d2c0] line-clamp-1 text-center">{track.name}</h4>
                            </div>
                        </a>
                    ))}
                </div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10">
                    <button onClick={scrollRight} className="p-2 rounded-full bg-[#2a211c] text-[#e6d2c0] hover:bg-[#3d2e23] shadow-lg"><ChevronRight size={20} /></button>
                </div>
            </div>
        </div>
    )
}