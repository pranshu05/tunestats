/* eslint-disable @next/next/no-img-element */
import { formatDate } from "@/lib/format";

export default function AlbumInfo({ album }) {
    return (
        <div className="p-4 rounded-lg bg-zinc-900/50 space-y-6">
            <div className="flex items-center space-x-4">
                <img src={album.imageUrl || "/placeholder.svg"} alt={album.name} className="w-36 lg:w-48 rounded-md" />
                <div>
                    <p className="text-gray-300 text-lg font-medium">{album.artists.map(artist => artist.name).join(", ")}</p>
                    <h1 className="text-3xl font-bold">{album.name}</h1>
                    <a href={album.spotifyUrl} target="_blank" rel="noopener noreferrer"><p className="w-fit p-2 rounded-md bg-zinc-800/50 mt-2">View on Spotify</p></a>
                </div>
            </div>
            <div className="w-full flex flex-wrap items-center justify-center gap-6 lg:gap-20">
                <div className="flex flex-col items-center space-y-1">
                    <h1 className="text-3xl text-[#1DB954] font-bold">{album.tracks.length}</h1>
                    <p className="text-xl">Tracks</p>
                </div>
                <div className="flex flex-col items-center space-y-1">
                    <h1 className="text-3xl text-[#1DB954] font-bold">{formatDate(album.releaseDate)}</h1>
                    <p className="text-xl">Release Date</p>
                </div>
                <div className="flex flex-col items-center space-y-1">
                    <h1 className="text-3xl text-[#1DB954] font-bold">{album.popularity}%</h1>
                    <p className="text-xl">Popularity</p>
                </div>
                <div className="flex flex-col items-center space-y-1">
                    <h1 className="text-3xl text-[#1DB954] font-bold">{Math.floor(album.totalDuration / 60000)}:{((album.totalDuration % 60000) / 1000).toFixed(0).padStart(2, '0')}</h1>
                    <p className="text-xl">Total Duration</p>
                </div>
            </div>
        </div>
    );
}