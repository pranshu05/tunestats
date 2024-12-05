/* eslint-disable @next/next/no-img-element */
import { signOut } from "next-auth/react";

export default function UserData({ session, user, userId }) {
    console.log(user)
    return (
        <div className="flex flex-col items-center h-full w-full p-4 bg-[#121212] rounded-lg">
            <img src={user.image === 'unknown' ? 'https://github.com/user-attachments/assets/bf57cb96-b259-4290-b35b-0ede9d618802' : user.image} alt={user.name} className="w-32 h-32 lg:w-48 lg:h-48 rounded-full mb-4" />
            <h1 className="text-2xl lg:text-4xl font-bold mb-4">{user.name}</h1>
            {session?.user?.id === userId && (<button onClick={() => signOut()} className="px-4 py-2 bg-[#121212] border-[2px] border-[#333] rounded-md">Sign Out</button>)}
        </div>
    )
}