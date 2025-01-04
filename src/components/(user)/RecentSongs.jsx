/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

export default function RecentSongs({ userId }) {
    const [recentSongs, setRecentSongs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTrackDetails = async (userId, trackId) => {
        try {
            const response = await fetch(`/api/getTrack?userId=${userId}&trackId=${trackId}`);
            if (response.ok) {
                const data = await response.json();
                return {
                    id: data.track.trackId,
                    title: data.track.trackName,
                    artist: data.track.trackArtists,
                    image: data.track.trackAlbumImageUrl,
                    url: data.track.trackUrl,
                };
            } else {
                console.error("Failed to fetch track details");
                return null;
            }
        } catch (error) {
            console.error("Error fetching track details:", error);
            return null;
        }
    };

    useEffect(() => {
        const userRef = doc(db, "recentlyPlayed", userId);

        const unsubscribe = onSnapshot(userRef, async (docSnapshot) => {
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                const trackEntries = [];

                for (const [trackId, trackInfo] of Object.entries(data)) {
                    for (const timestamp of trackInfo.timestamps) {
                        trackEntries.push({ trackId, timestamp });
                    }
                }

                trackEntries.sort((a, b) => b.timestamp - a.timestamp);

                const detailedTracks = await Promise.all(
                    trackEntries.map(async ({ trackId, timestamp }) => {
                        const trackDetails = await fetchTrackDetails(userId, trackId);
                        return trackDetails ? { ...trackDetails, timestamp } : null;
                    })
                );

                setRecentSongs(detailedTracks.filter(Boolean));
                setLoading(false);
            } else {
                setRecentSongs([]);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [userId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-zinc-900/50 rounded-md p-4 shadow-lg">
            <h3 className="text-xl font-bold mb-4">Recently Played</h3>
            <div className="space-y-4">
                {recentSongs.map((recentSong, index) => (
                    <a key={index} href={recentSong.url} className="flex items-center gap-4 p-2 rounded-lg hover:bg-zinc-800/50 transition-colors">
                        <img src={recentSong.image} alt={`Album cover for ${recentSong.title}`} className="w-12 h-12 rounded-md object-cover" />
                        <div className="flex-grow min-w-0">
                            <h4 className="text-sm font-semibold truncate">{recentSong.title}</h4>
                            <p className="text-xs text-gray-400 truncate">{recentSong.artist}</p>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}