/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { getAccessToken } from "@/lib/getAccessToken";

export default function RecentSongs({ userId }) {
    const [accessToken, setAccessToken] = useState(null);
    const [recentSongs, setRecentSongs] = useState([]);

    useEffect(() => {
        const fetchAccessToken = async () => {
            try {
                const token = await getAccessToken(userId);
                setAccessToken(token);
            } catch (error) {
                console.error("Error fetching access token:", error);
            }
        };

        if (userId) {
            fetchAccessToken();
        }
    }, [userId]);

    useEffect(() => {
        if (!accessToken) return;

        const fetchRecentlyPlayed = async () => {
            try {
                const res = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=50", {
                    method: "GET",
                    headers: { Authorization: `Bearer ${accessToken}` },
                });

                if (res.ok) {
                    const data = await res.json();
                    setRecentSongs(
                        data.items.map((item) => ({
                            title: item.track.name,
                            artist: item.track.artists.map((artist) => artist.name).join(", "),
                            album: item.track.album.name,
                            image: item.track.album.images[0]?.url,
                            songUrl: item.track.external_urls.spotify,
                        }))
                    );
                } else {
                    console.error("Failed to fetch recently played songs", res.statusText);
                }
            } catch (error) {
                console.error("Error fetching recently played songs:", error);
            }
        };

        fetchRecentlyPlayed();
    }, [accessToken]);

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