import { useSession, signIn } from "next-auth/react";
import Link from 'next/link';
import Navbar from "@/components/(layout)/NavBar";
import { BarChart2, Share2, UserPlus } from 'lucide-react';

export default function Home() {
    const { data: session } = useSession();
    const currentYear = new Date().getFullYear();

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />

            <section className="flex flex-col items-center justify-center py-24 px-6 md:px-12 text-center">
                <div className="space-y-8 max-w-4xl">
                    {!session ? (
                        <>
                            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter bg-gradient-to-r from-white to-green-500 bg-clip-text text-transparent">Welcome to TuneStats</h1>
                            <p className="text-lg md:text-xl text-gray-400">Discover your Spotify stats and connect with music lovers. Dive deep into your listening habits and share your musical journey.</p>
                            <div onClick={() => signIn("spotify")} className="cursor-pointer bg-[#1DB954] text-black font-bold py-3 px-6 text-sm lg:text-base w-fit rounded-md mx-auto">Login with Spotify</div>
                        </>
                    ) : (
                        <>
                            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter bg-gradient-to-r from-white to-green-500 bg-clip-text text-transparent">Welcome back, {session.user.name}!</h1>
                            <p className="text-lg md:text-xl text-gray-400">Ready to explore your latest stats?</p>
                            <div className="cursor-pointer bg-[#1DB954] text-black font-bold py-3 px-6 text-sm lg:text-base w-fit rounded-md mx-auto"><Link href={`/user/${session.user.id}`}>Go to Your Profile</Link></div>
                        </>
                    )}
                </div>
            </section>

            <section className="py-20 px-6 md:px-12">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why TuneStats?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard icon={<BarChart2 size={48} />} title="Detailed Stats" description="Get in-depth insights into your listening habits and favorite tracks." />
                        <FeatureCard icon={<Share2 size={48} />} title="Shareable Profile" description="Create a unique, shareable page showcasing your music taste." />
                        <FeatureCard icon={<UserPlus size={48} />} title="Connect with Friends" description="Find and add friends to compare music preferences." />
                    </div>
                </div>
            </section>

            {!session && (
                <section className="py-20 px-6 md:px-12 text-center">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to dive into your music stats?</h2>
                        <p className="text-xl mb-8 text-gray-400">Join TuneStats today and start exploring your Spotify data!</p>
                        <div onClick={() => signIn("spotify")} className="cursor-pointer bg-[#1DB954] text-black font-bold py-3 px-6 text-sm lg:text-base w-fit rounded-md mx-auto">Get Started</div>
                    </div>
                </section>
            )}

            <footer className="p-6 md:px-12 border-t text-center">
                <p className="text-sm text-gray-400">&copy; {currentYear} TuneStats. All rights reserved.</p>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="group relative overflow-hidden rounded-lg border p-6">
            <div className="mb-4 text-green-500 flex justify-center">{icon}</div>
            <h3 className="text-xl font-semibold text-center mb-2">{title}</h3>
            <p className="text-gray-400 text-center">{description}</p>
        </div>
    );
}