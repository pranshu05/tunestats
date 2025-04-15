"use client"
import AlbumCard from "@/components/(album)/AlbumCard"
import AlbumTracks from "@/components/(album)/AlbumTracks"
import AlbumArtist from "@/components/(album)/AlbumArtist"
import RatingComponent from "@/components/(ratings)/RatingComponent"
import CommentSection from "@/components/(comments)/CommentSection"
import TopListeners from "@/components/(layout)/TopListeners"

export default function AlbumPage({ params }: { params: { albumId: string } }) {
    return (
        <div className="bg-[#121212] text-white font-sans mx-auto px-4 py-8 space-y-8">
            <AlbumCard albumId={params.albumId} />
            <AlbumTracks albumId={params.albumId} />
            <AlbumArtist albumId={params.albumId} />
            <RatingComponent entityId={params.albumId} entityType="album" />
            <TopListeners entityId={params.albumId} entityType="album" />
            <CommentSection entityId={params.albumId} entityType="album" />
        </div>
    )
}