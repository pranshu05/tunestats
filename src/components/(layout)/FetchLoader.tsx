import { Loader2 } from "lucide-react"

export default function FetchLoader() {
    return (
        <div className="flex flex-col items-center justify-center p-8 rounded-lg bg-[#1e1814] border border-[#3d2e23]">
            <Loader2 className="h-8 w-8 animate-spin text-[#c38e70] mb-2" />
            <p className="font-medium text-[#e6d2c0]">Loading...</p>
        </div>
    )
}