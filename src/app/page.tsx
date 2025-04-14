"use client"
import { useSession } from "next-auth/react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Music, Users, BarChart3, Share2, MessageSquare, User, ChevronRight, ArrowRight, Headphones, Sparkles, } from "lucide-react"

export default function HomePage() {
    const { data: session, status } = useSession()
    const [activeTab, setActiveTab] = useState("discover")

    if (status === "loading")
        return (
            <div className="bg-[#121212] flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <Music className="h-16 w-16 text-[#c38e70] mb-4" />
                    <p className="text-[#e6d2c0] text-xl">Loading TuneStats...</p>
                </div>
            </div>
        )

    return (
        <div className="bg-[#121212] text-white font-sans">
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#1e1814] to-transparent opacity-40 z-0"></div>
                <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="inline-block px-4 py-2 bg-[#2a211c] border border-[#3d2e23] rounded-lg text-[#c38e70] font-medium">Your Spotify Experience, Elevated</div>
                            <h1 className="text-4xl md:text-6xl font-bold text-[#e6d2c0] leading-tight">Discover Your <span className="text-[#c38e70]">Music DNA</span> with TuneStats</h1>
                            <p className="text-xl text-[#a18072] max-w-lg">Dive deeper into your music taste, compare with friends, and explore your listening habits like never before.</p>
                            <div className="flex flex-wrap gap-4 pt-4">
                                {session ? (
                                    <Link href={session.user?.id ? `/user/${session.user.id}` : "#"} className="px-6 py-3 bg-[#c38e70] text-[#1e1814] font-bold rounded-lg hover:bg-opacity-90 transition-all flex items-center gap-2">Go to Profile <ArrowRight size={18} /></Link>
                                ) : (
                                    <Link href="/api/auth/signin" className="px-6 py-3 bg-[#c38e70] text-[#1e1814] font-bold rounded-lg hover:bg-opacity-90 transition-all flex items-center gap-2">Sign In with Spotify <ArrowRight size={18} /></Link>
                                )}
                                <Link href="#features" className="px-6 py-3 bg-[#2a211c] border border-[#3d2e23] text-[#e6d2c0] rounded-lg hover:bg-[#3d2e23] transition-all">Explore Features</Link>
                            </div>
                            {session && (<div className="pt-4 text-[#a18072]">Welcome back, <span className="text-[#e6d2c0] font-medium">{session.user?.name}</span>!</div>)}
                        </div>
                        <div className="relative">
                            <div className="bg-[#1e1814] border-4 border-[#3d2e23] rounded-2xl p-4 transform rotate-2 shadow-xl">
                                <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
                                    <Image src="/placeholder.svg?height=600&width=800" alt="TuneStats Dashboard" width={800} height={600} className="object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent"></div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <div className="bg-[#1e1814]/80 backdrop-blur-sm p-4 rounded-lg border border-[#3d2e23]">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-[#2a211c] rounded-full flex items-center justify-center"><Music className="text-[#c38e70]" />
                                                </div>
                                                <div>
                                                    <div className="text-[#e6d2c0] font-medium">Your Top Artist</div>
                                                    <div className="text-[#a18072]">Based on your listening history</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -bottom-6 -right-6 bg-[#2a211c] border-2 border-[#3d2e23] rounded-lg p-3 transform -rotate-3 shadow-lg">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="text-[#c38e70]" />
                                    <span className="text-[#e6d2c0] font-medium">Discover your music taste!</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section id="features" className="max-w-7xl mx-auto px-4 py-16 md:py-24">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#e6d2c0] mb-4">Powerful Features</h2>
                    <p className="text-[#a18072] max-w-2xl mx-auto">Explore everything TuneStats has to offer to enhance your music experience</p>
                </div>
                <div className="bg-[#1e1814] border border-[#3d2e23] rounded-xl overflow-hidden shadow-lg">
                    <div className="flex flex-wrap border-b border-[#3d2e23]">
                        <button onClick={() => setActiveTab("discover")} className={`px-6 py-4 font-medium text-sm md:text-base transition-colors ${activeTab === "discover" ? "bg-[#2a211c] text-[#e6d2c0]" : "text-[#a18072] hover:text-[#e6d2c0]"}`}>Discover</button>
                        <button onClick={() => setActiveTab("connect")} className={`px-6 py-4 font-medium text-sm md:text-base transition-colors ${activeTab === "connect" ? "bg-[#2a211c] text-[#e6d2c0]" : "text-[#a18072] hover:text-[#e6d2c0]"}`}>Connect</button>
                        <button onClick={() => setActiveTab("explore")} className={`px-6 py-4 font-medium text-sm md:text-base transition-colors ${activeTab === "explore" ? "bg-[#2a211c] text-[#e6d2c0]" : "text-[#a18072] hover:text-[#e6d2c0]"}`}>Explore</button>
                        <button onClick={() => setActiveTab("engage")} className={`px-6 py-4 font-medium text-sm md:text-base transition-colors ${activeTab === "engage" ? "bg-[#2a211c] text-[#e6d2c0]" : "text-[#a18072] hover:text-[#e6d2c0]"}`}>Engage</button>
                    </div>
                    <div className="p-6 md:p-8">
                        {activeTab === "discover" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-[#2a211c] rounded-full flex items-center justify-center"><User className="text-[#c38e70]" /></div>
                                        <h3 className="text-xl font-bold text-[#e6d2c0]">Personal Music Profile</h3>
                                    </div>
                                    <p className="text-[#a18072] mb-6">Get detailed insights into your listening habits with personalized statistics, top tracks, and favorite artists. Your profile updates in real-time as you listen to more music.</p>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-2">
                                            <ChevronRight className="text-[#c38e70] mt-1 flex-shrink-0" size={18} />
                                            <span className="text-[#e6d2c0]">View your top tracks by time period (week, month, year)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <ChevronRight className="text-[#c38e70] mt-1 flex-shrink-0" size={18} />
                                            <span className="text-[#e6d2c0]">Discover your most listened to artists</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <ChevronRight className="text-[#c38e70] mt-1 flex-shrink-0" size={18} />
                                            <span className="text-[#e6d2c0]">Track your listening history over time</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="bg-[#2a211c] border border-[#3d2e23] rounded-lg p-4 transform rotate-1 shadow-lg">
                                    <Image src="/placeholder.svg?height=400&width=600" alt="User Profile" width={600} height={400} className="rounded" />
                                </div>
                            </div>
                        )}
                        {activeTab === "connect" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-[#2a211c] rounded-full flex items-center justify-center"><Users className="text-[#c38e70]" /></div>
                                        <h3 className="text-xl font-bold text-[#e6d2c0]">Friend Comparison</h3>
                                    </div>
                                    <p className="text-[#a18072] mb-6">Connect with friends and discover your musical compatibility. See shared artists, tracks, and get a compatibility score based on your listening habits.</p>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-2">
                                            <ChevronRight className="text-[#c38e70] mt-1 flex-shrink-0" size={18} />
                                            <span className="text-[#e6d2c0]">Get detailed compatibility scores with friends</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <ChevronRight className="text-[#c38e70] mt-1 flex-shrink-0" size={18} />
                                            <span className="text-[#e6d2c0]">Discover shared favorite artists and tracks</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <ChevronRight className="text-[#c38e70] mt-1 flex-shrink-0" size={18} />
                                            <span className="text-[#e6d2c0]">Find new music through friends&apos; recommendations</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="bg-[#2a211c] border border-[#3d2e23] rounded-lg p-4 transform -rotate-1 shadow-lg">
                                    <Image src="/placeholder.svg?height=400&width=600" alt="Friend Comparison" width={600} height={400} className="rounded" />
                                </div>
                            </div>
                        )}
                        {activeTab === "explore" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-[#2a211c] rounded-full flex items-center justify-center"><BarChart3 className="text-[#c38e70]" /></div>
                                        <h3 className="text-xl font-bold text-[#e6d2c0]">Detailed Pages & Charts</h3>
                                    </div>
                                    <p className="text-[#a18072] mb-6">Explore detailed pages for tracks, artists, and albums. View global charts, popularity metrics, and discover new music based on community trends.</p>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-2">
                                            <ChevronRight className="text-[#c38e70] mt-1 flex-shrink-0" size={18} />
                                            <span className="text-[#e6d2c0]">Detailed artist pages with albums and top tracks</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <ChevronRight className="text-[#c38e70] mt-1 flex-shrink-0" size={18} />
                                            <span className="text-[#e6d2c0]">Album pages with track listings and artist info</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <ChevronRight className="text-[#c38e70] mt-1 flex-shrink-0" size={18} />
                                            <span className="text-[#e6d2c0]">Track pages with playback stats and related content</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="bg-[#2a211c] border border-[#3d2e23] rounded-lg p-4 transform rotate-1 shadow-lg">
                                    <Image src="/placeholder.svg?height=400&width=600" alt="Detailed Pages" width={600} height={400} className="rounded" />
                                </div>
                            </div>
                        )}
                        {activeTab === "engage" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-[#2a211c] rounded-full flex items-center justify-center"><MessageSquare className="text-[#c38e70]" /></div>
                                        <h3 className="text-xl font-bold text-[#e6d2c0]">Community Engagement</h3>
                                    </div>
                                    <p className="text-[#a18072] mb-6">Rate and comment on tracks, albums, and artists. Share your opinions and see what others think about your favorite music.</p>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-2">
                                            <ChevronRight className="text-[#c38e70] mt-1 flex-shrink-0" size={18} />
                                            <span className="text-[#e6d2c0]">Rate tracks, albums, and artists</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <ChevronRight className="text-[#c38e70] mt-1 flex-shrink-0" size={18} />
                                            <span className="text-[#e6d2c0]">Leave comments and join discussions</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <ChevronRight className="text-[#c38e70] mt-1 flex-shrink-0" size={18} />
                                            <span className="text-[#e6d2c0]">Share your profile with friends</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="bg-[#2a211c] border border-[#3d2e23] rounded-lg p-4 transform -rotate-1 shadow-lg">
                                    <Image src="/placeholder.svg?height=400&width=600" alt="Community Engagement" width={600} height={400} className="rounded" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
            <section className="bg-[#1e1814] border-y border-[#3d2e23]">
                <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#e6d2c0] mb-4">How It Works</h2>
                        <p className="text-[#a18072] max-w-2xl mx-auto">Get started with TuneStats in three simple steps</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-[#2a211c] border border-[#3d2e23] rounded-lg p-6 relative">
                            <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#c38e70] rounded-full flex items-center justify-center text-[#1e1814] font-bold text-xl">1</div>
                            <div className="pt-6">
                                <div className="w-16 h-16 bg-[#1e1814] rounded-full flex items-center justify-center mb-4 mx-auto"><Headphones className="text-[#c38e70]" size={32} /></div>
                                <h3 className="text-xl font-bold text-[#e6d2c0] text-center mb-3">Connect Your Spotify</h3>
                                <p className="text-[#a18072] text-center">Sign in with your Spotify account to allow TuneStats to access your listening data.</p>
                            </div>
                        </div>
                        <div className="bg-[#2a211c] border border-[#3d2e23] rounded-lg p-6 relative">
                            <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#c38e70] rounded-full flex items-center justify-center text-[#1e1814] font-bold text-xl">2</div>
                            <div className="pt-6">
                                <div className="w-16 h-16 bg-[#1e1814] rounded-full flex items-center justify-center mb-4 mx-auto"><User className="text-[#c38e70]" size={32} /></div>
                                <h3 className="text-xl font-bold text-[#e6d2c0] text-center mb-3">Explore Your Profile</h3>
                                <p className="text-[#a18072] text-center">Discover your listening habits, top tracks, and favorite artists on your personalized profile.</p>
                            </div>
                        </div>
                        <div className="bg-[#2a211c] border border-[#3d2e23] rounded-lg p-6 relative">
                            <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#c38e70] rounded-full flex items-center justify-center text-[#1e1814] font-bold text-xl">3</div>
                            <div className="pt-6">
                                <div className="w-16 h-16 bg-[#1e1814] rounded-full flex items-center justify-center mb-4 mx-auto"><Share2 className="text-[#c38e70]" size={32} /></div>
                                <h3 className="text-xl font-bold text-[#e6d2c0] text-center mb-3">Connect With Friends</h3>
                                <p className="text-[#a18072] text-center">Add friends, compare music tastes, and discover new music through your connections.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="border-y border-[#3d2e23]">
                <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#e6d2c0] mb-6">Ready to Discover Your Music DNA?</h2>
                    <p className="text-[#a18072] max-w-2xl mx-auto mb-8">Join thousands of music lovers who are exploring their listening habits and connecting with friends through TuneStats.</p>
                    {session ? (
                        <Link href={session.user?.id ? `/user/${session.user.id}` : "#"} className="px-8 py-4 bg-[#c38e70] text-[#1e1814] font-bold rounded-lg hover:bg-opacity-90 transition-all inline-flex items-center gap-2 text-lg">Go to Your Profile <ArrowRight size={20} /></Link>
                    ) : (
                        <Link href="/api/auth/signin" className="px-8 py-4 bg-[#c38e70] text-[#1e1814] font-bold rounded-lg hover:bg-opacity-90 transition-all inline-flex items-center gap-2 text-lg">Get Started with Spotify <ArrowRight size={20} /></Link>
                    )}
                </div>
            </section>
            <footer className="bg-[#121212] border-t border-[#3d2e23]">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Music className="text-[#c38e70]" />
                                <span className="text-xl font-bold text-[#e6d2c0]">TuneStats</span>
                            </div>
                            <p className="text-[#a18072]">Your Spotify experience, elevated. Discover your music DNA and connect with friends.</p>
                        </div>
                    </div>
                    <div className="border-t border-[#3d2e23] mt-8 pt-8 text-center text-[#a18072] text-sm">
                        <p>© {new Date().getFullYear()} TuneStats. All rights reserved. Not affiliated with Spotify.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}