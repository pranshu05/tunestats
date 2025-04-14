"use client"
import Link from "next/link"
import AuthButton from "@/components/(layout)/AuthButton"
import { Music } from "lucide-react"

export default function Navbar() {
    return (
        <nav className="py-4 px-6 border-b border-[#3d2e23] bg-[#121212] flex justify-between items-center sticky top-0 z-50 shadow-md">
            <Link href="/" className="text-2xl font-bold text-[#e6d2c0] flex items-center gap-2">
                <Music className="text-[#c38e70]" />
                <span>TuneStats</span>
            </Link>
            <AuthButton />
        </nav>
    )
}