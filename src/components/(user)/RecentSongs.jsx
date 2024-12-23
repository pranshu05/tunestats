/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { Clock } from 'lucide-react';

export default function RecentSongs({ userId }) {
    const [recentSongs, setRecentSongs] = useState([]);

    useEffect(() => {
        const fetchRecentlyPlayed = async () => {
            try {
                const res = await fetch(`/api/recently-played?userId=${userId}`);
                if (res.ok) {
                    const data = await res.json();
                    setRecentSongs(data.recentSongs);
                } else {
                    console.error("Failed to fetch recently played songs");
                }
            } catch (error) {
                console.error("Error fetching recently played songs:", error);
            }
        };

        if (userId) {
            fetchRecentlyPlayed();
        }
    }, [userId]);

    return (
        <div className="bg-zinc-900/50 rounded-md p-4 shadow-lg">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Clock className="w-5 h-5" />Recently Played</h3>
            <div className="space-y-4">
                {recentSongs.map((recentSong, index) => (
                    <a key={index} href={`/track/${recentSong.id}`} className="flex items-center gap-4 p-2 rounded-lg hover:bg-zinc-800/50 transition-colors">
                        <img src={recentSong.image} alt={`Album cover for ${recentSong.title}`} className="w-12 h-12 rounded-md object-cover" />
                        <div className="flex-grow min-w-0">
                            <h4 className="text-sm font-semibold truncate">{recentSong.title}</h4>
                            <p className="text-xs text-gray-400 truncate">{recentSong.artist}</p>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    )
}