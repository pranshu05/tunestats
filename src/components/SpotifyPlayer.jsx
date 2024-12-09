import { useEffect, useState } from "react";
import getNowPlayingItem from "@/utils/getNowPlayingItem";
import ProgressBar from "@ramonak/react-progress-bar";

export function SpotifyPlayer({ accessToken }) {
    const [result, setResult] = useState({});

    useEffect(() => {
        const fetchNowPlaying = async () => {
            const nowPlaying = await getNowPlayingItem(accessToken);
            setResult(nowPlaying);
        };

        fetchNowPlaying();
        const interval = setInterval(fetchNowPlaying, 500);

        return () => clearInterval(interval);
    }, [accessToken]);

    const formatTime = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return result.isPlaying ? (
        <div className="spotify-card bg-gray-950 text-white p-4 rounded-lg shadow-lg w-80 mt-10">
            <a href={result.songUrl} target="_blank" rel="noreferrer">
                <div className="song-img mb-4">
                    <img src={result.albumImageUrl} alt={`Album cover for ${result.title}`} className="rounded-lg w-full" />
                </div>
                <div className="song-info">
                    <div className="song-title text-lg font-bold text-white">{result.title}</div>
                    <div className="song-artist text-sm text-white mb-5">by {result.artist}</div>
                    <ProgressBar classname="mt-4" completed={result.progressMs} maxCompleted={result.durationMs} bgColor="#1DB954" height="8px" labelColor="#1DB954" baseBgColor="#333" margin-top="5px" transitionDuration="0s" />
                    <div className="time-info text-sm text-gray-400 mt-2">
                        {formatTime(result.progressMs)} / {formatTime(result.durationMs)}
                    </div>
                </div>
            </a>
        </div>
    ) : (
        <div className="spotify-card bg-gray-800 text-white p-4 rounded-lg shadow-lg w-80 mt-10">
            <div className="song-info">
                <div className="song-title text-md font-semibold">Not listening to Spotify right now!</div>
            </div>
        </div>
    );
}