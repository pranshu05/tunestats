import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
    const { data: session } = useSession();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            {!session ? (
                <>
                    <h1 className="text-4xl font-bold mb-4">Welcome to Protify</h1>
                    <button
                        onClick={() => signIn("spotify")}
                        className="px-4 py-2 bg-green-500 rounded hover:bg-green-600 transition"
                    >
                        Login with Spotify
                    </button>
                </>
            ) : (
                <>
                    <h1 className="text-4xl font-bold mb-4">Welcome, {session.user.name}!</h1>
                    <p className="mb-4">You are logged in as {session.user.email}.</p>
                    <button
                        onClick={() => signOut()}
                        className="px-4 py-2 bg-red-500 rounded hover:bg-red-600 transition"
                    >
                        Sign Out
                    </button>
                </>
            )}
        </div>
    );
}