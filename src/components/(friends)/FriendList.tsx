"use client"

import { Music, User } from "lucide-react"

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

interface FriendListProps {
    friends: FriendMatch[]
    selectedFriend: FriendMatch | null
    onSelectFriend: (friend: FriendMatch) => void
}

export default function FriendList({ friends, selectedFriend, onSelectFriend }: FriendListProps) {
    return (
        <div className="rounded-lg bg-[#1e1814] border border-[#3d2e23] shadow-lg overflow-hidden">
            <div className="p-4 border-b border-[#3d2e23]">
                <h2 className="font-bold text-[#e6d2c0] flex items-center gap-2"><User className="text-[#c38e70]" size={18} /> Your Friends</h2>
            </div>
            <ul className="divide-y divide-[#3d2e23]">
                {friends.map((friend) => (
                    <li key={friend.friendId} onClick={() => onSelectFriend(friend)} className={`p-4 flex items-center cursor-pointer transition-colors ${selectedFriend?.friendId === friend.friendId ? "bg-[#2a211c]" : "hover:bg-[#2a211c]"}`}>
                        <div className="mr-3 w-10 h-10 bg-[#3d2e23] rounded-full flex items-center justify-center flex-shrink-0"><span className="text-[#c38e70] font-bold">{friend.friendInfo.name.includes(" ") ? friend.friendInfo.name.split(" ").slice(0, 2).map(word => word.charAt(0).toUpperCase()).join("") : friend.friendInfo.name.charAt(0).toUpperCase()}</span></div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-[#e6d2c0] truncate">{friend.friendInfo.name}</p>
                            <div className="flex items-center text-sm text-[#a18072]">
                                <Music className="w-3 h-3 mr-1 text-[#c38e70]" />
                                <span>{friend.compatibilityScore}% match</span>
                            </div>
                        </div>
                        {selectedFriend?.friendId === friend.friendId && (<div className="w-1.5 h-1.5 rounded-full bg-[#c38e70] ml-2"></div>)}
                    </li>
                ))}
            </ul>
        </div>
    )
}