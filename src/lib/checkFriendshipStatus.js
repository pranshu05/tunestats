import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

export async function checkFriendshipStatus(sessionUserId, profileUserId) {
    if (sessionUserId === profileUserId) {
        return { isFriend: true, isOwner: true, isPrivate: false };
    }

    const userRef = doc(db, "users", profileUserId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
        throw new Error("Profile user not found");
    }

    const profileUserData = userDoc.data();
    const friends = profileUserData.friends || [];

    const isFriend = friends.includes(sessionUserId);
    return { isFriend, isOwner: false, isPrivate: !isFriend };
}