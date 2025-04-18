/* eslint-disable @next/next/no-img-element */
"use client"
import { useState } from "react"
import useSWR from "swr"
import ReactPaginate from "react-paginate"
import { fetcher } from "@/utils/fetcher"
import FetchError from "@/components/(layout)/FetchError"
import FetchLoader from "@/components/(layout)/FetchLoader"
import { History, ChevronLeft, ChevronRight } from "lucide-react"

type Track = {
    imageUrl: string
    trackName: string
    artistName: string
    featuredArtists: string[]
    trackId: string
}

export default function TrackHistory({ userId }: { userId: string }) {
    const [page, setPage] = useState(0)
    const { data, error } = useSWR(`/api/user/${userId}/track-history?page=${page}`, fetcher)

    if (error) return <FetchError />
    if (!data) return <FetchLoader />

    return (
        <div className="rounded-lg bg-[#1e1814] border border-[#3d2e23] p-3 lg:p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-2 lg:mb-4 ">
                <History className="size-5 lg:size-6 text-[#c38e70]" />
                <h3 className="text-lg lg:text-xl font-bold text-[#e6d2c0]">Listening History</h3>
            </div>
            <div className="space-y-2 lg:space-y-3">
                {data.tracks.map((t: Track) => (
                    <a href={`/track/${t.trackId}`} key={t.trackId} className="bg-[#2a211c] hover:bg-[#342820] transition-colors rounded-lg p-2 lg:p-3 flex items-center gap-4">
                        <div className="bg-[#e6d2c0] p-1.5 rounded">
                            <div className="aspect-square">
                                <img alt={t.trackName} src={t.imageUrl || "/placeholder.svg"} className="w-12 h-auto object-cover rounded" />
                            </div>
                        </div>
                        <div>
                            <p className="font-medium text-[#e6d2c0] line-clamp-1" title={t.trackName}>{t.trackName.length > 30 ? `${t.trackName.slice(0, 30)}...` : t.trackName}</p>
                            <p className="text-sm text-[#a18072] line-clamp-1">{t.artistName}{t.featuredArtists?.length > 0 && `, ${t.featuredArtists.join(", ")}`}</p>
                        </div>
                    </a>
                ))}
            </div>
            <ReactPaginate
                forcePage={page}
                pageCount={data.totalPages}
                onPageChange={({ selected }) => setPage(selected)}
                containerClassName="flex items-center justify-center gap-2 mt-6"
                pageClassName="w-8 h-8 flex items-center justify-center rounded-md bg-[#2a211c] text-[#e6d2c0] hover:bg-[#3d2e23] transition-colors"
                activeClassName="!bg-[#c38e70] !text-[#1e1814] font-medium"
                previousLabel={<ChevronLeft size={16} />}
                nextLabel={<ChevronRight size={16} />}
                previousClassName="w-8 h-8 flex items-center justify-center rounded-md bg-[#2a211c] text-[#e6d2c0] hover:bg-[#3d2e23] transition-colors"
                nextClassName="w-8 h-8 flex items-center justify-center rounded-md bg-[#2a211c] text-[#e6d2c0] hover:bg-[#3d2e23] transition-colors"
                disabledClassName="opacity-50 cursor-not-allowed hover:bg-[#2a211c]"
            />
        </div>
    )
}