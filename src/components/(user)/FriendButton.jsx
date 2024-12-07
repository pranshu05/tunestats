import { useState, useEffect } from "react";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

export default function FriendButton({ currentUserId, userId }) {
    const [isFriend, setIsFriend] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkFriendshipStatus = async () => {
            try {
                const currentUserRef = doc(db, "users", currentUserId);
                const currentUserDoc = await getDoc(currentUserRef);

                if (currentUserDoc.exists()) {
                    const currentUserData = currentUserDoc.data();
                    setIsFriend(currentUserData.friends?.includes(userId) || false);
                }
            } catch (error) {
                console.error("Error checking friendship status:", error);
            }
        };

        checkFriendshipStatus();
    }, [currentUserId, userId]);

    const handleAddFriend = async () => {
        setLoading(true);
        try {
            const currentUserRef = doc(db, "users", currentUserId);
            await updateDoc(currentUserRef, {
                friends: arrayUnion(userId),
            });
            setIsFriend(true);
        } catch (error) {
            console.error("Error adding friend:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFriend = async () => {
        setLoading(true);
        try {
            const currentUserRef = doc(db, "users", currentUserId);
            await updateDoc(currentUserRef, {
                friends: arrayRemove(userId),
            });
            setIsFriend(false);
        } catch (error) {
            console.error("Error removing friend:", error);
        } finally {
            setLoading(false);
        }
    };

    if (currentUserId === userId) return null;

    return (
        <button onClick={isFriend ? handleRemoveFriend : handleAddFriend} disabled={loading} className={`px-4 py-2 bg-[#121212] border-[2px] border-[#333] rounded-md`}>{loading ? "Processing..." : isFriend ? "Remove Friend" : "Add Friend"}</button>
    );
}