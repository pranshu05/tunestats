import { Music } from "lucide-react"

export default function Footer() {
    return (
        <footer className="bg-[#121212] border-t border-[#3d2e23]">
            <div className="px-4 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Music className="text-[#c38e70]" />
                            <span className="text-xl font-bold text-[#e6d2c0]">TuneStats</span>
                        </div>
                        <p className="text-[#a18072]">Your Spotify experience, elevated. Discover your music DNA and connect with friends.</p>
                    </div>
                </div>
                <div className="border-t border-[#3d2e23] mt-8 pt-8 text-center text-[#a18072] text-sm">
                    <p>© {new Date().getFullYear()} TuneStats. All rights reserved. Not affiliated with Spotify.</p>
                </div>
            </div>
        </footer>
    )
}