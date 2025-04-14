/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, useRef } from "react"
import useSWR from "swr"
import { fetcher } from "@/utils/fetcher"
import FetchError from "../(layout)/FetchError"
import FetchLoader from "../(layout)/FetchLoader"
import { Users, Grid, List, ChevronLeft, ChevronRight } from "lucide-react"

type Artist = {
    artistId: string
    name: string
    imageUrl: string
}

export default function TopArtists({ userId }: { userId: string }) {
    const [period, setPeriod] = useState("week")
    const [viewMode, setViewMode] = useState<"carousel" | "grid">("carousel")
    const { data: artists, error } = useSWR<Artist[]>(`/api/user/${userId}/top-artists?period=${period}`, fetcher)
    const scrollContainerRef = useRef<HTMLDivElement | null>(null)

    if (error) return <FetchError />
    if (!artists) return <FetchLoader />

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" })
        }
    }

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" })
        }
    }

    return (
        <div className="rounded-lg bg-[#1e1814] border border-[#3d2e23] p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex items-center gap-2">
                    <Users className="text-[#c38e70]" />
                    <h3 className="text-xl font-bold text-[#e6d2c0]">Top Artists</h3>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-[#2a211c] rounded-md p-1">
                        <button onClick={() => setViewMode("carousel")} className={`p-1.5 rounded ${viewMode === "carousel" ? "bg-[#3d2e23] text-[#e6d2c0]" : "text-[#a18072]"}`}><List size={18} /></button>
                        <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded ${viewMode === "grid" ? "bg-[#3d2e23] text-[#e6d2c0]" : "text-[#a18072]"}`}><Grid size={18} /></button>
                    </div>
                    <select value={period} onChange={(e) => setPeriod(e.target.value)} className="bg-[#2a211c] text-[#e6d2c0] px-3 py-1.5 rounded-md border border-[#3d2e23] focus:outline-none focus:ring-1 focus:ring-[#c38e70]">
                        <option value="week">Last Week</option>
                        <option value="month">Last Month</option>
                        <option value="year">Last Year</option>
                    </select>
                </div>
            </div>
            {viewMode === "carousel" ? (
                <div className="relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10">
                        <button onClick={scrollLeft} className="p-2 rounded-full bg-[#2a211c] text-[#e6d2c0] hover:bg-[#3d2e23] shadow-lg"><ChevronLeft size={20} /></button>
                    </div>
                    <div ref={scrollContainerRef} className="flex gap-5 overflow-x-auto pb-4 px-2 hide-scrollbar snap-x snap-mandatory">
                        {artists.map((artist) => (
                            <a href={`/artist/${artist.artistId}`} key={artist.artistId} className="snap-start flex-shrink-0 w-[220px] group">
                                <div className="bg-[#2a211c] rounded-lg p-3 transform transition-transform group-hover:-translate-y-1 shadow-md hover:shadow-lg">
                                    <div className="relative mb-3 bg-[#e6d2c0] p-2 rounded">
                                        <div className="aspect-square">
                                            <img src={artist.imageUrl || "/placeholder.svg"} alt={artist.name} className="w-full h-full object-cover rounded" />
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-[#e6d2c0] line-clamp-1 text-center">{artist.name}</h4>
                                </div>
                            </a>
                        ))}
                    </div>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10">
                        <button onClick={scrollRight} className="p-2 rounded-full bg-[#2a211c] text-[#e6d2c0] hover:bg-[#3d2e23] shadow-lg"><ChevronRight size={20} /></button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                    {artists.map((artist) => (
                        <a href={`/artist/${artist.artistId}`} key={artist.artistId} className="group">
                            <div className="bg-[#2a211c] rounded-lg p-3 transform transition-transform group-hover:-translate-y-1 shadow-md hover:shadow-lg">
                                <div className="relative mb-3 bg-[#e6d2c0] p-2 rounded">
                                    <div className="aspect-square">
                                        <img
                                            src={artist.imageUrl || "/placeholder.svg"}
                                            alt={artist.name}
                                            className="w-full h-full object-cover rounded"
                                        />
                                    </div>
                                </div>
                                <h4 className="font-bold text-[#e6d2c0] line-clamp-1 text-center">{artist.name}</h4>
                            </div>
                        </a>
                    ))}
                </div>
            )}
        </div>
    )
}