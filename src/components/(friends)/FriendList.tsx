import { BiMusic } from "react-icons/bi"

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

interface FriendListProps {
    friends: FriendMatch[]
    selectedFriend: FriendMatch | null
    onSelectFriend: (friend: FriendMatch) => void
}

export default function FriendList({ friends, selectedFriend, onSelectFriend }: FriendListProps) {
    return (
        <div className="bg-black border border-white rounded">
            <div className="p-4 border-b">
                <h2 className="font-semibold">Your Friends</h2>
            </div>
            <ul className="divide-y">
                {friends.map((friend) => (
                    <li key={friend.friendId} onClick={() => onSelectFriend(friend)} className={`p-4 flex items-center cursor-pointer transition${selectedFriend?.friendId === friend.friendId ? 'bg-black border border-white' : 'hover:bg-gray-950'}`}>
                        <div className="mr-3 w-10 h-10 bg-black border border-white rounded-full flex items-center justify-center">{friend.friendInfo.name.charAt(0).toUpperCase()}</div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{friend.friendInfo.name}</p>
                            <div className="flex items-center text-sm text-gray-300">
                                <BiMusic className="w-3 h-3 mr-1" />
                                <span>{friend.compatibilityScore}% match</span>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}