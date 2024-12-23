/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import Loader from "@/components/(layout)/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
        <Card className="overflow-hidden p-4">
            <CardContent>
                <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden">
                        {friendData.image && friendData.image !== "unknown" ? (
                            <img src={friendData.image} alt={friendData.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-zinc-700">
                                <User className="w-1/2 h-1/2 text-zinc-400" />
                            </div>
                        )}
                    </div>
                    <h3 className="text-xl font-bold text-center mb-4">{friendData.name}</h3>
                    <Button asChild className="w-full">
                        <Link href={`/user/${friendId}`}>View Profile</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}