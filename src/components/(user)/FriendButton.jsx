import { useState, useEffect } from "react";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus } from 'lucide-react';

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
        <Button onClick={isFriend ? handleRemoveFriend : handleAddFriend} disabled={loading} variant={isFriend ? "destructive" : "default"}>
            {loading ? (
                "Processing..."
            ) : isFriend ? (
                <><UserMinus className="w-4 h-4 mr-2" />Remove Friend</>
            ) : (
                <><UserPlus className="w-4 h-4 mr-2" />Add Friend</>
            )}
        </Button>
    );
}