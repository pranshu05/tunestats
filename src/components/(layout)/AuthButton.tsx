'use client';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function AuthButton() {
    const { data: session } = useSession();

    return session ? (
        <button onClick={() => signOut()} className="px-4 py-2 border border-white">Logout</button>
    ) : (
        <button onClick={() => signIn('spotify')} className="px-4 py-2 border border-white">Login with Spotify</button>
    );
}