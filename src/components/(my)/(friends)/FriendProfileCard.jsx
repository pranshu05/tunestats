/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import Loader from "@/components/(layout)/Loader";
import Link from "next/link";
import { User } from 'lucide-react';

export default function FriendProfileCard({ friendId }) {
    const [friendData, setFriendData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFriendData = async () => {
            try {
                const friendRef = doc(db, "users", friendId);
                const friendDoc = await getDoc(friendRef);

                if (friendDoc.exists()) {
                    setFriendData(friendDoc.data());
                } else {
                    console.error("Friend data not found");
                }
            } catch (error) {
                console.error("Error fetching friend data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFriendData();
    }, [friendId]);

    if (loading) return <Loader />;
    if (!friendData) return <div className="text-white">Unable to load friend data</div>;

    return (
        <div className="bg-zinc-800 rounded-lg overflow-hidden">
            <div className="aspect-square relative">
                {friendData.image && friendData.image !== "unknown" ? (
                    <img src={friendData.image} alt={friendData.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-700">
                        <User className="w-1/2 h-1/2 text-zinc-500" />
                    </div>
                )}
            </div>
            <div className="p-4">
                <h3 className="text-xl font-bold text-white mb-2 truncate">{friendData.name}</h3>
                <Link href={`/user/${friendId}`} className="block w-full text-center px-4 py-2 bg-[#1DB954] text-black font-semibold rounded-md transition-colors duration-300 hover:bg-[#1ed760]">View Profile</Link>
            </div>
        </div>
    );
}