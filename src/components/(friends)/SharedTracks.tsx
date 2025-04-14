/* eslint-disable @next/next/no-img-element */
import { Music } from "lucide-react"

interface Track {
    trackId: string
    name: string
    artistName: string
}

interface SharedTracksProps {
    tracks: Track[]
}

export default function SharedTracks({ tracks }: SharedTracksProps) {
    if (tracks.length === 0) {
        return (
            <div className="rounded-lg bg-[#1e1814] border border-[#3d2e23] p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                    <Music className="text-[#c38e70]" />
                    <h3 className="text-xl font-bold text-[#e6d2c0]">Shared Tracks</h3>
                </div>
                <div className="text-center py-8 bg-[#2a211c] rounded-lg">
                    <Music className="w-12 h-12 mx-auto mb-3 text-[#a18072] opacity-50" />
                    <p className="text-[#a18072]">No shared tracks in the past week</p>
                </div>
            </div>
        )
    }

    return (
        <div className="rounded-lg bg-[#1e1814] border border-[#3d2e23] p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
                <Music className="text-[#c38e70]" />
                <h3 className="text-xl font-bold text-[#e6d2c0]">Top Shared Tracks</h3>
            </div>
            <ul className="space-y-3">
                {tracks.map((track) => (
                    <a href={`/track/${track.trackId}`} key={track.trackId} className="flex items-center p-3 bg-[#2a211c] hover:bg-[#342820] transition-colors rounded-lg">
                        <div className="w-10 h-10 bg-[#3d2e23] rounded-full flex items-center justify-center mr-3 flex-shrink-0"><Music className="w-5 h-5 text-[#c38e70]" /></div>
                        <div>
                            <p className="font-medium text-[#e6d2c0]">{track.name}</p>
                            <p className="text-sm text-[#a18072]">{track.artistName}</p>
                        </div>
                    </a>
                ))}
            </ul>
        </div>
    )
}