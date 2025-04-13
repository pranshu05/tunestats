'use client';
import UserCard from '@/components/(user)/UserCard';
import TopTracks from '@/components/(user)/TopTracks';
import TopArtists from '@/components/(user)/TopArtists';
import TrackHistory from '@/components/(user)/TrackHistory';
import CommentSection from '@/components/(comments)/CommentSection';

export default function UserPage({ params }: { params: { userId: string } }) {
    return (
        <div className="px-4 py-8 space-y-10">
            <UserCard userId={params.userId} />
            <TopTracks userId={params.userId} />
            <TopArtists userId={params.userId} />
            <TrackHistory userId={params.userId} />
            <CommentSection entityId={params.userId} entityType="user" />
        </div>
    );
}