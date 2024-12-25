/* eslint-disable @next/next/no-img-element */
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { LayoutGrid, Grid } from 'lucide-react'
import Loader from "@/components/(layout)/Loader"

export default function ArtistAlbums({ userId, artistId }) {
    const [albums, setAlbums] = useState([])
    const [viewMode, setViewMode] = useState("list")

    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const res = await fetch(`/api/getArtistAlbums/?artistId=${artistId}&userId=${userId}`)
                if (res.ok) {
                    const data = await res.json()
                    setAlbums(data.albums)
                } else {
                    console.error("Failed to fetch albums")
                }
            } catch (error) {
                console.error("Error fetching albums:", error)
            }
        }

        fetchAlbums()
    }, [artistId, userId])

    const toggleViewMode = () => {
        setViewMode(viewMode === "grid" ? "list" : "grid")
    }

    return (
        <div className="bg-zinc-900/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Albums</h2>
                <Button variant="ghost" size="icon" onClick={toggleViewMode} className="rounded-full hover:bg-white/10">
                    {viewMode === "list" ? (<LayoutGrid className="w-5 h-5" />) : (<Grid className="w-5 h-5" />)}
                </Button>
            </div>
            {albums.length > 0 ? (
                viewMode === "list" ? (
                    <div className="overflow-x-auto">
                        <div className="w-max min-w-full">
                            <div className="flex gap-4">
                                {albums.map((album) => (
                                    <a key={album.albumId} href={`/album/${album.albumId}`} className="w-32 lg:w-36 group">
                                        <div className="aspect-square mb-4"><img src={album.albumImageUrl || "/placeholder.svg"} alt={album.albumName} className="w-full h-full object-cover rounded-md" /></div>
                                        <div className="font-medium mb-1 truncate group-hover:text-green-400">{album.albumName}</div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {albums.map((album) => (
                            <a key={album.albumId} href={`/album/${album.albumId}`} className="group">
                                <div className="aspect-square mb-4"><img src={album.albumImageUrl || "/placeholder.svg"} alt={album.albumName} className="w-full h-full object-cover rounded-md" /></div>
                                <div className="font-medium mb-1 truncate group-hover:text-green-400">{album.albumName}</div>
                            </a>
                        ))}
                    </div>
                )
            ) : (
                <Loader />
            )}
        </div>
    )
}