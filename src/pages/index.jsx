import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
    const { data: session } = useSession();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            {!session ? (
                <>
                    <h1 className="text-xl lg:text-4xl font-bold mb-4">Welcome to TuneStats</h1>
                    <button onClick={() => signIn("spotify")} className="px-4 py-2 bg-[#1DB954] rounded-md">Login with Spotify</button>
                </>
            ) : (
                <>
                    <h1 className="text-xl lg:text-4xl font-bold mb-4">Welcome, {session.user.name}!</h1>
                    <a href={`/user/${session.user.id}`} className="mb-4">Go to your profile.</a>
                    <button onClick={() => signOut()} className="px-2 py-1 lg:px-4 lg:py-2 bg-[#121212] border-[2px] border-[#333] rounded-md">Sign Out</button>
                </>
            )}
        </div>
    );
}