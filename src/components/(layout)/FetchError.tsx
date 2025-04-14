import { AlertTriangle } from "lucide-react"

export default function FetchError() {
    return (
        <div className="flex flex-col items-center justify-center p-8 rounded-lg bg-[#1e1814] border border-red-500">
            <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
            <p className="font-medium text-red-500">Failed to load data</p>
            <p className="text-sm text-[#a18072] mt-2">Please try refreshing the page</p>
        </div>
    )
}