/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import Loader from "../(layout)/Loader";
import ReactPaginate from "react-paginate";
import { ChevronLeft, ChevronRight, Ellipsis } from "lucide-react";

export default function RecentSongs({ userId }) {
    const [recentSongs, setRecentSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);

    const songsPerPage = 15; 
    const pageCount = Math.ceil(recentSongs.length / songsPerPage);

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

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const displaySongs = recentSongs.slice(
        currentPage * songsPerPage,
        (currentPage + 1) * songsPerPage
    );

    return (
        <div className="bg-zinc-900/50 rounded-md p-4 shadow-lg">
            <h3 className="text-xl font-bold mb-4">Recently Played</h3>
            {loading ? (
                <Loader />
            ) : (
                <div>
                    <div className="space-y-2">
                        {displaySongs.map((recentSong, index) => (
                            <a key={index}href={`/track/${recentSong.id}`}className="flex items-center gap-4 p-2 rounded-lg hover:bg-zinc-800/50 transition-colors">
                                <img src={recentSong.image}alt={`Album cover for ${recentSong.title}`}className="w-12 h-12 rounded-md object-cover"/>
                                <div className="flex-grow min-w-0">
                                    <h4 className="text-sm font-semibold truncate">{recentSong.title}</h4>
                                    <p className="text-xs text-gray-400 truncate">{recentSong.artist}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                    <ReactPaginate
                        previousLabel={<ChevronLeft size={20} />}
                        nextLabel={<ChevronRight size={20} />}
                        breakLabel={<Ellipsis size={20} />}
                        pageCount={pageCount}
                        marginPagesDisplayed={3}
                        pageRangeDisplayed={3}
                        onPageChange={handlePageClick}
                        containerClassName={"pagination flex items-center justify-center mt-4 gap-4"}
                        previousClassName={"p-2 bg-zinc-800 rounded-md"}
                        nextClassName={"p-2 bg-zinc-800 rounded-md"}
                        activeClassName={"py-1 px-2 bg-zinc-800 rounded-md text-white aspact-sqaure"}
                        disabledClassName={"p-2 text-gray-500"}
                    />
                </div>
            )}
        </div>
    );
}