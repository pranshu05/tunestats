'use client'
import { Calendar } from "lucide-react"

type TimeRange = "week" | "month" | "year"

interface ChartTimeRangeSelectorProps {
    timeRange: TimeRange
    onTimeRangeChange: (range: TimeRange) => void
}

export default function ChartTimeRangeSelector({ timeRange, onTimeRangeChange }: ChartTimeRangeSelectorProps) {
    return (
        <div className="flex items-center gap-2 bg-[#2a211c] rounded-lg p-1">
            <Calendar className="text-[#c38e70] ml-2" size={16} />
            <div className="flex">
                <button onClick={() => onTimeRangeChange("week")} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${timeRange === "week" ? "bg-[#3d2e23] text-[#e6d2c0]" : "text-[#a18072] hover:text-[#e6d2c0]"}`}>Last Week</button>
                <button onClick={() => onTimeRangeChange("month")} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${timeRange === "month" ? "bg-[#3d2e23] text-[#e6d2c0]" : "text-[#a18072] hover:text-[#e6d2c0]"}`}>Last Month</button>
                <button onClick={() => onTimeRangeChange("year")} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${timeRange === "year" ? "bg-[#3d2e23] text-[#e6d2c0]" : "text-[#a18072] hover:text-[#e6d2c0]"}`}>Last Year</button>
            </div>
        </div>
    )
}