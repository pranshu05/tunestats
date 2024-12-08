import { useSession, signIn, signOut } from "next-auth/react";
import Link from 'next/link';

export default function Home() {
    const { data: session } = useSession();

    if (!session) {
        return (
            <div>
                <button onClick={() => signIn("spotify")}>Sign in with Spotify</button>
            </div>
        );
    }

    return (
        <div>
            <p>Signed in as {session.user.email}</p>
            {/* <p>Access Token: {session.accessToken}</p> */}
            <button onClick={() => signOut()}>Sign out</button>
            {/* <button onClick={() => signIn("spotify")}>Sign in with a different account</button> */}
            <div>
                <h2>Go to your user page:</h2>
                <Link legacyBehavior href={`/user/${session.user.id}`}>
                    <a>Go to User Page</a>
                </Link>
            </div>
        </div>
    );
}