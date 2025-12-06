"use client"
import { useSession } from "next-auth/react"
import { useState, useEffect, useCallback } from "react"
import { UserPlus, UserMinus, Loader2 } from "lucide-react"

type FriendStatus = "checking" | "notFriend" | "friend" | "loading" | "error";

export default function FriendButton({ targetUserId }: { targetUserId: string }) {
    const { data: session } = useSession()
    const [status, setStatus] = useState<FriendStatus>("checking")
    const [error, setError] = useState<string | null>(null)

    const checkFriendStatus = useCallback(async () => {
        if (!session?.user?.id || !targetUserId) {
            setStatus("checking");
            return;
        }

        try {
            setError(null);
            const res = await fetch(`/api/friends?friendId=${encodeURIComponent(targetUserId)}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                throw new Error('Failed to check friend status');
            }

            const data = await res.json();
            setStatus(data.isFriend ? "friend" : "notFriend");
        } catch (err) {
            console.error('Error checking friend status:', err);
            setStatus("error");
            setError('Failed to load friend status');
        }
    }, [session, targetUserId]);

    useEffect(() => {
        checkFriendStatus();
    }, [checkFriendStatus]);

    // Don't show button if user is viewing their own profile or not logged in
    if (!session?.user?.id || session.user.id === targetUserId) {
        return null;
    }

    if (status === "checking") {
        return (
            <div className="px-4 py-2 bg-[#2a211c] text-[#a18072] rounded-full inline-flex items-center gap-2">
                <Loader2 className="animate-spin" size={16} />
                Loading...
            </div>
        );
    }

    if (status === "error") {
        return (
            <button 
                onClick={checkFriendStatus}
                className="px-4 py-2 bg-red-900/20 text-red-300 rounded-full inline-flex items-center gap-2 hover:bg-red-900/30 transition-colors"
                title={error || "Error loading friend status"}
            >
                Retry
            </button>
        );
    }

    const handleFriendAction = async () => {
        setStatus("loading");
        setError(null);

        try {
            const isFriend = status === "friend";
            let res: Response;

            if (isFriend) {
                res = await fetch(`/api/friends?friendId=${encodeURIComponent(targetUserId)}`, {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            } else {
                res = await fetch("/api/friends", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ friendId: targetUserId }),
                });
            }

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || `Failed to ${isFriend ? 'remove' : 'add'} friend`);
            }

            // Update status based on the action performed
            setStatus(isFriend ? "notFriend" : "friend");
        } catch (err) {
            console.error('Error updating friend status:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
            // Revert to previous status
            setStatus(status === "friend" ? "friend" : "notFriend");
        }
    };

    const isLoading = status === "loading";
    const isFriend = status === "friend";

    return (
        <button 
            onClick={handleFriendAction} 
            disabled={isLoading} 
            className={`px-4 py-2 rounded-full inline-flex items-center gap-2 transition-all ${
                isFriend 
                    ? "bg-[#3d2e23] text-[#e6d2c0] hover:bg-[#4a3829]" 
                    : "bg-[#c38e70] text-[#1e1814] hover:bg-[#b07d60]"
            } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
            aria-label={isFriend ? "Remove friend" : "Add friend"}
            title={error || undefined}
        >
            {isLoading ? (
                <>
                    <Loader2 className="animate-spin" size={16} />
                    {isFriend ? "Removing..." : "Adding..."}
                </>
            ) : isFriend ? (
                <>
                    <UserMinus size={16} />
                    Remove Friend
                </>
            ) : (
                <>
                    <UserPlus size={16} />
                    Add Friend
                </>
            )}
        </button>
    );
}