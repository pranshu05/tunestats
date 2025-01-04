import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Loader from "@/components/(layout)/Loader";
import AlbumInfo from "@/components/(album)/AlbumInfo";
import AlbumTracks from "@/components/(album)/AlbumTracks";

export default function AlbumPage({ albumId }) {
    const { data: session } = useSession();
    const userId = session?.user?.id || "31wt4zigdg2etodpirwjzyliljzy";
    const [album, setAlbum] = useState(null);

    useEffect(() => {
        const fetchAlbum = async () => {
            try {
                const res = await fetch(`/api/getAlbum/?albumId=${albumId}&userId=${userId}`);
                if (res.ok) {
                    const data = await res.json();
                    setAlbum(data.album);
                } else {
                    console.error("Failed to fetch album");
                }
            } catch (error) {
                console.error("Error fetching album:", error);
            }
        };

        fetchAlbum();
    }, [albumId, userId]);

    return (
        <div className="max-w-7xl mx-auto p-4 space-y-4">
            {album ? (
                <>
                    <AlbumInfo album={album} />
                    <AlbumTracks tracks={album.albumTracks} userId={userId} />
                </>
            ) : (
                <Loader />
            )}
        </div>
    );
}

export async function getServerSideProps(context) {
    const { albumId } = context.params;

    if (!albumId) {
        return { notFound: true };
    }

    return { props: { albumId } };
}