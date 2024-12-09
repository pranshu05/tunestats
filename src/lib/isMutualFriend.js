import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

export const isMutualFriend = async (userId, friendId) => {
    try {
        const userRef = doc(db, "users", userId);
        const friendRef = doc(db, "users", friendId);

        const [userDoc, friendDoc] = await Promise.all([
            getDoc(userRef),
            getDoc(friendRef),
        ]);

        if (userDoc.exists() && friendDoc.exists()) {
            const userFriends = userDoc.data().friends || [];
            const friendFriends = friendDoc.data().friends || [];

            return userFriends.includes(friendId) && friendFriends.includes(userId);
        }
        return false;
    } catch (error) {
        console.error("Error checking mutual friendship:", error);
        return false;
    }
};