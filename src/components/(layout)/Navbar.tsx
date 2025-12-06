"use client"
import Link from "next/link"
import { useSession } from "next-auth/react"
import AuthButton from "@/components/(layout)/AuthButton"
import { Music, Menu, X, Home, TrendingUp, Users } from "lucide-react"
import { useState } from "react"

export default function Navbar() {
    const { data: session } = useSession()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    return (
        <nav className="py-4 px-4 lg:px-6 border-b border-[#3d2e23] bg-[#121212] sticky top-0 z-50 shadow-md">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl lg:text-2xl font-bold text-[#e6d2c0] flex items-center gap-2 hover:text-[#c38e70] transition-colors" aria-label="TuneStats home"><Music className="text-[#c38e70]" aria-hidden="true" /><span>TuneStats</span></Link>
                {session?.user?.id && (
                    <div className="hidden md:flex items-center gap-4">
                        <Link href={`/user/${session.user.id}`} className="text-[#e6d2c0] hover:text-[#c38e70] transition-colors flex items-center gap-2"><Home size={18} /><span>My Profile</span></Link>
                        <Link href="/global/charts" className="text-[#e6d2c0] hover:text-[#c38e70] transition-colors flex items-center gap-2"><TrendingUp size={18} /><span>Charts</span></Link>
                        <Link href="/friends/music-match" className="text-[#e6d2c0] hover:text-[#c38e70] transition-colors flex items-center gap-2"><Users size={18} /><span>Friends</span></Link>
                    </div>
                )}
                <div className="flex items-center gap-4">
                    <AuthButton />
                    {session?.user?.id && (
                        <button onClick={toggleMobileMenu} className="md:hidden p-2 text-[#e6d2c0] hover:text-[#c38e70] transition-colors" aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"} aria-expanded={isMobileMenuOpen}>{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
                    )}
                </div>
            </div>
            {session?.user?.id && isMobileMenuOpen && (
                <div className="md:hidden mt-4 pt-4 border-t border-[#3d2e23]">
                    <div className="flex flex-col gap-3">
                        <Link href={`/user/${session.user.id}`} className="text-[#e6d2c0] hover:text-[#c38e70] transition-colors flex items-center gap-2 p-2 rounded hover:bg-[#1e1814]" onClick={() => setIsMobileMenuOpen(false)}><Home size={18} /><span>My Profile</span></Link>
                        <Link href="/global/charts" className="text-[#e6d2c0] hover:text-[#c38e70] transition-colors flex items-center gap-2 p-2 rounded hover:bg-[#1e1814]" onClick={() => setIsMobileMenuOpen(false)}><TrendingUp size={18} /><span>Charts</span></Link>
                        <Link href="/friends/music-match" className="text-[#e6d2c0] hover:text-[#c38e70] transition-colors flex items-center gap-2 p-2 rounded hover:bg-[#1e1814]" onClick={() => setIsMobileMenuOpen(false)}><Users size={18} /><span>Friends</span></Link>
                    </div>
                </div>
            )}
        </nav>
    )
}