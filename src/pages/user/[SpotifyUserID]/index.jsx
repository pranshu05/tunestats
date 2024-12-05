import { getSession } from "next-auth/react";

export default function UserPage({ spotifyUserId }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <h1 className="text-4xl font-bold mb-4">Spotify Stats for {spotifyUserId}</h1>
            <p>More features coming soon...</p>
        </div>
    );
}

export async function getServerSideProps(context) {
    const session = await getSession(context);
    const { SpotifyUserID } = context.params;

    if (!session) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    return {
        props: {
            spotifyUserId: SpotifyUserID,
        },
    };
}