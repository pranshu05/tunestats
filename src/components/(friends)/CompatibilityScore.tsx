"use client"

import { useEffect, useState } from "react"
import { Percent } from "lucide-react"

interface CompatibilityScoreProps {
    score: number
    sharedGenres: number
}

export default function CompatibilityScore({ score, sharedGenres }: CompatibilityScoreProps) {
    const [animatedScore, setAnimatedScore] = useState(0)

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedScore(score)
        }, 200)

        return () => clearTimeout(timer)
    }, [score])

    const getScoreColor = () => {
        if (score >= 80) return "text-green-500"
        if (score >= 60) return "text-[#c38e70]"
        if (score >= 40) return "text-yellow-500"
        if (score >= 20) return "text-orange-500"
        return "text-red-500"
    }

    const getScoreMessage = () => {
        if (score >= 80) return "Musical Soulmates"
        if (score >= 60) return "Great Musical Match"
        if (score >= 40) return "Solid Musical Connection"
        if (score >= 20) return "Some Common Ground"
        return "Different Musical Tastes"
    }

    const getGenreDescription = () => {
        if (sharedGenres >= 6) return "Remarkable genre overlap"
        if (sharedGenres >= 4) return "Great genre variety"
        if (sharedGenres >= 2) return "Some genre similarity"
        if (sharedGenres === 1) return "One shared genre"
        return ""
    }

    return (
        <div className="rounded-lg bg-[#1e1814] border border-[#3d2e23] p-3 lg:p-6 shadow-lg text-center">
            <div className="flex items-center gap-2 mb-2 lg:mb-4 justify-center">
                <Percent className="text-[#c38e70]" />
                <h3 className="text-xl font-bold text-[#e6d2c0]">Compatibility</h3>
            </div>
            <div className="inline-block relative w-48 h-48 mb-4">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-5xl font-bold transition-all duration-1000 ease-out"><span className={getScoreColor()}>{animatedScore}%</span></div>
                </div>
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#2a211c" strokeWidth="8" />
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="283" strokeDashoffset={283 - (283 * animatedScore) / 100} className={`${getScoreColor()} transition-all duration-1000 ease-out`} />
                </svg>
            </div>
            <p className="text-lg font-medium text-[#e6d2c0]">{getScoreMessage()}</p>
            {sharedGenres > 0 && (<p className="text-sm text-[#a18072] mt-2">{getGenreDescription()}</p>)}
        </div>
    )
}