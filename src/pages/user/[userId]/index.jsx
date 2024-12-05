/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Loader from "@/components/(layout)/Loader"
import UserData from "@/components/(user)/UserData";
import NowPlaying from "@/components/(user)/NowPlaying";

export default function UserPage({ userId, accessToken }) {
    const { data: session } = useSession();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const userRef = doc(db, "users", userId);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                setUser(userDoc.data());
            } else {
                console.log("No such user!");
            }
        };
        fetchUserData();
    }, [userId]);

    if (!user) {
        return <Loader />;
    }

    return (
        <div className="flex min-h-screen p-4 gap-4">
            <div className="w-1/3"><UserData session={session} user={user} userId={userId} /></div>
            <div className="w-2/3"><NowPlaying accessToken={accessToken} /></div>
        </div>
    );
}

export async function getServerSideProps(context) {
    const { userId } = context.params;

    if (!userId) {
        return {
            notFound: true,
        };
    }

    try {
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);

        let accessToken = null;
        if (userDoc.exists()) {
            accessToken = userDoc.data().accessToken;
        }

        if (!accessToken) {
            return {
                notFound: true,
            };
        }

        return {
            props: {
                userId,
                accessToken,
            },
        };
    } catch (error) {
        console.error("Error fetching user data:", error);
        return {
            notFound: true,
        };
    }
}