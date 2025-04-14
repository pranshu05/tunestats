/* eslint-disable @next/next/no-img-element */
"use client"
import useSWR from "swr"
import { fetcher } from "@/utils/fetcher"
import FetchError from "../(layout)/FetchError"
import FetchLoader from "../(layout)/FetchLoader"
import { Users, BarChart3 } from "lucide-react"

interface Artist {
    artistId: string
    name: string
    imageUrl: string
    popularity: number
    genres: string[]
    followers: number
}

export default function ArtistCard({ artistId }: { artistId: string }) {
    const { data: artist, error } = useSWR<Artist>(`/api/artist/${artistId}`, fetcher)
    const { data: playcount, error: playcountError } = useSWR<{ playcount: string }>(`/api/artist/${artistId}/playcount`, fetcher,)

    if (error) return <FetchError />
    if (playcountError) return <FetchError />
    if (!artist) return <FetchLoader />
    if (!playcount) return <FetchLoader />

    const formattedFollowers = artist.followers.toLocaleString()
    const formattedPlaycount = Number.parseInt(playcount.playcount).toLocaleString()

    return (
        <div className="rounded-lg bg-[#1e1814] border border-[#3d2e23] p-6 shadow-lg">
            <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="bg-[#e6d2c0] p-3 rounded md:w-48 md:h-48 flex-shrink-0">
                    <img src={artist.imageUrl || "/placeholder.svg"} alt={artist.name} className="w-full h-full object-cover rounded" />
                </div>
                <div className="flex flex-col justify-between flex-grow">
                    <div>
                        <h1 className="text-3xl font-bold text-[#e6d2c0] mb-2">{artist.name}</h1>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {artist.genres.map((genre, index) => (<span key={index} className="px-3 py-1 bg-[#2a211c] text-[#a18072] text-sm rounded-full">{genre}</span>))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="flex items-center gap-2 text-[#a18072]">
                                <Users size={18} className="text-[#c38e70]" />
                                <span className="text-[#e6d2c0]">Followers: {formattedFollowers}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[#a18072]">
                                <BarChart3 size={18} className="text-[#c38e70]" />
                                <span className="text-[#e6d2c0]">Popularity: {artist.popularity}/100</span>
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