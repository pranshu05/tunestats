/* eslint-disable @next/next/no-img-element */
import { useSession, signIn } from "next-auth/react";
import { BarChart2, Share2, UserPlus, Lock, Users } from 'lucide-react';

export default function Home() {
    const { data: session } = useSession();

    return (
        <div className="min-h-screen bg-black text-white">
            <section className="flex flex-col items-center justify-center py-24 px-6 lg:px-12 text-center">
                <div className="max-w-7xl flex flex-col lg:flex-row items-center justify-between">
                    <div className="mx-auto lg:w-1/2 space-y-8">
                        {!session ? (
                            <>
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight animate-fade-in">
                                    <span className="block">Welcome to</span>
                                    <span className="block text-[#1DB954]">TuneStats</span>
                                </h1>
                                <p className="text-xl text-gray-400 animate-fade-in-delay">
                                    Track your Spotify stats, share profiles, and compare your music taste with friends.
                                </p>
                                <div className="mt-8">
                                    <button onClick={() => signIn("spotify")} className="bg-[#1DB954] text-black font-bold py-3 px-8 rounded-full text-lg hover:bg-[#1ed760] transition duration-300 animate-fade-in-delay">Login with Spotify</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight animate-fade-in">
                                    <span className="block">Welcome back,</span>
                                    <span className="block text-[#1DB954]">{session.user.name}!</span>
                                </h1>
                                <p className="text-xl text-gray-400 animate-fade-in-delay">Ready to explore your latest stats?</p>
                                <div className="mt-8"><a href={`/user/${session.user.id}`} className="bg-[#1DB954] text-black font-bold py-3 px-8 rounded-full text-lg hover:bg-[#1ed760] transition duration-300 animate-fade-in-delay">Go to Your Profile</a></div>
                            </>
                        )}
                    </div>
                    <div className="mt-8 lg:mt-0 lg:w-1/2 flex justify-center">
                        <div className="relative w-full max-w-lg overflow-hidden">
                            <img src="/home.jpg" alt="TuneStats" className="w-full object-contain rounded-lg transform transition-all duration-500 ease-in-out hover:scale-110 hover:translate-y-2" />
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-20 px-6 lg:px-12">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-green-500 mb-12">
                        Why TuneStats?
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard icon={<BarChart2 size={48} />} title="Spotify Stats" description="Get detailed insights into your listening habits with personalized charts." />
                        <FeatureCard icon={<Share2 size={48} />} title="Share Profiles" description="Create and share your personalized profile showcasing your top tracks and artists." />
                        <FeatureCard icon={<UserPlus size={48} />} title="Connect with Friends" description="Find and add friends to compare music tastes and explore their preferences." />
                        <FeatureCard icon={<Lock size={48} />} title="Privacy Control" description="Set your profile as public or private based on your preference." />
                        <FeatureCard icon={<Users size={48} />} title="Friend Comparison" description="Compare your Spotify stats with friends through interactive charts." />
                    </div>
                </div>
            </section>
            {!session && (
                <section className="py-20 px-6 lg:px-12 text-center">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6">Ready to dive into your music stats?</h2>
                        <p className="text-lg sm:text-xl mb-8 text-gray-400">Join TuneStats today and explore your Spotify data like never before!</p>
                        <div onClick={() => signIn("spotify")} className="cursor-pointer bg-[#1DB954] text-black font-bold py-3 px-6 text-sm lg:text-base w-fit rounded-full mx-auto">Get Started</div>
                    </div>
                </section>
            )}
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="relative group border border-transparent bg-gradient-to-r from-zinc-900/50 via-zinc-800/50 to-zinc-900/50 p-6 rounded-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-center mb-6">
                <div className="p-3 bg-green-600/10 rounded-full text-green-400 transition-transform duration-300 transform group-hover:scale-110 group-hover:bg-green-500/10">{icon}</div>
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-center text-white group-hover:text-green-400 tracking-wide">{title}</h3>
            <p className="text-sm sm:text-base text-center text-gray-400 group-hover:text-gray-300 leading-relaxed">{description}</p>
        </div>
    );
}