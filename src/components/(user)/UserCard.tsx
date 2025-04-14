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

export default function UserCard({ userId }: { userId: string }) {
    const { data: user, error } = useSWR<User>(`/api/user/${userId}`, fetcher)

    if (error) return <FetchError />
    if (!user) return <FetchLoader />

    return (
        <div className="p-6 rounded-lg bg-[#1e1814] border border-[#3d2e23] shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-[#e6d2c0]">{user.name}</h2>
                    <p className="text-[#a18072] mt-1">Spotify User</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <a href={`https://open.spotify.com/user/${user.userId}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-[#1DB954] text-black font-medium rounded-full hover:bg-opacity-90 transition-all">View on Spotify<ExternalLink size={16} /></a>
                    <AddFriendButton targetUserId={user.userId} />
                </div>
            </div>
        </div>
    )
}