"use client"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { UserPlus, UserMinus, Loader2 } from "lucide-react"

export default function FriendButton({ targetUserId }: { targetUserId: string }) {
    const { data: session } = useSession()
    const [status, setStatus] = useState<"checking" | "notFriend" | "friend" | "loading">("checking")

    useEffect(() => {
        const checkFriendStatus = async () => {
            if (!session?.user?.id) return

            try {
                const res = await fetch(`/api/friends?friendId=${targetUserId}`)
                const data = await res.json()
                setStatus(data.isFriend ? "friend" : "notFriend")
            } catch {
                setStatus("notFriend")
            }
        }

        checkFriendStatus()
    }, [session, targetUserId])

    if (!session?.user?.id || session.user.id === targetUserId) return null
    if (status === "checking")
        return (
            <div className="px-4 py-2 bg-[#2a211c] text-[#a18072] rounded-full inline-flex items-center gap-2">
                <Loader2 className="animate-spin" size={16} />
                Loading...
            </div>
        )

    const handleFriendAction = async () => {
        setStatus("loading")
        try {
            let res

            if (status === "friend") {
                res = await fetch(`/api/friends?friendId=${targetUserId}`, {
                    method: "DELETE",
                })
                if (res.ok) setStatus("notFriend")
            } else {
                res = await fetch("/api/friends", {
                    method: "POST",
                    body: JSON.stringify({ friendId: targetUserId }),
                })
                if (res.ok) setStatus("friend")
            }

            if (!res.ok) {
                setStatus(status === "friend" ? "friend" : "notFriend")
            }
        } catch {
            setStatus(status === "friend" ? "friend" : "notFriend")
        }
    }

    const isLoading = status === "loading"
    const isFriend = status === "friend"

    return (
        <button onClick={handleFriendAction} disabled={isLoading} className={`px-4 py-2 rounded-full inline-flex items-center gap-2 transition-all ${isFriend ? "bg-[#3d2e23] text-[#e6d2c0]" : "bg-[#c38e70] text-[#1e1814]"} ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"}`}>
            {isLoading ? (
                <><Loader2 className="animate-spin" size={16} />{isFriend ? "Removing..." : "Adding..."}</>
            ) : isFriend ? (
                <><UserMinus size={16} />Remove Friend</>
            ) : (
                <><UserPlus size={16} />Add Friend</>
            )}
        </button>
    )
}