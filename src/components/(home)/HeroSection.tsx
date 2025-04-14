import Link from "next/link"
import { Music, ArrowRight, Sparkles, BarChart, Medal } from "lucide-react"
import { Session } from "next-auth"

type HeroSectionProps = {
    session: Session | null
}

export default function HeroSection({ session }: HeroSectionProps) {
    return (
        <section className="overflow-hidden">
            <div className="px-4 lg:px-8 py-16 lg:py-24 z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-12 items-center">
                    <div className="space-y-6">
                        <div className="inline-block px-4 py-2 bg-[#2a211c] border border-[#3d2e23] rounded-lg text-[#c38e70] font-medium">Your Spotify Experience, Elevated</div>
                        <h1 className="text-4xl lg:text-6xl font-bold text-[#e6d2c0] leading-tight">Discover Your <span className="text-[#c38e70]">Music DNA</span> with TuneStats</h1>
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
                            <div className="aspect-[5/3] relative rounded-lg overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent"></div>
                                <div className="absolute bottom-4 left-4 right-4 space-y-8">
                                    <div className="bg-[#1e1814]/80 backdrop-blur-sm p-4 rounded-lg border border-[#3d2e23]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-[#2a211c] rounded-full flex items-center justify-center">
                                                <Music className="text-[#c38e70]" />
                                            </div>
                                            <div>
                                                <div className="text-[#e6d2c0] font-medium">Your Top Artist</div>
                                                <div className="text-[#a18072]">Based on your listening history</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-[#1e1814]/80 backdrop-blur-sm p-4 rounded-lg border border-[#3d2e23]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-[#2a211c] rounded-full flex items-center justify-center">
                                                <BarChart className="text-[#c38e70]" />
                                            </div>
                                            <div>
                                                <div className="text-[#e6d2c0] font-medium">Your Music Match with Friends</div>
                                                <div className="text-[#a18072]">Based on your listening history</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-[#1e1814]/80 backdrop-blur-sm p-4 rounded-lg border border-[#3d2e23]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-[#2a211c] rounded-full flex items-center justify-center">
                                                <Medal className="text-[#c38e70]" />
                                            </div>
                                            <div>
                                                <div className="text-[#e6d2c0] font-medium">Global Charts</div>
                                                <div className="text-[#a18072]">Explore trending tracks and artists worldwide</div>
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
    )
}