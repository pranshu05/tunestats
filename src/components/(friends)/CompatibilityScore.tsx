import { useEffect, useState } from 'react'

interface CompatibilityScoreProps {
    score: number
}

export default function CompatibilityScore({ score }: CompatibilityScoreProps) {
    const [animatedScore, setAnimatedScore] = useState(0)

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedScore(score)
        }, 200)

        return () => clearTimeout(timer)
    }, [score])

    const getScoreColor = () => {
        if (score >= 80) return 'text-green-500'
        if (score >= 60) return 'text-blue-500'
        if (score >= 40) return 'text-yellow-500'
        if (score >= 20) return 'text-orange-500'
        return 'text-red-500'
    }

    const getScoreMessage = () => {
        if (score >= 80) return 'Musical Soulmates'
        if (score >= 60) return 'Great Musical Match'
        if (score >= 40) return 'Solid Musical Connection'
        if (score >= 20) return 'Some Common Ground'
        return 'Different Musical Tastes'
    }

    return (
        <div className="text-center">
            <div className="inline-block relative">
                <div className="text-6xl font-bold mb-2 transition-all duration-1000 ease-out">
                    <span className={getScoreColor()}>{animatedScore}%</span>
                </div>
                <svg className="w-full absolute -z-10 top-0" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="283" strokeDashoffset={283 - (283 * animatedScore) / 100} className={`${getScoreColor()} transition-all duration-1000 ease-out`} transform="rotate(-90 50 50)" />
                </svg>
            </div>
            <p className="text-lg font-medium mt-4">{getScoreMessage()}</p>
        </div>
    )
}