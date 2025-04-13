import AlbumCard from "@/components/(album)/AlbumCard";
import AlbumTracks from "@/components/(album)/AlbumTracks";
import AlbumArtist from "@/components/(album)/AlbumArtist";
import RatingComponent from "@/components/(ratings)/RatingComponent";
import CommentSection from "@/components/(comments)/CommentSection";

export default function AlbumPage({ params }: { params: { albumId: string } }) {
    return (
        <div className="px-4 py-8 space-y-10">
            <AlbumCard albumId={params.albumId} />
            <RatingComponent entityId={params.albumId} entityType="album" />
            <AlbumTracks albumId={params.albumId} />
            <AlbumArtist albumId={params.albumId} />
            <CommentSection entityId={params.albumId} entityType="album" />
        </div>
    );
}