/* eslint-disable @next/next/no-img-element */
"use client"
import useSWR from "swr"
import { fetcher } from "@/utils/fetcher"
import FetchError from "../(layout)/FetchError"
import FetchLoader from "../(layout)/FetchLoader"
import { Users, Medal } from "lucide-react"

type EntityType = "track" | "album" | "artist"

interface Listener {
    userId: string
    name: string
    playCount: number
}

export default function TopListeners({ entityId, entityType, }: { entityId: string, entityType: EntityType }) {
    const { data: listeners, error } = useSWR<Listener[]>(`/api/${entityType}/${entityId}/top-listeners`, fetcher)

    if (error) return <FetchError />
    if (!listeners) return <FetchLoader />

    if (listeners.length === 0) {
        return (
            <div className="rounded-lg bg-[#1e1814] border border-[#3d2e23] p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                    <Users className="text-[#c38e70]" />
                    <h3 className="text-xl font-bold text-[#e6d2c0]">Top Listeners</h3>
                </div>
                <div className="text-center py-8 bg-[#2a211c] rounded-lg">
                    <Users className="w-12 h-12 mx-auto mb-3 text-[#a18072] opacity-50" />
                    <p className="text-[#a18072]">No listeners data available yet</p>
                </div>
            </div>
        )
    }

    const getMedalIcon = (position: number) => {
        switch (position) {
            case 0:
                return <Medal className="text-[#f5b847] w-4 h-4" />
            case 1:
                return <Medal className="text-[#e9e9ea] w-4 h-4" />
            case 2:
                return <Medal className="text-[#6F4E37] w-4 h-4" />
            default:
                return null
        }
    }

    return (
        <div className="rounded-lg bg-[#1e1814] border border-[#3d2e23] p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-6">
                <Users className="text-[#c38e70]" />
                <h3 className="text-xl font-bold text-[#e6d2c0]">Top Listeners</h3>
            </div>
            <div className="space-y-3">
                {listeners.slice(0, 5).map((listener, index) => (
                    <a href={`/user/${listener.userId}`} key={listener.userId} className="flex items-center p-3 bg-[#2a211c] hover:bg-[#342820] transition-colors rounded-lg">
                        <div className="relative mr-3">
                            <div className="w-10 h-10 bg-[#3d2e23] rounded-full flex items-center justify-center overflow-hidden"><span className="text-[#c38e70] font-bold">{listener.name.charAt(0).toUpperCase()}</span></div>
                            {index < 3 && (<div className="absolute -top-1 -right-1 w-5 h-5 bg-[#1e1814] rounded-full flex items-center justify-center border border-[#3d2e23]">{getMedalIcon(index)}</div>)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-[#e6d2c0] truncate">{listener.name}</p>
                            <p className="text-xs text-[#a18072]">{listener.playCount} plays</p>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    )
}