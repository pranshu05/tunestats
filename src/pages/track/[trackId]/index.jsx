/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Loader from "@/components/(layout)/Loader";
import UserTrackStats from "@/components/(track)/UserTrackStats";
import TrackStats from "@/components/(track)/TrackStats";
import TrackAlbumInfo from "@/components/(track)/TrackAlbumInfo";
import TrackArtistInfo from "@/components/(track)/TrackArtistInfo";

export default function TrackPage({ trackId }) {
    const { data: session } = useSession();
    const [track, setTrack] = useState(null);
    const userId = session?.user?.id || '31wt4zigdg2etodpirwjzyliljzy';

    useEffect(() => {
        const fetchTrack = async () => {
            try {
                const res = await fetch(`/api/getTrack/?trackId=${trackId}&userId=${userId}`);
                if (res.ok) {
                    const data = await res.json();
                    setTrack(data.track);
                } else {
                    console.error("Failed to fetch track");
                }
            } catch (error) {
                console.error("Error fetching track:", error);
            }
        };
        fetchTrack();
    }, [trackId, userId]);

    return (
        <div className="max-w-7xl mx-auto p-4 space-y-4">
            {track ? (
                <>
                    <div className="bg-zinc-900/50 rounded-md p-4">
                        <div className="flex items-center space-x-4">
                            <img src={track.trackAlbumImageUrl} alt={track.trackName} className="w-36 lg:w-48 rounded-md" />
                            <div className="flex-col space-y-1">
                                <p className="text-gray-300 text-lg font-medium">{track.trackArtists}</p>
                                <h1 className="text-xl font-bold">{track.trackName}</h1>
                                <a href={track.trackUrl} target="_blank" rel="noopener noreferrer"><p className="w-fit p-2 rounded-md bg-zinc-800/50 mt-2">Listen on Spotify</p></a>
                            </div>
                        </div>
                    </div>
                    {session?.user?.id && <UserTrackStats trackId={trackId} userId={userId} />}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <TrackStats track={track} />
                        <TrackAlbumInfo userId={userId} albumId={track.trackAlbumId} />
                        <TrackArtistInfo userId={userId} artistId={track.trackArtistId} />
                    </div>
                </>
            ) : (
                <Loader />
            )}
        </div>
    );
}

export async function getServerSideProps(context) {
    const { trackId } = context.params;
    if (!trackId) {
        return { notFound: true };
    }
    return { props: { trackId } };
}