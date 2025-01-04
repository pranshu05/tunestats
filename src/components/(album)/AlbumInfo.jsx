/* eslint-disable @next/next/no-img-element */
import { formatDate } from "@/lib/format";

export default function AlbumInfo({ album }) {
    return (
        <div className="space-y-4">
            <div className="p-4 rounded-lg bg-zinc-900/50 space-y-6">
                <div className="flex items-center space-x-4">
                    <img src={album.albumImageUrl || "/placeholder.svg"} alt={album.albumName} className="w-36 lg:w-48 rounded-md" />
                    <div>
                        <p className="text-gray-300 text-lg font-medium">{album.albumArtists.map(artist => artist.name).join(", ")}</p>
                        <h1 className="text-3xl font-bold">{album.albumName}</h1>
                        <a href={album.albumSpotifyUrl} target="_blank" rel="noopener noreferrer"><p className="w-fit p-2 rounded-md bg-zinc-800/50 mt-2">View on Spotify</p></a>
                    </div>
                </div>
            </div>
            <div className="p-4 rounded-lg bg-zinc-900/50 space-y-6">
                <div className="w-full flex flex-wrap items-center justify-center gap-6 lg:gap-20">
                    <div className="flex flex-col items-center space-y-1">
                        <h1 className="text-3xl text-[#1DB954] font-bold">{album.albumTracks.length}</h1>
                        <p className="text-xl">Tracks</p>
                    </div>
                    <div className="flex flex-col items-center space-y-1">
                        <h1 className="text-3xl text-[#1DB954] font-bold">{formatDate(album.albumReleaseDate)}</h1>
                        <p className="text-xl">Release Date</p>
                    </div>
                    <div className="flex flex-col items-center space-y-1">
                        <h1 className="text-3xl text-[#1DB954] font-bold">{album.albumPopularity}%</h1>
                        <p className="text-xl">Popularity</p>
                    </div>
                    <div className="flex flex-col items-center space-y-1">
                        <h1 className="text-3xl text-[#1DB954] font-bold">{Math.floor(album.albumTotalDuration / 60000)}:{((album.albumTotalDuration % 60000) / 1000).toFixed(0).padStart(2, '0')}</h1>
                        <p className="text-xl">Total Duration</p>
                    </div>
                </div>
            </div>
        </div>
    );
}