import { BiMusic } from "react-icons/bi"

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
            <div>
                <h3 className="text-xl font-semibold mb-4">Shared Tracks</h3>
                <div className="text-center py-8 text-gray-300">
                    <BiMusic className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No shared tracks in the past week</p>
                </div>
            </div>
        )
    }

    return (
        <div>
            <h3 className="text-xl font-semibold mb-4">Top Shared Tracks</h3>
            <ul className="space-y-3">
                {tracks.map((track) => (
                    <a href={`/track/${track.trackId}`} key={track.trackId} className="flex items-center p-3 bg-black border border-white rounded-lg">
                        <div className="w-10 h-10 bg-black border border-white rounded-full flex items-center justify-center mr-3">
                            <BiMusic className="w-5 h-5 text-purple-800" />
                        </div>
                        <div>
                            <p className="font-medium">{track.name}</p>
                            <p className="text-sm text-gray-300">{track.artistName}</p>
                        </div>
                    </a>
                ))}
            </ul>
        </div>
    )
}