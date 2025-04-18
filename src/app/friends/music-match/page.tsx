"use client"
import { useState, useEffect } from "react"
import FriendList from "@/components/(friends)/FriendList"
import CompatibilityScore from "@/components/(friends)/CompatibilityScore"
import SharedGenres from "@/components/(friends)/SharedGenres"
import SharedArtists from "@/components/(friends)/SharedArtists"
import SharedTracks from "@/components/(friends)/SharedTracks"
import StatsSummary from "@/components/(friends)/StatsSummary"
import FetchLoader from "@/components/(layout)/FetchLoader"
import { AlertTriangle, UserPlus } from "lucide-react"

interface Track {
    trackId: string
    name: string
    artistName: string
}

interface Artist {
    artistId: string
    name: string
}

interface Stats {
    sharedTracks: number
    totalUniqueTracks: number
    sharedArtists: number
    totalUniqueArtists: number
    sharedGenres: number
    totalUniqueGenres: number
}

interface FriendInfo {
    userId: string
    name: string
    email: string
}

interface FriendMatch {
    friendId: string
    friendInfo: FriendInfo
    compatibilityScore: number
    stats: Stats
    topSharedArtists: Artist[]
    topSharedTracks: Track[]
    topSharedGenres: string[]
}

export default function MusicMatchPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [friends, setFriends] = useState<FriendMatch[]>([])
    const [selectedFriend, setSelectedFriend] = useState<FriendMatch | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await fetch("/api/friends/music-match")

                if (!response.ok) {
                    throw new Error("Failed to fetch friend data")
                }

                const data = await response.json()
                setFriends(data)

                if (data.length > 0) {
                    setSelectedFriend(data[0])
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Something went wrong")
            } finally {
                setIsLoading(false)
            }
        }

        fetchFriends()
    }, [])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#121212] text-white font-sans">
                <div className="flex items-center justify-center min-h-[80vh]">
                    <FetchLoader />
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#121212] text-white font-sans">
                <div className="flex flex-col items-center justify-center min-h-[80vh]">
                    <div className="rounded-lg bg-[#1e1814] border border-red-500 p-6 shadow-lg max-w-md">
                        <div className="flex items-center gap-2 mb-4 text-red-500">
                            <AlertTriangle />
                            <h2 className="text-xl font-bold">Error</h2>
                        </div>
                        <p className="text-[#e6d2c0] mb-2">{error}</p>
                        <p className="text-[#a18072]">Please try again later.</p>
                    </div>
                </div>
            </div>
        )
    }

    if (friends.length === 0) {
        return (
            <div className="min-h-screen bg-[#121212] text-white font-sans">
                <div className="flex flex-col items-center justify-center min-h-[80vh]">
                    <div className="rounded-lg bg-[#1e1814] border border-[#3d2e23] p-8 shadow-lg max-w-md text-center">
                        <UserPlus className="h-12 w-12 mx-auto mb-4 text-[#c38e70]" />
                        <h1 className="text-2xl font-bold mb-4 text-[#e6d2c0]">No Music Matches Yet</h1>
                        <p className="mb-4 text-[#a18072]">You don&apos;t have any friends with music listening data yet, or you haven&apos;t listened to music inthe past week.</p>
                        <p className="text-[#a18072]">Start listening to music and invite your friends to join so you can discover your music compatibility!</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-[#121212] text-white font-sans mx-auto px-4 py-8 space-y-8">
            <h1 className="text-3xl font-bold mb-8 text-[#e6d2c0]">Your Music Matches</h1>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1"><FriendList friends={friends} selectedFriend={selectedFriend} onSelectFriend={(friend: FriendMatch) => setSelectedFriend(friend)} /></div>
                {selectedFriend && (
                    <div className="lg:col-span-3 space-y-8">
                        <div className="rounded-lg bg-[#1e1814] border border-[#3d2e23] p-3 lg:p-6 shadow-lg">
                            <h2 className="text-2xl font-semibold mb-6 text-[#e6d2c0]">Your Music Match with <a href={`/user/${selectedFriend.friendId}`} >{selectedFriend.friendInfo.name}</a></h2>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-1"><CompatibilityScore score={selectedFriend.compatibilityScore} sharedGenres={selectedFriend.stats.sharedGenres} totalUniqueGenres={selectedFriend.stats.totalUniqueGenres} /></div>
                                <div className="lg:col-span-2"><StatsSummary stats={selectedFriend.stats} /></div>
                            </div>
                        </div>
                        <SharedGenres genres={selectedFriend.topSharedGenres} />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <SharedArtists artists={selectedFriend.topSharedArtists} />
                            <SharedTracks tracks={selectedFriend.topSharedTracks} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}