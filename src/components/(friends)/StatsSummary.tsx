import { Music, Users, BarChart3 } from "lucide-react"

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
        <div className="rounded-lg bg-[#1e1814] border border-[#3d2e23] p-3 lg:p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-2 lg:mb-4">
                <BarChart3 className="text-[#c38e70]" />
                <h3 className="text-xl font-bold text-[#e6d2c0]">Listening Stats (Past Week)</h3>
            </div>
            <div className="space-y-3 lg:space-y-6">
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                            <Music className="w-4 h-4 mr-2 text-[#c38e70]" />
                            <span className="text-sm font-medium text-[#e6d2c0]">Shared Tracks</span>
                        </div>
                        <span className="text-sm font-medium text-[#e6d2c0]">{stats.sharedTracks} of {stats.totalUniqueTracks}</span>
                    </div>
                    <div className="w-full bg-[#2a211c] rounded-full h-2.5">
                        <div className="bg-[#c38e70] rounded-full h-2.5 transition-all duration-700" style={{ width: `${trackPercentage}%` }}></div>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2 text-[#c38e70]" />
                            <span className="text-sm font-medium text-[#e6d2c0]">Shared Artists</span>
                        </div>
                        <span className="text-sm font-medium text-[#e6d2c0]">{stats.sharedArtists} of {stats.totalUniqueArtists}</span>
                    </div>
                    <div className="w-full bg-[#2a211c] rounded-full h-2.5">
                        <div className="bg-[#c38e70] rounded-full h-2.5 transition-all duration-700" style={{ width: `${artistPercentage}%` }}></div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center p-4 bg-[#2a211c] rounded-lg">
                    <p className="text-sm text-[#a18072] mb-1">Shared Tracks</p>
                    <p className="text-2xl font-bold text-[#e6d2c0]">{stats.sharedTracks}</p>
                </div>
                <div className="text-center p-4 bg-[#2a211c] rounded-lg">
                    <p className="text-sm text-[#a18072] mb-1">Shared Artists</p>
                    <p className="text-2xl font-bold text-[#e6d2c0]">{stats.sharedArtists}</p>
                </div>
            </div>
        </div>
    )
}