/* eslint-disable @next/next/no-img-element */
import CommentSection from "@/components/(comments)/CommentSection";
import RatingComponent from "@/components/(ratings)/RatingComponent";
import ArtistCard from "@/components/(artist)/ArtistCard";
import ArtistAlbums from "@/components/(artist)/ArtistAlbums";
import ArtistTracks from "@/components/(artist)/ArtistTracks";

export default async function ArtistPage({ params }: { params: { artistId: string } }) {
    return (
        <div className="px-4 py-8 space-y-10">
            <ArtistCard artistId={params.artistId} />
            <RatingComponent entityId={params.artistId} entityType="artist" />
            <ArtistAlbums artistId={params.artistId} />
            <ArtistTracks artistId={params.artistId} />
            <CommentSection entityId={params.artistId} entityType="artist" />
        </div>
    );
}