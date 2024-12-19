/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";

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
        <div className="relative h-full overflow-y-auto bg-[#121212] rounded-lg p-3">
            <h3 className="text-lg font-semibold mb-3">Recently Played</h3>
            {recentSongs.map((recentSong, index) => (
                <a key={index} href={recentSong.songUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-md hover:bg-[#1f1f1f] transition">
                    <img src={recentSong.image} alt={`Album cover for ${recentSong.title}`} className="w-12 h-12 rounded-md" />
                    <div>
                        <h4 className="text-sm font-semibold">{recentSong.title}</h4>
                        <p className="text-xs text-[#888]">{recentSong.artist}</p>
                    </div>
                </a>
            ))}
        </div>
    )
}