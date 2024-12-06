/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import { getAccessToken } from "@/lib/getAccessToken";

export default function NowPlaying({ userId }) {
    const [accessToken, setAccessToken] = useState(null);
    const [song, setSong] = useState(null);
    const [progressMs, setProgressMs] = useState(0);
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

        const fetchCurrentlyPlaying = async () => {
            try {
                const res = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
                    method: "GET",
                    headers: { Authorization: `Bearer ${accessToken}` },
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.item) {
                        setSong({
                            title: data.item.name,
                            artist: data.item.artists.map((artist) => artist.name).join(", "),
                            album: data.item.album.name,
                            image: data.item.album.images[0]?.url,
                            progressMs: data.progress_ms,
                            durationMs: data.item.duration_ms,
                            isPlaying: data.is_playing,
                            songUrl: data.item.external_urls.spotify,
                        });
                        setProgressMs(data.progress_ms);
                    } else {
                        setSong(null);
                    }
                } else {
                    console.error("Failed to fetch currently playing song", res.statusText);
                }
            } catch (error) {
                console.error("Error fetching song data:", error);
            }
        };

        const fetchRecentlyPlayed = async () => {
            try {
                const res = await fetch("https://api.spotify.com/v1/me/player/recently-played", {
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

        const interval = setInterval(fetchCurrentlyPlaying, 1000);
        fetchCurrentlyPlaying();
        fetchRecentlyPlayed();

        return () => clearInterval(interval);
    }, [accessToken]);

    const progressPercent = (progressMs / (song?.durationMs || 1)) * 100;

    return (
        <div className="relative h-full bg-[#121212] rounded-lg flex flex-col">
            {song && song.isPlaying ? (
                <div className="relative flex-grow rounded-lg" style={{ backgroundImage: `url(${song.image})`, backgroundSize: "cover", backgroundPosition: "center", minHeight: "300px", }}>
                    <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-md rounded-lg"></div>
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <a href={song.songUrl} target="_blank" rel="noreferrer" className="w-full p-3 text-center">
                            <img src={song.image} alt={`Album cover for ${song.title}`} className="w-32 h-32 mb-4 rounded-lg shadow-md mx-auto" />
                            <h3 className="text-xl md:text-2xl font-semibold mb-2">{song.title}</h3>
                            <p className="text-sm md:text-lg mb-4">{song.artist} - {song.album}</p>
                            <ProgressBar completed={progressPercent} bgColor="#1DB954" height="8px" labelColor="#1DB954" baseBgColor="#121212" transitionDuration="0.5s" />
                        </a>
                    </div>
                </div>
            ) : (
                <div className="relative flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold my-3 mx-3">Recently Played</h3>
                    <div className="flex-grow overflow-y-auto px-3 pb-3 max-h-[260px]">
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
                </div>
            )}
        </div>
    );
}