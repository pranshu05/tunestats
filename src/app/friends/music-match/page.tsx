'use client'
import { useState, useEffect } from 'react'
import FriendList from '@/components/(friends)/FriendList'
import CompatibilityScore from '@/components/(friends)/CompatibilityScore'
import SharedArtists from '@/components/(friends)/SharedArtists'
import SharedTracks from '@/components/(friends)/SharedTracks'
import StatsSummary from '@/components/(friends)/StatsSummary'
import FetchLoader from '@/components/(layout)/FetchLoader'

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
}

export default function MusicMatchPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [friends, setFriends] = useState<FriendMatch[]>([])
    const [selectedFriend, setSelectedFriend] = useState<FriendMatch | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await fetch('/api/friends/music-match')

                if (!response.ok) {
                    throw new Error('Failed to fetch friend data')
                }

                const data = await response.json()
                setFriends(data)

                if (data.length > 0) {
                    setSelectedFriend(data[0])
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Something went wrong')
            } finally {
                setIsLoading(false)
            }
        }

        fetchFriends()
    }, [])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <FetchLoader />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="bg-black border border-white px-4 py-3 rounded">
                    <p><strong>Error:</strong> {error}</p>
                    <p>Please try again later.</p>
                </div>
            </div>
        )
    }

    if (friends.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="text-center p-8 max-w-md">
                    <h1 className="text-2xl font-bold mb-4">No Music Matches Yet</h1>
                    <p className="mb-4">You don&apos;t have any friends with music listening data yet, or you haven&apos;t listened to music in the past week.</p>
                    <p>Start listening to music and invite your friends to join so you can discover your music compatibility!</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Your Music Matches</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1">
                    <FriendList friends={friends}selectedFriend={selectedFriend}onSelectFriend={(friend: FriendMatch) => setSelectedFriend(friend)}/>
                </div>
                {selectedFriend && (
                    <div className="md:col-span-3 space-y-8">
                        <div className="bg-black border border-white p-6">
                            <h2 className="text-2xl font-semibold mb-4">Your Music Match with {selectedFriend.friendInfo.name}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="md:col-span-1"><CompatibilityScore score={selectedFriend.compatibilityScore} /></div>
                                <div className="md:col-span-2"><StatsSummary stats={selectedFriend.stats} /></div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-black border border-white p-6"><SharedArtists artists={selectedFriend.topSharedArtists} /></div>
                            <div className="bg-black border border-white p-6"><SharedTracks tracks={selectedFriend.topSharedTracks} /></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}