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
    const { data: user, error: userError } = useSWR<User>(
        userId ? `/api/user/${userId}` : null, 
        fetcher,
        {
            revalidateOnMount: true,
            shouldRetryOnError: true,
        }
    );
    
    const { data: playCount, error: playCountError } = useSWR<UserPlayCount>(
        userId ? `/api/user/${userId}/playcount` : null, 
        fetcher,
        {
            revalidateOnMount: true,
            shouldRetryOnError: true,
        }
    );

    // Show error if either request fails
    if (userError || playCountError) {
        return <FetchError />
    }

    // Show loader while either is loading
    if (!user || !playCount) {
        return <FetchLoader />
    }

    // Generate user initials safely
    const getInitials = (name: string) => {
        if (!name) return "??";
        const words = name.trim().split(" ");
        if (words.length >= 2) {
            return words.slice(0, 2).map(word => word.charAt(0).toUpperCase()).join("");
        }
        return name.slice(0, 2).toUpperCase();
    };

    const formatNumber = (num: number) => {
        return num.toLocaleString();
    };

    return (
        <div className="p-3 lg:p-6 rounded-lg bg-[#1e1814] border border-[#3d2e23] shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
                <div className="flex items-center gap-4">
                    <div 
                        className="w-28 h-28 lg:w-32 lg:h-32 bg-[rgb(61,46,35)] rounded-full flex items-center justify-center flex-shrink-0"
                        aria-label={`${user.name}'s avatar`}
                    >
                        <span className="text-[#c38e70] text-4xl lg:text-6xl font-bold">
                            {getInitials(user.name)}
                        </span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-[#e6d2c0]">{user.name}</h1>
                        <p className="text-[#a18072] mt-1">
                            {formatNumber(playCount.playCount)} plays | {formatNumber(playCount.trackCount)} tracks | {formatNumber(playCount.artistCount)} artists
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3">
                    <a 
                        href={`https://open.spotify.com/user/${encodeURIComponent(user.userId)}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#1DB954] text-black font-medium rounded-full hover:bg-opacity-90 transition-all"
                        aria-label="View profile on Spotify"
                    >
                        View on Spotify
                        <ExternalLink size={16} aria-hidden="true" />
                    </a>
                    <AddFriendButton targetUserId={user.userId} />
                </div>
            </div>
        </div>
    )
}