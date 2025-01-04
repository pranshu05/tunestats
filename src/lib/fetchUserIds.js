import { db } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export async function fetchAllUserIds() {
    const usersCollection = collection(db, "users");
    const snapshot = await getDocs(usersCollection);
    const userIds = snapshot.docs.map((doc) => doc.id);
    return userIds;
}