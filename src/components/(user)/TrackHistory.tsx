/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, useCallback } from "react"
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

type TrackHistoryData = {
    tracks: Track[]
    totalPages: number
}

export default function TrackHistory({ userId }: { userId: string }) {
    const [page, setPage] = useState(0)
    
    const { data, error, isLoading } = useSWR<TrackHistoryData>(
        userId ? `/api/user/${userId}/track-history?page=${page}` : null,
        fetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 5000,
        }
    )

    const handlePageChange = useCallback(({ selected }: { selected: number }) => {
        setPage(selected);
        // Scroll to top of the component
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    if (error) return <FetchError />
    if (isLoading || !data) return <FetchLoader />

    const { tracks, totalPages } = data;

    return (
        <div className="rounded-lg bg-[#1e1814] border border-[#3d2e23] p-3 lg:p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-2 lg:mb-4">
                <History className="size-5 lg:size-6 text-[#c38e70]" aria-hidden="true" />
                <h2 className="text-lg lg:text-xl font-bold text-[#e6d2c0]">Listening History</h2>
            </div>

            {tracks.length === 0 ? (
                <div className="text-center py-12 text-[#a18072]">
                    <History className="mx-auto mb-4 opacity-50" size={48} />
                    <p>No listening history available</p>
                </div>
            ) : (
                <>
                    <div className="space-y-2 lg:space-y-3">
                        {tracks.map((t) => (
                            <a 
                                href={`/track/${encodeURIComponent(t.trackId)}`} 
                                key={`${t.trackId}-${Math.random()}`}
                                className="bg-[#2a211c] hover:bg-[#342820] transition-colors rounded-lg p-2 lg:p-3 flex items-center gap-4"
                            >
                                <div className="bg-[#e6d2c0] p-1.5 rounded flex-shrink-0">
                                    <div className="aspect-square w-12">
                                        <img 
                                            alt={t.trackName}
                                            src={t.imageUrl || "/placeholder.svg"} 
                                            className="w-full h-full object-cover rounded" 
                                            loading="lazy"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = "/placeholder.svg";
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p 
                                        className="font-medium text-[#e6d2c0] line-clamp-1" 
                                        title={t.trackName}
                                    >
                                        {t.trackName}
                                    </p>
                                    <p className="text-sm text-[#a18072] line-clamp-1">
                                        {t.artistName}
                                        {t.featuredArtists?.length > 0 && `, ${t.featuredArtists.join(", ")}`}
                                    </p>
                                </div>
                            </a>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <ReactPaginate
                            forcePage={page}
                            pageCount={totalPages}
                            onPageChange={handlePageChange}
                            containerClassName="flex items-center justify-center gap-2 mt-6"
                            pageClassName="w-8 h-8 flex items-center justify-center rounded-md bg-[#2a211c] text-[#e6d2c0] hover:bg-[#3d2e23] transition-colors"
                            activeClassName="!bg-[#c38e70] !text-[#1e1814] font-medium"
                            previousLabel={<ChevronLeft size={16} aria-label="Previous page" />}
                            nextLabel={<ChevronRight size={16} aria-label="Next page" />}
                            previousClassName="w-8 h-8 flex items-center justify-center rounded-md bg-[#2a211c] text-[#e6d2c0] hover:bg-[#3d2e23] transition-colors"
                            nextClassName="w-8 h-8 flex items-center justify-center rounded-md bg-[#2a211c] text-[#e6d2c0] hover:bg-[#3d2e23] transition-colors"
                            disabledClassName="opacity-50 cursor-not-allowed hover:bg-[#2a211c]"
                            pageRangeDisplayed={3}
                            marginPagesDisplayed={1}
                            breakLabel="..."
                            breakClassName="w-8 h-8 flex items-center justify-center text-[#a18072]"
                        />
                    )}
                </>
            )}
        </div>
    )
}