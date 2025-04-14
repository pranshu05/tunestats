"use client"
import { signIn, signOut, useSession } from "next-auth/react"
import { LogIn, LogOut } from "lucide-react"

export default function AuthButton() {
    const { data: session } = useSession()

    return session ? (
        <button
            onClick={() => signOut()}
            className="px-4 py-2 bg-[#2a211c] text-[#e6d2c0] rounded-full hover:bg-[#3d2e23] transition-colors inline-flex items-center gap-2"
        >
            <LogOut size={16} />
            Logout
        </button>
    ) : (
        <button
            onClick={() => signIn("spotify")}
            className="px-4 py-2 bg-[#1DB954] text-black font-medium rounded-full hover:bg-opacity-90 transition-colors inline-flex items-center gap-2"
        >
            <LogIn size={16} />
            Login with Spotify
        </button>
    )
}