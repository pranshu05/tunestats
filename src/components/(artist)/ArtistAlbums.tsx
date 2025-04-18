/* eslint-disable @next/next/no-img-element */
"use client"
import { useRef } from "react"
import useSWR from "swr"
import { fetcher } from "@/utils/fetcher"
import FetchError from "../(layout)/FetchError"
import FetchLoader from "../(layout)/FetchLoader"
import { Disc, ChevronLeft, ChevronRight } from "lucide-react"

interface Album {
    albumId: string
    imageUrl: string
    name: string
    releaseDate: string
}

export default function ArtistAlbums({ artistId }: { artistId: string }) {
    const { data: albums, error } = useSWR<Album[]>(`/api/artist/${artistId}/albums`, fetcher)
    const scrollContainerRef = useRef<HTMLDivElement | null>(null)

    if (error) return <FetchError />
    if (!albums) return <FetchLoader />

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

    if (albums.length === 0) return (
        <div className="rounded-lg bg-[#1e1814] border border-[#3d2e23] p-3 lg:p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-2 lg:mb-4">
                <Disc className="size-5 lg:size-6 text-[#c38e70]" />
                <h2 className="text-lg lg:text-xl font-bold text-[#e6d2c0]">Albums</h2>
            </div>
            <div className="text-[#a18072]">No albums found</div>
        </div>
    )

    return (
        <div className="rounded-lg bg-[#1e1814] border border-[#3d2e23] p-3 lg:p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-2 lg:mb-4">
                <Disc className="size-5 lg:size-6 text-[#c38e70]" />
                <h2 className="text-lg lg:text-xl font-bold text-[#e6d2c0]">Albums</h2>
            </div>
            <div className="relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10"><button onClick={scrollLeft} className="p-2 rounded-full bg-[#2a211c] text-[#e6d2c0] hover:bg-[#3d2e23] shadow-lg"><ChevronLeft size={20} /></button></div>
                <div ref={scrollContainerRef} className="flex gap-2 lg:gap-5 overflow-x-auto px-2 hide-scrollbar snap-x snap-mandatory">
                    {albums.map((album) => (
                        <a href={`/album/${album.albumId}`} key={album.albumId} className="snap-start flex-shrink-0 w-[150px] lg:w-[220px] group">
                            <div className="bg-[#2a211c] rounded-lg p-3 transform transition-transform group-hover:-translate-y-1 shadow-md hover:shadow-lg">
                                <div className="relative mb-3 bg-[#e6d2c0] p-2 rounded">
                                    <img src={album.imageUrl || "/placeholder.svg"} alt={album.name} className="w-full aspect-square object-cover rounded" />
                                </div>
                                <h4 className="font-bold text-[#e6d2c0] line-clamp-1 text-center">{album.name}</h4>
                                <p className="text-sm text-[#a18072] mt-1 text-center">{album.releaseDate.split("-")[0]}</p>
                            </div>
                        </a>
                    ))}
                </div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10">
                    <button onClick={scrollRight} className="p-2 rounded-full bg-[#2a211c] text-[#e6d2c0] hover:bg-[#3d2e23] shadow-lg">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    )
}