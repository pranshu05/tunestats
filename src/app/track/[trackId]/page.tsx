"use client"
import TrackCard from "@/components/(track)/TrackCard"
import TrackAlbum from "@/components/(track)/TrackAlbum"
import TrackArtist from "@/components/(track)/TrackArtist"
import CommentSection from "@/components/(comments)/CommentSection"
import RatingComponent from "@/components/(ratings)/RatingComponent"
import TopListeners from "@/components/(layout)/TopListeners"

export default function TrackPage({ params }: { params: { trackId: string } }) {
    return (
        <div className="bg-[#121212] text-white font-sans mx-auto px-4 py-8 space-y-8">
            <TrackCard trackId={params.trackId} />
            <TrackAlbum trackId={params.trackId} />
            <TrackArtist trackId={params.trackId} />
            <RatingComponent entityId={params.trackId} entityType="track" />
            <TopListeners entityId={params.trackId} entityType="track" />
            <CommentSection entityId={params.trackId} entityType="track" />
        </div>
    )
}