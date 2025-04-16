/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, useEffect, useRef } from "react"
import { Disc, ChevronLeft, ChevronRight } from "lucide-react"
import FetchLoader from "@/components/(layout)/FetchLoader"
import FetchError from "@/components/(layout)/FetchError"

type TimeRange = "week" | "month" | "year"

interface Album {
    albumId: string
    name: string
    imageUrl: string
    artistId: string
    artistName: string
    play_count: number
}

export default function TopAlbumsChart({ timeRange }: { timeRange: TimeRange }) {
    const [albums, setAlbums] = useState<Album[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const scrollContainerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const fetchAlbums = async () => {
            setIsLoading(true)
            setError(null)

            try {
                const response = await fetch(`/api/global/top-albums?range=${timeRange}`)

                if (!response.ok) {
                    throw new Error("Failed to fetch top albums")
                }

                const data = await response.json()
                setAlbums(data.albums)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Something went wrong")
            } finally {
                setIsLoading(false)
            }
        }

        fetchAlbums()
    }, [timeRange])

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

    if (isLoading) return <FetchLoader />
    if (error) return <FetchError />

    return (
        <div className="rounded-lg bg-[#1e1814] border border-[#3d2e23] p-3 lg:p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-2 lg:mb-4">
                <Disc className="text-[#c38e70]" />
                <h2 className="text-xl font-bold text-[#e6d2c0]">Top Albums</h2>
            </div>
            {albums.length > 0 ? (
                <div className="relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10"><button onClick={scrollLeft} className="p-2 rounded-full bg-[#2a211c] text-[#e6d2c0] hover:bg-[#3d2e23] shadow-lg"><ChevronLeft size={20} /></button></div>
                    <div ref={scrollContainerRef} className="flex gap-2 lg:gap-5 overflow-x-auto px-2 hide-scrollbar snap-x snap-mandatory">
                        {albums.map((album) => (
                            <a href={`/album/${album.albumId}`} key={album.albumId} className="snap-start flex-shrink-0 w-[150px] lg:w-[220px] group">
                                <div className="bg-[#2a211c] rounded-lg p-3 transform transition-transform group-hover:-translate-y-1 shadow-md hover:shadow-lg">
                                    <div className="relative mb-3 bg-[#e6d2c0] p-2 rounded">
                                        <img src={album.imageUrl || "/placeholder.svg"} alt={album.name} className="w-full aspect-square object-cover rounded" />
                                    </div>
                                    <h4 className="font-bold text-[#e6d2c0] line-clamp-1">{album.name}</h4>
                                    <a href={`/artist/${album.artistId}`} className="text-sm text-[#a18072] hover:text-[#c38e70] mt-1 block line-clamp-1" onClick={(e) => e.stopPropagation()}>{album.artistName}</a>
                                    <div className="mt-3 pt-3 border-t border-[#3d2e23] flex justify-between items-center">
                                        <span className="text-xs text-[#a18072]">Plays</span>
                                        <span className="text-sm font-medium text-[#e6d2c0]">{album.play_count.toLocaleString()}</span>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10"><button onClick={scrollRight} className="p-2 rounded-full bg-[#2a211c] text-[#e6d2c0] hover:bg-[#3d2e23] shadow-lg"><ChevronRight size={20} /></button></div>
                </div>
            ) : (
                <div className="text-center py-8 bg-[#2a211c] rounded-lg">
                    <Disc className="w-12 h-12 mx-auto mb-3 text-[#a18072] opacity-50" />
                    <p className="text-[#a18072]">No album data available for this time period</p>
                </div>
            )}
        </div>
    )
}