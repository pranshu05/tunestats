import { Music } from "lucide-react"

export default function LoadingScreen() {
    return (
        <div className="min-h-screen bg-[#121212] flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
                <Music className="h-16 w-16 text-[#c38e70] mb-4" />
                <p className="text-[#e6d2c0] text-xl">Loading TuneStats...</p>
            </div>
        </div>
    )
}