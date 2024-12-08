/* eslint-disable @next/next/no-img-element */
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import FriendProfileCard from "@/components/(my)/FriendProfileCard";
import Navbar from "@/components/(layout)/NavBar";

export default function Friends() {
    const { data: session, status } = useSession();
    const [userData, setUserData] = useState(null);
    const [friends, setFriends] = useState([]);
    const router = useRouter();

    useEffect(() => {
        if (!session) return;

        const fetchUserData = async () => {
            try {
                const userRef = doc(db, "users", session.user.id);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setUserData(data);
                    setFriends(data.friends || []);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [session]);

    if (status === "loading") return <p className="text-white">Loading...</p>;
    if (!session) return router.push("/");

    return (
        <div className="w-full min-h-screen">
            <Navbar />
            {userData ? (
                <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                    <h2 className="text-3xl font-bold mb-6">Friends</h2>
                    {friends.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {friends.map((friendId) => (
                                <FriendProfileCard key={friendId} friendId={friendId} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-white">You have no friends yet.</p>
                    )}
                </div>
            ) : (
                <p className="text-white">Loading...</p>
            )}
        </div>
    );
}