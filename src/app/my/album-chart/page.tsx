"use client"
import { useSession } from "next-auth/react"
import { useEffect, useRef, useState } from "react"
import { Download, Calendar, Loader2, AlertTriangle, ImageIcon } from "lucide-react"
import FetchLoader from "@/components/(layout)/FetchLoader"
import FetchError from "@/components/(layout)/FetchError"

type Album = {
    albumId: string
    name: string
    imageUrl: string
    playCount: string
}

type AspectRatio = "square" | "4/3" | "16/9"

const aspectOptions = {
    square: [9, 16, 25, 36, 49, 64, 81, 100],
    "4/3": [48, 108],
    "16/9": [144],
}

const timeRanges = [
    { value: "week", label: "Last Week" },
    { value: "month", label: "Last Month" },
    { value: "year", label: "Last Year" }
]

export default function AlbumChartPage() {
    const { data: session, status } = useSession()
    const [albums, setAlbums] = useState<Album[]>([])
    const [aspect, setAspect] = useState<AspectRatio>("square")
    const [imageCount, setImageCount] = useState<number>(9)
    const [timeRange, setTimeRange] = useState<string>("month")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [isGenerating, setIsGenerating] = useState(false)
    const [fetchError, setFetchError] = useState(false)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const imagesLoadedRef = useRef<number>(0)
    const imagesRef = useRef<HTMLImageElement[]>([])

    useEffect(() => {
        if (status === "loading") return

        const fetchAlbums = async () => {
            if (!session?.user?.id) return

            setIsLoading(true)
            setFetchError(false)

            try {
                const res = await fetch(`/api/user/${session.user.id}/top-albums?range=${timeRange}`)

                if (!res.ok) {
                    throw new Error("Failed to fetch albums")
                }

                const data = await res.json()
                setAlbums(data)
            } catch (err) {
                console.error("Error fetching albums:", err)
                setFetchError(true)
            } finally {
                setIsLoading(false)
            }
        }

        fetchAlbums()
    }, [session, status, timeRange])

    useEffect(() => {
        if (albums.length < imageCount) {
            setError(`Not enough data. You selected ${imageCount} images but only ${albums.length} available.`)
        } else {
            setError("")
        }
    }, [albums, imageCount])

    const getGridDimensions = () => {
        let cols = Math.ceil(Math.sqrt(imageCount))

        if (aspect === "16/9") {
            cols = 16
        } else if (aspect === "4/3") {
            if (imageCount === 48) {
                cols = 8
            } else if (imageCount === 108) {
                cols = 12
            }
        }

        const rows = Math.ceil(imageCount / cols)
        return { cols, rows }
    }

    const generateCanvas = async () => {
        if (!canvasRef.current || albums.length < imageCount) return

        setIsGenerating(true)
        imagesLoadedRef.current = 0
        imagesRef.current = []

        const { cols, rows } = getGridDimensions()
        const imagesToShow = albums.slice(0, imageCount)

        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const imageSize = 300
        canvas.width = cols * imageSize
        canvas.height = rows * imageSize

        ctx.fillStyle = "#121212"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        const imagePromises = imagesToShow.map((album, index) => {
            return new Promise<void>((resolve) => {
                const img = new Image()
                img.crossOrigin = "anonymous"
                img.src = album.imageUrl

                img.onload = () => {
                    imagesRef.current[index] = img
                    imagesLoadedRef.current++
                    resolve()
                }

                img.onerror = () => {
                    const placeholderImg = new Image()
                    placeholderImg.crossOrigin = "anonymous"
                    placeholderImg.src = "/placeholder.svg?height=300&width=300"
                    imagesRef.current[index] = placeholderImg
                    resolve()
                }
            })
        })

        await Promise.all(imagePromises)

        imagesToShow.forEach((album, index) => {
            const row = Math.floor(index / cols)
            const col = index % cols
            const x = col * imageSize
            const y = row * imageSize

            const img = imagesRef.current[index]
            if (img) {
                ctx.drawImage(img, x, y, imageSize, imageSize)
            }
        })

        setIsGenerating(false)
    }

    const handleDownload = () => {
        if (!canvasRef.current) return

        const link = document.createElement("a")
        link.download = `album-chart-${timeRange}.png`
        link.href = canvasRef.current.toDataURL("image/png")
        link.click()
    }

    const handleAspectChange = (newAspect: AspectRatio) => {
        setAspect(newAspect)
        setImageCount(aspectOptions[newAspect][0])
    }

    if (status === "loading") {
        return (
            <div className="bg-[#121212] text-white font-sans mx-auto px-4 py-8 space-y-8">
                <FetchLoader />
            </div>
        )
    }

    if (!session) {
        return (
            <div className="bg-[#121212] text-white font-sans mx-auto px-4 py-8 space-y-8">
                <div className="rounded-lg bg-[#1e1814] border border-[#3d2e23] p-6 shadow-lg text-center">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-[#c38e70]" />
                    <h1 className="text-2xl font-bold mb-4 text-[#e6d2c0]">Authentication Required</h1>
                    <p className="text-[#a18072] mb-4">Please sign in to view your album chart.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-[#121212] text-white font-sans mx-auto px-4 py-8 space-y-8">
            <div className="rounded-lg bg-[#1e1814] border border-[#3d2e23] p-6 shadow-lg mb-8">
                <div className="flex items-center gap-2 mb-6">
                    <ImageIcon className="text-[#c38e70]" />
                    <h1 className="text-2xl font-bold text-[#e6d2c0]">Album Chart Generator</h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div>
                        <label className="block text-[#a18072] mb-2">Time Range</label>
                        <select className="w-full bg-[#2a211c] text-[#e6d2c0] px-3 py-2 rounded-md border border-[#3d2e23] focus:outline-none focus:ring-1 focus:ring-[#c38e70]" value={timeRange} onChange={(e) => setTimeRange(e.target.value)} disabled={isLoading}>{timeRanges.map((range) => (<option key={range.value} value={range.value}>{range.label}</option>))}</select>
                    </div>
                    <div>
                        <label className="block text-[#a18072] mb-2">Aspect Ratio</label>
                        <select className="w-full bg-[#2a211c] text-[#e6d2c0] px-3 py-2 rounded-md border border-[#3d2e23] focus:outline-none focus:ring-1 focus:ring-[#c38e70]" value={aspect} onChange={(e) => handleAspectChange(e.target.value as AspectRatio)} disabled={isLoading}>
                            <option value="square">Square (1:1)</option>
                            <option value="4/3">Landscape (4:3)</option>
                            <option value="16/9">Widescreen (16:9)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[#a18072] mb-2">Image Count</label>
                        <select className="w-full bg-[#2a211c] text-[#e6d2c0] px-3 py-2 rounded-md border border-[#3d2e23] focus:outline-none focus:ring-1 focus:ring-[#c38e70]" value={imageCount} onChange={(e) => setImageCount(Number(e.target.value))} disabled={isLoading}>{aspectOptions[aspect].map((count) => (<option key={count} value={count}>{count}</option>))}</select>
                    </div>
                    <div className="flex flex-col justify-end">
                        <button onClick={generateCanvas} disabled={isLoading || !!error || isGenerating} className={`px-4 py-2 rounded-md font-medium flex items-center justify-center gap-2 ${isLoading || !!error || isGenerating ? "bg-[#3d2e23] text-[#a18072] cursor-not-allowed" : "bg-[#c38e70] text-[#1e1814] hover:bg-opacity-90"}`}>
                            {isGenerating ? (
                                <><Loader2 className="animate-spin" size={18} />Generating...</>
                            ) : (
                                <><Calendar size={18} />Generate Chart</>
                            )}
                        </button>
                    </div>
                </div>
                {error && (<div className="p-4 mb-6 bg-[#2a211c] border border-red-500 rounded-md text-red-400"><p>{error}</p></div>)}
                {isLoading ? (
                    <div className="flex justify-center py-12"><FetchLoader /></div>
                ) : fetchError ? (
                    <div className="flex justify-center py-12"><FetchError /></div>
                ) : (
                    <div className="flex flex-col items-center">
                        <div className="mb-6 w-full overflow-auto"><canvas ref={canvasRef} className="mx-auto border border-[#3d2e23] rounded-md shadow-lg" style={{ maxWidth: "100%", height: "auto" }}></canvas></div>
                        <button onClick={handleDownload} disabled={isGenerating || !canvasRef.current} className={`px-6 py-3 rounded-md font-medium flex items-center gap-2 ${isGenerating || !canvasRef.current ? "bg-[#3d2e23] text-[#a18072] cursor-not-allowed" : "bg-[#c38e70] text-[#1e1814] hover:bg-opacity-90"}`}><Download size={18} />Download Chart</button>
                    </div>
                )}
            </div>
            <div className="rounded-lg bg-[#1e1814] border border-[#3d2e23] p-6 shadow-lg">
                <h2 className="text-xl font-bold text-[#e6d2c0] mb-4">About Album Charts</h2>
                <p className="text-[#a18072] mb-4">Create a visual representation of your top albums based on your listening history. Select a time range, choose your preferred layout, and download the image to share with friends.</p>
                <div className="bg-[#2a211c] p-4 rounded-md">
                    <h3 className="text-[#e6d2c0] font-medium mb-2">Tips</h3>
                    <ul className="list-disc list-inside text-[#a18072] space-y-1">
                        <li>Choose &quot;All Time&quot; for your complete listening history</li>
                        <li>Square layouts work best for social media profiles</li>
                        <li>Widescreen (16:9) is perfect for desktop wallpapers</li>
                        <li>Click &quot;Generate Chart&quot; after changing any settings</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}