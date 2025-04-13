"use client";
import { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';
import axios from "axios";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/utils/fetcher";
import { FaStar } from "react-icons/fa";

type EntityType = "artist" | "album" | "track";
type Rating = { userId: string; rating: number };

export default function RatingComponent({ entityId, entityType, }: { entityId: string; entityType: EntityType; }) {
    const [hovered, setHovered] = useState<number | null>(null);
    const { data: session } = useSession();
    const currentUserId = session?.user?.id;
    const { data } = useSWR(`/api/ratings?entityId=${entityId}&entityType=${entityType}`, fetcher, { revalidateOnFocus: false });
    const [userRating, setUserRating] = useState<number | null>(null);

    useEffect(() => {
        if (data?.ratings && currentUserId) {
            const existing = data.ratings.find(
                (r: Rating) => r.userId === currentUserId
            );
            if (existing) setUserRating(existing.rating);
        }
    }, [data, currentUserId]);

    const handleRate = async (value: number) => {
        setUserRating(value);

        await axios.post("/api/ratings", {
            userId: currentUserId,
            entityId,
            entityType,
            rating: value,
        });

        mutate(`/api/ratings?entityId=${entityId}&entityType=${entityType}`);
    };

    const averageRating = data?.averageRating || 0;
    const totalRatings = data?.totalRatings || 0;

    return (
        <div className="bg-black border border-white p-5 rounded-lg space-y-3">
            <p className="text-sm font-semibold text-white">Your Rating:</p>
            <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((num) => (
                    <button key={num} onClick={() => handleRate(num)} onMouseEnter={() => setHovered(num)} onMouseLeave={() => setHovered(null)} className="text-lg transition-colors">
                        <FaStar className={num <= (hovered ?? userRating ?? 0) ? "text-yellow-400" : "text-white opacity-30"} />
                    </button>
                ))}
            </div>
            <div className="text-sm text-white flex items-center space-x-2 pt-1">
                <span className="font-semibold">Avg: {averageRating.toFixed(1)}</span>
                <FaStar className="text-yellow-400" />
                <span className="opacity-60">({totalRatings} ratings)</span>
            </div>
        </div>
    );
}