"use client"
import { signIn, signOut, useSession } from "next-auth/react"
import { LogIn, LogOut, Loader2 } from "lucide-react"

export default function AuthButton() {
    const { data: session, status } = useSession()

    if (status === "loading") {
        return (
            <div className="px-4 py-2 bg-[#2a211c] text-[#a18072] rounded-full inline-flex items-center gap-2">
                <Loader2 className="animate-spin" size={16} />
                <span className="hidden sm:inline">Loading...</span>
            </div>
        );
    }

    return session ? (
        <button onClick={() => signOut({ callbackUrl: '/' })} className="px-4 py-2 bg-[#2a211c] text-[#e6d2c0] rounded-full hover:bg-[#3d2e23] transition-colors inline-flex items-center gap-2" aria-label="Logout"><LogOut size={16} /><span className="hidden sm:inline">Logout</span></button>
    ) : (
        <button onClick={() => signIn("spotify")} className="px-4 py-2 bg-[#1DB954] text-black font-medium rounded-full hover:bg-opacity-90 transition-colors inline-flex items-center gap-2" aria-label="Login with Spotify"><LogIn size={16} /><span>Login</span></button>
    )
}