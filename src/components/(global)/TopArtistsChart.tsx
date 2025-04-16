/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, useEffect } from "react"
import { Users } from "lucide-react"
import FetchLoader from "@/components/(layout)/FetchLoader"
import FetchError from "@/components/(layout)/FetchError"

type TimeRange = "week" | "month" | "year"

interface Artist {
    artistId: string
    name: string
    imageUrl: string
    playcount: number
}

export default function TopArtistsChart({ timeRange }: { timeRange: TimeRange }) {
    const [artists, setArtists] = useState<Artist[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchArtists = async () => {
            setIsLoading(true)
            setError(null)

            try {
                const response = await fetch(`/api/global/top-artists?range=${timeRange}`)

                if (!response.ok) {
                    throw new Error("Failed to fetch top artists")
                }

                const data = await response.json()
                setArtists(data.artists)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Something went wrong")
            } finally {
                setIsLoading(false)
            }
        }

        fetchArtists()
    }, [timeRange])

    if (isLoading) return <FetchLoader />
    if (error) return <FetchError />

    return (
        <div className="rounded-lg bg-[#1e1814] border border-[#3d2e23] p-3 lg:p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-2 lg:mb-4">
                <Users className="text-[#c38e70]" />
                <h2 className="text-xl font-bold text-[#e6d2c0]">Top Artists</h2>
            </div>
            <div className="space-y-3">
                {artists.map((artist, index) => (
                    <a href={`/artist/${artist.artistId}`} key={artist.artistId} className="flex items-center gap-4 p-3 bg-[#2a211c] hover:bg-[#342820] transition-colors rounded-lg">
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-[#3d2e23] rounded-full text-[#c38e70] font-bold">{index + 1}</div>
                        <div className="bg-[#e6d2c0] p-1.5 rounded flex-shrink-0">
                            {artist.imageUrl ? (
                                <img src={artist.imageUrl || "/placeholder.svg"} alt={artist.name} className="w-12 h-12 object-cover rounded" />
                            ) : (
                                <div className="w-12 h-12 flex items-center justify-center bg-[#3d2e23] rounded text-[#c38e70] font-bold">{artist.name.charAt(0).toUpperCase()}</div>
                            )}
                        </div>
                        <div className="flex-grow min-w-0">
                            <p className="font-medium text-[#e6d2c0] truncate">{artist.name}</p>
                            <p className="text-sm text-[#a18072]">Artist</p>
                        </div>
                        <div className="flex-shrink-0 text-right">
                            <div className="text-sm text-[#a18072]">Plays</div>
                            <div className="font-medium text-[#e6d2c0]">{artist.playcount.toLocaleString()}</div>
                        </div>
                    </a>
                ))}
            </div>
            {artists.length === 0 && (
                <div className="text-center py-8 bg-[#2a211c] rounded-lg">
                    <Users className="w-12 h-12 mx-auto mb-3 text-[#a18072] opacity-50" />
                    <p className="text-[#a18072]">No artist data available for this time period</p>
                </div>
            )}
        </div>
    )
}