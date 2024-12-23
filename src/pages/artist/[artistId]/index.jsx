import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Loader from "@/components/(layout)/Loader";
import ArtistInfo from "@/components/(artist)/ArtistInfo";
import ArtistAlbums from "@/components/(artist)/ArtistAlbums";
import ArtistTopTracks from "@/components/(artist)/ArtistTopTracks";

export default function ArtistPage({ artistId }) {
    const { data: session } = useSession();
    const userId = session?.user?.id || "31wt4zigdg2etodpirwjzyliljzy";

    const [artist, setArtist] = useState(null);

    useEffect(() => {
        const fetchArtist = async () => {
            try {
                const res = await fetch(`/api/getArtist/?artistId=${artistId}&userId=${userId}`);
                if (res.ok) {
                    const data = await res.json();
                    setArtist(data.artist);
                } else {
                    console.error("Failed to fetch artist");
                }
            } catch (error) {
                console.error("Error fetching artist:", error);
            }
        };

        fetchArtist();
    }, [artistId, userId]);

    return (
        <div className="max-w-7xl mx-auto p-4 space-y-4">
            {artist ? (
                <>
                    <ArtistInfo artist={artist} />
                    <ArtistTopTracks userId={userId} artistId={artistId} />
                    <ArtistAlbums userId={userId} artistId={artistId} />
                </>
            ) : (
                <Loader />
            )}
        </div>
    );
}

export async function getServerSideProps(context) {
    const { artistId } = context.params;

    if (!artistId) {
        return { notFound: true };
    }

    return { props: { artistId } };
}