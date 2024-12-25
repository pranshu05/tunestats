/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { formatFollowers } from "@/lib/format";
import Loader from "@/components/(layout)/Loader";

export default function TrackArtistInfo({ userId, artistId }) {
    const [artist, setArtist] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArtist = async () => {
            try {
                const res = await fetch(`/api/getArtist/?artistId=${artistId}&userId=${userId}`);
                if (res.ok) {
                    const data = await res.json();
                    setArtist(data.artist);
                } else {
                    console.error("Failed to fetch artist:", await res.text());
                    setArtist(null);
                }
            } catch (error) {
                console.error("Error fetching artist:", error);
                setArtist(null);
            }
        };

        const checkFollowing = async () => {
            try {
                const res = await fetch(`/api/check-following?artistId=${artistId}&userId=${userId}`);
                if (res.ok) {
                    const data = await res.json();
                    setIsFollowing(data.isFollowing);
                } else {
                    console.error("Failed to check following status:", await res.text());
                }
            } catch (error) {
                console.error("Error checking following status:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchArtist();
        checkFollowing();
    }, [artistId, userId]);

    const handleFollow = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/follow-artist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, artistId }),
            });

            if (res.ok) {
                setIsFollowing(true);
            } else {
                console.error("Failed to follow artist:", await res.text());
            }
        } catch (error) {
            console.error("Error following artist:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUnfollow = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/unfollow-artist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, artistId }),
            });

            if (res.ok) {
                setIsFollowing(false);
            } else {
                console.error("Failed to unfollow artist:", await res.text());
            }
        } catch (error) {
            console.error("Error unfollowing artist:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 rounded-lg bg-zinc-900/50">
            {artist ? (
                <div className="flex flex-col justify-center items-center space-y-4">
                    <h1 className="text-2xl font-bold">Artist Info</h1>
                    <a className="w-36 lg:w-48" href={`/artist/${artist.artistId}`}><img src={artist.artistImageUrl} alt={artist.artistName} className="w-36 lg:w-48 rounded-md" /></a>
                    <div className="flex-col justify-center items-center text-center space-y-1">
                        <h1 className="text-xl font-bold">{artist.artistName}</h1>
                        <p className="text-gray-300">{formatFollowers(artist.artistFollowers)} followers</p>
                        <a href={artist.artistUrl} target="_blank" rel="noopener noreferrer"><p className="w-fit p-2 mx-auto rounded-md bg-zinc-800/50 mt-2">Listen on Spotify</p></a>
                        <button
                            onClick={isFollowing ? handleUnfollow : handleFollow}
                            disabled={loading}
                            className={`mt-4 px-4 py-2 rounded-md ${isFollowing ? 'bg-red-500' : 'bg-green-500'} text-white`}
                        >
                            {loading ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
                        </button>
                    </div>
                </div>
            ) : (
                <Loader />
            )}
        </div>
    );
}