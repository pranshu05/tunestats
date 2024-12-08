/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

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

    if (loading) {
        return <div className="text-white">Loading...</div>;
    }

    if (!friendData) {
        return <div className="text-white">Unable to load friend data</div>;
    }

    return (
        <div className="flex flex-col items-center bg-[#121212] p-3 rounded-lg gap-2">
            <img src={friendData.image === "unknown" ? "https://github.com/user-attachments/assets/bf57cb96-b259-4290-b35b-0ede9d618802" : friendData.image} alt={friendData.name} className="w-32 h-32 rounded-full object-cover" />
            <h3 className="text-xl font-bold">{friendData.name}</h3>
            <a href={`/user/${friendId}`} className="px-4 py-2 bg-[#121212] border-[2px] border-[#333] rounded-md">View Profile</a>
        </div>
    );
}