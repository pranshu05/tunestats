'use client';
import { useSession } from 'next-auth/react';

export default function HomePage() {
    const { data: session, status } = useSession();

    if (status === 'loading') return <p className="text-white text-center">Loading...</p>;

    return (
        <div className="p-4 max-w-7xl mx-auto space-y-4">
            {session ? (
                <>
                    <h1 className="text-4xl font-bold mb-4">Welcome, {session.user?.name}!</h1>
                    <a href={session.user?.id ? `/user/${session.user.id}` : '#'} className="mt-4 border-2 border-white px-6 py-3 text-lg hover:bg-white hover:text-black transition">Go to Profile</a>
                </>
            ) : (
                <>
                    <h1 className="text-4xl font-bold mb-4">Welcome to TuneStats!</h1>
                    <p className="mb-4">Your Spotify analytics for music lovers.</p>
                    <a href="/api/auth/signin" className="mt-4 border-2 border-white px-6 py-3 text-lg hover:bg-white hover:text-black transition">Sign In with Spotify</a>
                </>
            )
            }
        </div>
    );
}