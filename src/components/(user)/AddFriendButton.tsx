'use client';
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function FriendButton({ targetUserId }: { targetUserId: string }) {
    const { data: session } = useSession();
    const [status, setStatus] = useState<'checking' | 'notFriend' | 'friend' | 'loading'>('checking');

    useEffect(() => {
        const checkFriendStatus = async () => {
            if (!session?.user?.id) return;

            try {
                const res = await fetch(`/api/friends?friendId=${targetUserId}`);
                const data = await res.json();
                setStatus(data.isFriend ? 'friend' : 'notFriend');
            } catch {
                setStatus('notFriend');
            }
        };

        checkFriendStatus();
    }, [session, targetUserId]);

    if (!session?.user?.id || session.user.id === targetUserId) return null;
    if (status === 'checking') return <div className="px-4 py-2 border border-white rounded opacity-50">Loading...</div>;

    const handleFriendAction = async () => {
        setStatus('loading');
        try {
            let res;

            if (status === 'friend') {
                res = await fetch(`/api/friends?friendId=${targetUserId}`, {
                    method: "DELETE"
                });
                if (res.ok) setStatus('notFriend');
            } else {
                res = await fetch("/api/friends", {
                    method: "POST",
                    body: JSON.stringify({ friendId: targetUserId }),
                });
                if (res.ok) setStatus('friend');
            }

            if (!res.ok) {
                setStatus(status === 'friend' ? 'friend' : 'notFriend');
            }
        } catch {
            setStatus(status === 'friend' ? 'friend' : 'notFriend');
        }
    };

    const isLoading = status === 'loading';
    const isFriend = status === 'friend';

    return (
        <button
            onClick={handleFriendAction}
            disabled={isLoading}
            className={`px-4 py-2 border border-white rounded ${isLoading ? "opacity-50" : "hover:bg-white hover:text-black transition"}`}>
            {isLoading ? isFriend ? "Removing..." : "Adding..." : isFriend ? "Remove Friend" : "Add Friend"}
        </button>
    );
}