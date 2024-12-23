/* eslint-disable @next/next/no-img-element */
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import Loader from "@/components/(layout)/Loader";
import { User, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

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
    if (!session) {
        router.push("/");
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">My Account</h1>
            {userData ? (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-center">Profile Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center">
                            <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                                {session.user.image ? (
                                    <img src={session.user.image} alt="Profile Picture" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-zinc-700">
                                        <User className="w-1/2 h-1/2 text-zinc-400" />
                                    </div>
                                )}
                            </div>
                            <h2 className="text-xl font-bold mb-1">{session.user.name || "Anonymous"}</h2>
                            <p className="text-zinc-400 mb-4">{session.user.email}</p>
                            <div className="flex items-center gap-2 mb-6">
                                <span className="font-medium">Account Type:</span>
                                <div className="flex items-center">
                                    <span className="mr-2">{accountType}</span>
                                    <Switch checked={accountType === "Public"} onCheckedChange={handleAccountTypeToggle} disabled={loading} />
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 w-full">
                                <Button asChild className="w-full"><Link href={`/user/${session.user.id}`}><User className="w-4 h-4 mr-2" />View Profile</Link></Button>
                                <Button asChild variant="outline" className="w-full"><Link href="/my/friends"><Users className="w-4 h-4 mr-2" />View Friends</Link></Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Loader />
            )}
        </div>
    );
}