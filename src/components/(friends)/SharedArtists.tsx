import { Users } from "lucide-react"

interface Artist {
    artistId: string
    name: string
}

interface SharedArtistsProps {
    artists: Artist[]
}

export default function SharedArtists({ artists }: SharedArtistsProps) {
    if (artists.length === 0) {
        return (
            <div className="rounded-lg bg-[#1e1814] border border-[#3d2e23] p-3 lg:p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                    <Users className="text-[#c38e70]" />
                    <h3 className="text-xl font-bold text-[#e6d2c0]">Shared Artists</h3>
                </div>
                <div className="text-center py-8 bg-[#2a211c] rounded-lg">
                    <Users className="w-12 h-12 mx-auto mb-3 text-[#a18072] opacity-50" />
                    <p className="text-[#a18072]">No shared artists in the past week</p>
                </div>
            </div>
        )
    }

    return (
        <div className="rounded-lg bg-[#1e1814] border border-[#3d2e23] p-3 lg:p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
                <Users className="text-[#c38e70]" />
                <h3 className="text-xl font-bold text-[#e6d2c0]">Top Shared Artists</h3>
            </div>
            <ul className="space-y-3">
                {artists.map((artist) => (
                    <a href={`/artist/${artist.artistId}`} key={artist.artistId} className="flex items-center p-3 bg-[#2a211c] hover:bg-[#342820] transition-colors rounded-lg">
                        <div className="w-10 h-10 bg-[#3d2e23] rounded-full flex items-center justify-center mr-3 flex-shrink-0"><span className="text-[#c38e70] font-bold">{artist.name.charAt(0).toUpperCase()}</span></div>
                        <div><p className="font-medium text-[#e6d2c0]">{artist.name}</p></div>
                    </a>
                ))}
            </ul>
        </div>
    )
}