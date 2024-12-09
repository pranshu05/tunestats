import { useSession, signIn, signOut } from "next-auth/react";
import Link from 'next/link';
import { SpotifyPlayer } from "@/components/SpotifyPlayer";

export default function Home() {
    const { data: session } = useSession();

    if (!session) {
        return (
            <div className="flex items-center justify-center h-screen">
                <button className="bg-green-500 text-white font-semibold px-3 py-2 rounded-lg" onClick={() => signIn("spotify")}>Sign in with Spotify</button>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center h-screen flex-col">
            <p>Signed in as <a className="text-green-500">{session.user.email}</a></p>
            {session.user.image && <img src={session.user.image} alt={session.user.name} className="rounded-full w-24 h-24 mt-4" />}
            <button className="mt-5 bg-red-600 px-3 py-2 rounded-lg font-semibold" onClick={() => signOut()}>Sign out</button>
            <div className="mt-5">
                <h2>Go to your user page:</h2>
                <Link legacyBehavior href={`/user/${session.user.id}`}>
                    <a className="">Go to User Page</a>
                </Link>
            </div>
            {/* <SpotifyPlayer accessToken={session.accessToken} /> */}
        </div>
    );
}