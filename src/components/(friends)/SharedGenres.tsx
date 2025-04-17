import { Tag } from "lucide-react"

interface SharedGenresProps {
    genres: string[]
}

export default function SharedGenres({ genres }: SharedGenresProps) {
    if (genres.length === 0) {
        return (
            <div className="rounded-lg bg-[#1e1814] border border-[#3d2e23] p-3 lg:p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                    <Tag className="text-[#c38e70]" />
                    <h3 className="text-xl font-bold text-[#e6d2c0]">Shared Genres</h3>
                </div>
                <div className="text-center py-8 bg-[#2a211c] rounded-lg">
                    <Tag className="w-12 h-12 mx-auto mb-3 text-[#a18072] opacity-50" />
                    <p className="text-[#a18072]">No shared genres in the past week</p>
                </div>
            </div>
        )
    }

    return (
        <div className="rounded-lg bg-[#1e1814] border border-[#3d2e23] p-3 lg:p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
                <Tag className="text-[#c38e70]" />
                <h3 className="text-xl font-bold text-[#e6d2c0]">Top Shared Genres</h3>
            </div>
            <div className="flex flex-wrap gap-2">
                {genres.map((genre, index) => (
                    <div key={index} className="px-3 py-2 bg-[#2a211c] hover:bg-[#342820] transition-colors rounded-lg">
                        <span className="font-medium text-[#e6d2c0]">{genre}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}