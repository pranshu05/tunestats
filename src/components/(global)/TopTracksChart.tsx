/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, useEffect } from "react"
import { Music, Play } from "lucide-react"
import FetchLoader from "@/components/(layout)/FetchLoader"
import FetchError from "@/components/(layout)/FetchError"

type TimeRange = "week" | "month" | "year"

interface Track {
    trackId: string
    name: string
    imageUrl: string
    artistId: string
    artistName: string
    playcount: number
}

export default function TopTracksChart({ timeRange }: { timeRange: TimeRange }) {
    const [tracks, setTracks] = useState<Track[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchTracks = async () => {
            setIsLoading(true)
            setError(null)

            try {
                const response = await fetch(`/api/global/top-tracks?range=${timeRange}`)

                if (!response.ok) {
                    throw new Error("Failed to fetch top tracks")
                }

                const data = await response.json()
                setTracks(data.tracks)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Something went wrong")
            } finally {
                setIsLoading(false)
            }
        }

        fetchTracks()
    }, [timeRange])

    if (isLoading) return <FetchLoader />
    if (error) return <FetchError />

    return (
        <div className="rounded-lg bg-[#1e1814] border border-[#3d2e23] p-3 lg:p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-2 lg:mb-4">
                <Music className="text-[#c38e70]" />
                <h2 className="text-xl font-bold text-[#e6d2c0]">Top Tracks</h2>
            </div>
            <div className="space-y-3">
                {tracks.map((track, index) => (
                    <a href={`/track/${track.trackId}`} key={track.trackId} className="flex items-center gap-4 p-3 bg-[#2a211c] hover:bg-[#342820] transition-colors rounded-lg group">
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-[#3d2e23] rounded-full text-[#c38e70] font-bold">{index + 1}</div>
                        <div className="relative bg-[#e6d2c0] p-1.5 rounded flex-shrink-0">
                            <img src={track.imageUrl || "/placeholder.svg"} alt={track.name} className="w-12 h-12 object-cover rounded" />
                            <div className="absolute inset-0 bg-black bg-opacity-40 rounded opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Play size={20} className="text-white" /></div>
                        </div>
                        <div className="flex-grow min-w-0">
                            <p className="font-medium text-[#e6d2c0] truncate">{track.name}</p>
                            <a href={`/artist/${track.artistId}`} className="text-sm text-[#a18072] hover:text-[#c38e70] truncate block" onClick={(e) => e.stopPropagation()}>{track.artistName}</a>
                        </div>
                        <div className="flex-shrink-0 text-right">
                            <div className="text-sm text-[#a18072]">Plays</div>
                            <div className="font-medium text-[#e6d2c0]">{track.playcount.toLocaleString()}</div>
                        </div>
                    </a>
                ))}
            </div>
            {tracks.length === 0 && (
                <div className="text-center py-8 bg-[#2a211c] rounded-lg">
                    <Music className="w-12 h-12 mx-auto mb-3 text-[#a18072] opacity-50" />
                    <p className="text-[#a18072]">No track data available for this time period</p>
                </div>
            )}
        </div>
    )
}