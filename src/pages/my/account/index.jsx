/* eslint-disable @next/next/no-img-element */
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import Navbar from "@/components/(layout)/NavBar";

export default function MyAccountPage() {
    const { data: session, status } = useSession();
    const [userData, setUserData] = useState(null);
    const [accountType, setAccountType] = useState("Public");
    const [loading, setLoading] = useState(false);
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
                    setAccountType(data.accountType || "Public");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [session]);

    const handleAccountTypeToggle = async () => {
        if (!session) return;
        setLoading(true);
        try {
            const newAccountType = accountType === "Public" ? "Private" : "Public";
            const userRef = doc(db, "users", session.user.id);

            await updateDoc(userRef, { accountType: newAccountType });
            setAccountType(newAccountType);
        } catch (error) {
            console.error("Error updating account type:", error);
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading") return <p className="text-white">Loading...</p>;
    if (!session) return router.push("/");

    return (
        <div className="min-h-screen w-full">
            <Navbar />
            <div className="flex flex-col h-full justify-center items-center p-3">
                {userData ? (
                    <div className="bg-[#121212] p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <div className="flex flex-col items-center">
                            <img src={!session.user.image ? 'https://github.com/user-attachments/assets/bf57cb96-b259-4290-b35b-0ede9d618802' : session.user.image} alt="Profile Picture" className="w-32 h-32 lg:w-52 lg:h-52 rounded-full mb-4 object-cover" />
                            <h2 className="text-xl font-bold">{session.user.name || "Anonymous"}</h2>
                            <p className="text-gray-400">{session.user.email}</p>
                        </div>
                        <div className="flex gap-3 justify-center items-center mt-6">
                            <label htmlFor="accountType" className="text-lg font-medium">Account Type:</label>
                            <button onClick={handleAccountTypeToggle} disabled={loading} className="px-4 py-2 bg-[#121212] border-[2px] border-[#333] rounded-md">
                                {loading ? "Updating..." : `Set to ${accountType === "Public" ? "Private" : "Public"}`}
                            </button>
                        </div>
                        <div className="flex gap-3 justify-center items-center mt-6">
                            <Link href={`/user/${session.user.id}`} className="px-4 py-2 bg-[#121212] border-[2px] border-[#333] rounded-md">View Profile</Link>
                            <Link href="/my/friends" className="px-4 py-2 bg-[#121212] border-[2px] border-[#333] rounded-md">View Friends</Link>
                        </div>
                    </div>
                ) : (
                    <p>Loading profile...</p>
                )}
            </div>
        </div>
    );
}