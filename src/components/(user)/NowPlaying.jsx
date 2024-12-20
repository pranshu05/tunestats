/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";

export default function NowPlaying({ userId, onIsPlayingChange }) {
    const [song, setSong] = useState(null);
    const [progressPercent, setProgressPercent] = useState(0);

    useEffect(() => {
        const fetchCurrentlyPlaying = async () => {
            try {
                const res = await fetch(`/api/currently-playing?userId=${userId}`);
                if (res.ok) {
                    const data = await res.json();
                    const isPlaying = data?.is_playing || false;

                    if (data) {
                        setSong({
                            title: data.title,
                            artist: data.artist,
                            album: data.album,
                            image: data.image,
                            progressPercent: data.progressPercent,
                            songUrl: data.songUrl,
                        });
                        setProgressPercent(data.progressPercent);
                    } else {
                        setSong(null);
                    }

                    onIsPlayingChange(isPlaying);
                } else {
                    console.error("Failed to fetch currently playing song");
                    onIsPlayingChange(false);
                }
            } catch (error) {
                console.error("Error fetching currently playing:", error);
                onIsPlayingChange(false);
            }
        };

        const interval = setInterval(fetchCurrentlyPlaying, 1000);
        fetchCurrentlyPlaying();

        return () => clearInterval(interval);
    }, [userId, onIsPlayingChange]);

    if (song) {
        return (
            <div className="relative h-full rounded-lg" style={{ backgroundImage: `url(${song.image})`, backgroundSize: "cover", backgroundPosition: "center", minHeight: "290px" }}>
                <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-lg rounded-lg"></div>
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <a href={song.songUrl} target="_blank" rel="noreferrer" className="w-full p-3 text-center">
                        <img src={song.image} alt={`Album cover for ${song.title}`} className="w-32 h-32 mb-4 rounded-lg shadow-md mx-auto" />
                        <h3 className="text-xl font-semibold mb-2">{song.title}</h3>
                        <p className="text-base mb-4">{song.artist} - {song.album}</p>
                        <ProgressBar completed={progressPercent} bgColor="#1DB954" height="8px" labelColor="#1DB954" baseBgColor="#121212" transitionDuration="0.5s" />
                    </a>
                </div>
            </div>
        );
    }

    return null;
}