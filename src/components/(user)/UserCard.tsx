"use client"
import useSWR from "swr"
import { fetcher } from "@/utils/fetcher"
import FetchError from "@/components/(layout)/FetchError"
import FetchLoader from "@/components/(layout)/FetchLoader"
import AddFriendButton from "@/components/(user)/AddFriendButton"
import { ExternalLink } from "lucide-react"

type User = {
    userId: string
    name: string
    accountType: string
}

type UserPlayCount = {
    playCount: number
    trackCount: number
    artistCount: number
}

export default function UserCard({ userId }: { userId: string }) {
    const { data: user, error } = useSWR<User>(`/api/user/${userId}`, fetcher)
    const { data: playCount, error: playCountError } = useSWR<UserPlayCount>(`/api/user/${userId}/play-count`, fetcher)

    if (error) return <FetchError />
    if (playCountError) return <FetchError />
    if (!user) return <FetchLoader />
    if (!playCount) return <FetchLoader />

    return (
        <div className="p-3 lg:p-6 rounded-lg bg-[#1e1814] border border-[#3d2e23] shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-28 h-28 lg:w-32 lg:h-32 bg-[rgb(61,46,35)] rounded-full flex items-center justify-center flex-shrink-0"><span className="text-[#c38e70] text-4xl lg:text-6xl font-bold">{user.name.includes(" ") ? user.name.split(" ").slice(0, 2).map(word => word.charAt(0)).join("") : user.name.slice(0, 2)}</span></div>
                    <div>
                        <h2 className="text-3xl font-bold text-[#e6d2c0]">{user.name}</h2>
                        <p className="text-[#a18072] mt-1">{playCount.playCount} plays | {playCount.trackCount} tracks | {playCount.artistCount} artists</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3">
                    <a href={`https://open.spotify.com/user/${user.userId}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-[#1DB954] text-black font-medium rounded-full hover:bg-opacity-90 transition-all">View on Spotify<ExternalLink size={16} /></a>
                    <AddFriendButton targetUserId={user.userId} />
                </div>
            </div>
        </div >
    )
}