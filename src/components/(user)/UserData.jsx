/* eslint-disable @next/next/no-img-element */
import { signOut } from "next-auth/react";

export default function UserData({ session, user, userId }) {
    return (
        <div className="flex flex-col items-center w-full p-3 bg-[#121212] rounded-lg">
            <img src={user.image === 'unknown' ? 'https://github.com/user-attachments/assets/bf57cb96-b259-4290-b35b-0ede9d618802' : user.image} alt={user.name} className="w-32 h-32 lg:w-52 lg:h-52 rounded-full mb-4 object-cover" />
            <h1 className="text-2xl lg:text-3xl font-bold mb-4">{user.name}</h1>
            <div className="w-full flex justify-center gap-2 text-sm">
                <a href={`https://open.spotify.com/user/${userId}`} target="_blank" rel="noreferrer" className="px-4 py-2 bg-[#1DB954] rounded-md">Spotify</a>
                {session?.user?.id === userId && (<button onClick={() => signOut()} className="px-4 py-2 bg-[#121212] border-[2px] border-[#333] rounded-md">Sign Out</button>)}
            </div>
        </div>
    )
}