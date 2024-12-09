/* eslint-disable @next/next/no-img-element */
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import Navbar from "@/components/(layout)/NavBar";
import Loader from "@/components/(layout)/Loader";

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

    if (status === "loading") return <Loader />;
    if (!session) return router.push("/");

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-grow flex flex-col justify-center items-center p-4">
                {userData ? (
                    <div className="bg-[#121212] p-6 rounded-lg shadow-lg max-w-sm w-full border-[2px] border-[#333]">
                        <div className="flex flex-col items-center">
                            <img src={session.user.image || "https://github.com/user-attachments/assets/bf57cb96-b259-4290-b35b-0ede9d618802"} alt="Profile Picture" className="w-32 h-32 lg:w-52 lg:h-52 rounded-full mb-4 object-cover" />
                            <h2 className="text-xl font-bold text-white">{session.user.name || "Anonymous"}</h2>
                            <p className="text-gray-400">{session.user.email}</p>
                        </div>
                        <div className="mt-6">
                            <label htmlFor="accountType" className="block text-base font-medium text-center">Account Type</label>
                            <button onClick={handleAccountTypeToggle} disabled={loading} className="w-full mt-2 px-4 py-2 bg-[#121212] border-[2px] border-[#333] text-white rounded-md hover:bg-[#1a1a1a] disabled:bg-[#252525] transition-all">{loading ? "Updating..." : `Set to ${accountType === "Public" ? "Private" : "Public"}`}</button>
                        </div>
                        <div className="flex gap-3 justify-center items-center mt-6">
                            <Link href={`/user/${session.user.id}`} className="px-4 py-2 w-full text-center bg-[#121212] border-[2px] border-[#333] text-white rounded-md hover:bg-[#1a1a1a] transition-all">View Profile</Link>
                            <Link href="/my/friends" className="px-4 py-2 w-full text-center bg-[#121212] border-[2px] border-[#333] text-white rounded-md hover:bg-[#1a1a1a] transition-all">View Friends</Link>
                        </div>
                    </div>
                ) : (
                    <p className="text-white">Loading profile...</p>
                )}
            </div>
        </div>
    );
}