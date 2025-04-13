import { FaUsers } from "react-icons/fa"
import { BiMusic } from "react-icons/bi"

interface Stats {
    sharedTracks: number
    totalUniqueTracks: number
    sharedArtists: number
    totalUniqueArtists: number
}

interface StatsSummaryProps {
    stats: Stats
}

export default function StatsSummary({ stats }: StatsSummaryProps) {
    const calculatePercentage = (shared: number, total: number) => {
        if (total === 0) return 0
        return Math.round((shared / total) * 100)
    }

    const trackPercentage = calculatePercentage(stats.sharedTracks, stats.totalUniqueTracks)
    const artistPercentage = calculatePercentage(stats.sharedArtists, stats.totalUniqueArtists)

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Listening Stats (Past Week)</h3>
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center">
                            <BiMusic className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium">Shared Tracks</span>
                        </div>
                        <span className="text-sm font-medium">{stats.sharedTracks} of {stats.totalUniqueTracks}</span>
                    </div>
                    <div className="w-full bg-black border border-white rounded-full h-2">
                        <div className="bg-blue-500 rounded-full h-2 transition-all duration-700" style={{ width: `${trackPercentage}%` }}></div>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center">
                            <FaUsers className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium">Shared Artists</span>
                        </div>
                        <span className="text-sm font-medium">{stats.sharedArtists} of {stats.totalUniqueArtists}</span>
                    </div>
                    <div className="w-full bg-black border border-white rounded-full h-2">
                        <div className="bg-purple-500 rounded-full h-2 transition-all duration-700" style={{ width: `${artistPercentage}%` }}></div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 bg-black border border-white p-4 rounded-lg">
                <div className="text-center">
                    <p className="text-sm text-gray-300">Shared Tracks</p>
                    <p className="text-xl font-bold">{stats.sharedTracks}</p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-300">Shared Artists</p>
                    <p className="text-xl font-bold">{stats.sharedArtists}</p>
                </div>
            </div>
        </div>
    )
}