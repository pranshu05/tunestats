import { FaUsers } from "react-icons/fa"

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
            <div>
                <h3 className="text-xl font-semibold mb-4">Shared Artists</h3>
                <div className="text-center py-8 text-gray-300">
                    <FaUsers className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No shared artists in the past week</p>
                </div>
            </div>
        )
    }

    return (
        <div>
            <h3 className="text-xl font-semibold mb-4">Top Shared Artists</h3>
            <ul className="space-y-3">
                {artists.map((artist) => (
                    <a href={`/artist/${artist.artistId}`} key={artist.artistId} className="flex items-center p-3 bg-black border border-white rounded-lg">
                        <div className="w-10 h-10 bg-black border border-white rounded-full flex items-center justify-center mr-3">
                            <span className="text-indigo-800 font-bold">{artist.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                            <p className="font-medium">{artist.name}</p>
                        </div>
                    </a>
                ))}
            </ul>
        </div>
    )
}