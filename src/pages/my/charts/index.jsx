/* eslint-disable @next/next/no-img-element */
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "@/components/(layout)/NavBar";
import Loader from "@/components/(layout)/Loader";
import FriendComparison from "@/components/(my)/(charts)/FriendComparison";

export default function ChartsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === "loading") return <Loader />;
    if (!session) return router.push("/");

    return (
        <div className="w-full min-h-screen">
            <Navbar />
            <div className="max-w-7xl mx-auto p-4">
                <h2 className="text-3xl font-bold mb-6">Music Charts</h2>
                <FriendComparison userId={session.user.id} />
            </div>
        </div>
    );
}