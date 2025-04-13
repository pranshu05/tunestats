'use client';
import TrackCard from '@/components/(track)/TrackCard';
import TrackAlbum from '@/components/(track)/TrackAlbum';
import TrackArtist from '@/components/(track)/TrackArtist';
import CommentSection from '@/components/(comments)/CommentSection';
import RatingComponent from '@/components/(ratings)/RatingComponent';

export default function TrackPage({ params }: { params: { trackId: string } }) {
    return (
        <div className="px-4 py-8 space-y-10">
            <TrackCard trackId={params.trackId} />
            <RatingComponent entityId={params.trackId} entityType="track" />
            <TrackAlbum trackId={params.trackId} />
            <TrackArtist trackId={params.trackId} />
            <CommentSection entityId={params.trackId} entityType="track" />
        </div>
    );
}