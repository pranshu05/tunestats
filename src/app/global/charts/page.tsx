"use client"
import { useState } from "react"
import TopTracksChart from "@/components/(global)/TopTracksChart"
import TopArtistsChart from "@/components/(global)/TopArtistsChart"
import TopAlbumsChart from "@/components/(global)/TopAlbumsChart"
import ChartTimeRangeSelector from "@/components/(global)/ChartTimeRangeSelector"
import { BarChart3, Music, Disc, Users } from 'lucide-react'

type TimeRange = "week" | "month" | "year"

export default function GlobalChartsPage() {
    const [timeRange, setTimeRange] = useState<TimeRange>("week")

    return (
        <div className="bg-[#121212] text-white font-sans mx-auto px-4 py-8 space-y-8">
            <div className="rounded-lg bg-[#1e1814] border border-[#3d2e23] p-6 shadow-lg">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="text-[#c38e70]" size={24} />
                        <h1 className="text-3xl font-bold text-[#e6d2c0]">Global Charts</h1>
                    </div>
                    <ChartTimeRangeSelector timeRange={timeRange} onTimeRangeChange={setTimeRange} />
                </div>
                <p className="text-[#a18072] mb-4">
                    Discover what&apos;s trending across the TuneStats community. These charts are based on actual listening data from all users.
                </p>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-[#2a211c] rounded-lg p-4 flex flex-col items-center">
                        <Music className="text-[#c38e70] mb-2" size={20} />
                        <span className="text-[#e6d2c0] font-medium">Top Tracks</span>
                    </div>
                    <div className="bg-[#2a211c] rounded-lg p-4 flex flex-col items-center">
                        <Users className="text-[#c38e70] mb-2" size={20} />
                        <span className="text-[#e6d2c0] font-medium">Top Artists</span>
                    </div>
                    <div className="bg-[#2a211c] rounded-lg p-4 flex flex-col items-center">
                        <Disc className="text-[#c38e70] mb-2" size={20} />
                        <span className="text-[#e6d2c0] font-medium">Top Albums</span>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <TopTracksChart timeRange={timeRange} />
                <TopArtistsChart timeRange={timeRange} />
            </div>
            <TopAlbumsChart timeRange={timeRange} />
        </div>
    )
}