"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import axios from "axios"
import useSWR, { mutate } from "swr"
import { fetcher } from "@/utils/fetcher"
import { Star } from "lucide-react"

type EntityType = "artist" | "album" | "track"
type Rating = { userId: string; rating: number }

export default function RatingComponent({ entityId, entityType }: { entityId: string; entityType: EntityType }) {
    const [hovered, setHovered] = useState<number | null>(null)
    const { data: session } = useSession()
    const currentUserId = session?.user?.id
    const { data } = useSWR(`/api/ratings?entityId=${entityId}&entityType=${entityType}`, fetcher, {
        revalidateOnFocus: false,
    })
    const [userRating, setUserRating] = useState<number | null>(null)

    useEffect(() => {
        if (data?.ratings && currentUserId) {
            const existing = data.ratings.find((r: Rating) => r.userId === currentUserId)
            if (existing) setUserRating(existing.rating)
        }
    }, [data, currentUserId])

    const handleRate = async (value: number) => {
        setUserRating(value)

        await axios.post("/api/ratings", {
            userId: currentUserId,
            entityId,
            entityType,
            rating: value,
        })

        mutate(`/api/ratings?entityId=${entityId}&entityType=${entityType}`)
    }

    const averageRating = data?.averageRating || 0
    const totalRatings = data?.totalRatings || 0

    return (
        <div className="rounded-lg bg-[#1e1814] border border-[#3d2e23] p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
                <Star className="text-[#c38e70]" />
                <h3 className="text-xl font-bold text-[#e6d2c0]">Rating</h3>
            </div>
            <p className="text-sm text-[#a18072] mb-3">Your Rating:</p>
            <div className="flex space-x-2 mb-4">
                {[1, 2, 3, 4, 5].map((num) => (
                    <button
                        key={num}
                        onClick={() => handleRate(num)}
                        onMouseEnter={() => setHovered(num)}
                        onMouseLeave={() => setHovered(null)}
                        className="w-10 h-10 flex items-center justify-center bg-[#2a211c] rounded hover:bg-[#342820] transition-colors"
                    >
                        <Star
                            className={num <= (hovered ?? userRating ?? 0) ? "fill-[#c38e70] text-[#c38e70]" : "text-[#a18072]"}
                            size={20}
                        />
                    </button>
                ))}
            </div>
            <div className="flex items-center space-x-3 pt-3 border-t border-[#3d2e23] p-2">
                <span className="font-bold text-lg text-[#e6d2c0]">{averageRating.toFixed(1)}</span>
                <Star className="fill-[#c38e70] text-[#c38e70]" size={18} />
                <span className="text-[#a18072]">({totalRatings} ratings)</span>
            </div>
        </div>
    )
}