import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

export default function UserTrackStats({ trackId, userId }) {
    const [playCount, setPlayCount] = useState(0);

    useEffect(() => {
        if (!userId || !trackId) return;

        const userRef = doc(db, "recentlyPlayed", userId);

        const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const userData = docSnapshot.data();
                const trackEntry = userData[trackId];

                if (trackEntry) {
                    setPlayCount(trackEntry.playCount);
                } else {
                    setPlayCount(0);
                }
            }
        });

        return () => unsubscribe();
    }, [trackId, userId]);

    if (playCount === 0) return null;

    return (
        <div className="p-4 rounded-lg bg-zinc-900/50">
            <p className="text-xl lg:text-3xl font-semibold text-center">
                You&apos;ve played this track <span className="text-green-400 text-bold">{playCount}</span> times.
            </p>
        </div>
    );
}