import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import FriendProfileCard from "@/components/(my)/(friends)/FriendProfileCard";
import Loader from "@/components/(layout)/Loader";
import { UserPlus } from 'lucide-react';

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

    if (status === "loading") return <Loader />;
    if (!session) {
        router.push("/");
        return null;
    }

    return (
        <div className="max-w-7xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Your Friends</h1>
            {userData ? (
                friends.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {friends.map((friendId) => (
                            <FriendProfileCard key={friendId} friendId={friendId} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <UserPlus className="w-16 h-16 mx-auto text-zinc-600 mb-4" />
                        <p className="text-xl text-zinc-400 mb-4">You haven&apos;t added any friends yet.</p>
                        <p className="text-zinc-500">
                            Start connecting with other music lovers to compare tastes and discover new tracks!
                        </p>
                    </div>
                )
            ) : (
                <Loader />
            )}
        </div>
    );
}