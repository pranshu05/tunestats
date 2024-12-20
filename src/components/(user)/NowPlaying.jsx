/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import ColorThief from "colorthief";

export default function NowPlaying({ userId, onIsPlayingChange }) {
    const [song, setSong] = useState(null);
    const [progressPercent, setProgressPercent] = useState(0);
    const [gradientColors, setGradientColors] = useState(["#121212", "#1DB954"]);

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

                        const img = new Image();
                        img.crossOrigin = "Anonymous";
                        img.src = data.image;
                        img.onload = () => {
                            const colorThief = new ColorThief();
                            const colors = colorThief.getPalette(img, 2);
                            if (colors) {
                                const [color1, color2] = colors.map(
                                    (rgb) => `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
                                );
                                setGradientColors([color1, color2]);
                            }
                        };
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
            <div className="relative h-full rounded-lg"style={{backgroundImage: `linear-gradient(135deg, ${gradientColors[0]}, ${gradientColors[1]})`,minHeight: "290px",}}>
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <a href={song.songUrl} target="_blank" rel="noreferrer" className="w-full p-3 text-center">
                        <img src={song.image} alt={`Album cover for ${song.title}`} className="w-32 h-32 mb-4 rounded-lg shadow-lg mx-auto" />
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