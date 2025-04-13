'use client';
import useSWR from 'swr';
import { fetcher } from '@/utils/fetcher';
import FetchError from '../(layout)/FetchError';
import FetchLoader from '../(layout)/FetchLoader';
import AddFriendButton from './AddFriendButton';

type User = {
    userId: string;
    name: string;
    accountType: string;
}

export default function UserCard({ userId }: { userId: string }) {
    const { data: user, error } = useSWR<User>(`/api/user/${userId}`, fetcher);

    if (error) return <FetchError />;
    if (!user) return <FetchLoader />;

    return (
        <div className="p-6 flex items-center gap-6 border border-white">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <a href={`https://open.spotify.com/user/${user.userId}`} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">View on Spotify</a>
            <AddFriendButton targetUserId={user.userId} />
        </div>
    );
}