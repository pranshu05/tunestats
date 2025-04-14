"use client"
import CommentSection from "@/components/(comments)/CommentSection"
import RatingComponent from "@/components/(ratings)/RatingComponent"
import ArtistCard from "@/components/(artist)/ArtistCard"
import ArtistAlbums from "@/components/(artist)/ArtistAlbums"
import ArtistTracks from "@/components/(artist)/ArtistTracks"

export default function ArtistPage({ params }: { params: { artistId: string } }) {
    return (
        <div className="bg-[#121212] text-white font-sans mx-auto px-4 py-8 space-y-8">
            <ArtistCard artistId={params.artistId} />
            <ArtistAlbums artistId={params.artistId} />
            <ArtistTracks artistId={params.artistId} />
            <RatingComponent entityId={params.artistId} entityType="artist" />
            <CommentSection entityId={params.artistId} entityType="artist" />
        </div>
    )
}