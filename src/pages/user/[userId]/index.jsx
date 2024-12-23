import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Loader from "@/components/(layout)/Loader";
import UserData from "@/components/(user)/UserData";
import NowPlaying from "@/components/(user)/NowPlaying";
import RecentSongs from "@/components/(user)/RecentSongs";
import TopArtists from "@/components/(user)/TopArtists";
import TopSongs from "@/components/(user)/TopSongs";
import TopGenres from "@/components/(user)/TopGenres";
import { checkFriendshipStatus } from "@/lib/checkFriendshipStatus";

export default function UserPage({ userId }) {
    const { data: session } = useSession();
    const [user, setUser] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFriend, setIsFriend] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [accountType, setAccountType] = useState("Public");
    const [viewModes, setViewModes] = useState({ songs: 'list', artists: 'list', });

    useEffect(() => {
        const fetchUserData = async () => {
            const userRef = doc(db, "users", userId);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                setUser(userData);
                setAccountType(userData.accountType || "Public");
            } else {
                console.error("No such user!");
            }
        };

        const checkProfileVisibility = async () => {
            if (session?.user?.id) {
                setIsOwner(session.user.id === userId);
                const { isFriend } = await checkFriendshipStatus(session.user.id, userId);
                setIsFriend(isFriend);
            }
        };

        fetchUserData();
        checkProfileVisibility();
    }, [session, userId]);

    if (!user) {
        return <Loader />;
    }

    const profileIsVisible = accountType === "Public" || isOwner || isFriend;

    const handleViewModeChange = (section, mode) => {
        setViewModes(prev => ({
            ...prev,
            [section]: mode
        }));
    };

    return profileIsVisible ? (
        <div className="p-4 max-w-7xl mx-auto space-y-4">
            <div className="bg-gradient-to-b from-zinc-800/50 to-zinc-900/50 rounded-md p-4"><UserData session={session} user={user} userId={userId} /></div>
            {isPlaying && <NowPlaying userId={userId} onIsPlayingChange={setIsPlaying} />}
            <div className="bg-zinc-900/50 rounded-md p-4"><TopSongs userId={userId} viewMode={viewModes.songs} onViewModeChange={(mode) => handleViewModeChange('songs', mode)} /></div>
            <div className="bg-zinc-900/50 rounded-md p-4"><TopArtists userId={userId} viewMode={viewModes.artists} onViewModeChange={(mode) => handleViewModeChange('artists', mode)} /></div>
            <div className="bg-zinc-900/50 rounded-md p-4"><TopGenres userId={userId} /></div>
            <RecentSongs userId={userId} />
            <div className="hidden">
                <NowPlaying userId={userId} onIsPlayingChange={setIsPlaying} />
            </div>
        </div>
    ) : (
        <div className="p-4 max-w-7xl mx-auto space-y-4">
            <div className="bg-zinc-900/50 rounded-md p-4 text-center">
                <UserData session={session} user={user} userId={userId} />
                <p className="mt-6 text-lg">This profile is private.</p>
            </div>
        </div>
    );
}

export async function getServerSideProps(context) {
    const { userId } = context.params;
    if (!userId) {
        return { notFound: true };
    }
    return { props: { userId } };
}