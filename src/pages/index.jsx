import { useSession, signIn } from "next-auth/react";
import { BarChart2, Share2, UserPlus } from 'lucide-react';

export default function Home() {
    const { data: session } = useSession();

    return (
        <div className="max-w-7xl mx-auto p-4">
            <section className="py-20 text-center">
                <div className="max-w-4xl mx-auto space-y-8">
                    {!session ? (
                        <>
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
                                <span className="block">Welcome to</span>
                                <span className="block text-[#1DB954]">TuneStats</span>
                            </h1>
                            <p className="text-xl text-gray-400">
                                Discover your Spotify stats and connect with music lovers. Dive deep into your listening habits and share your musical journey.
                            </p>
                            <div className="mt-8">
                                <button onClick={() => signIn("spotify")} className="bg-[#1DB954] text-black font-bold py-3 px-8 rounded-full text-lg hover:bg-[#1ed760] transition duration-300">Login with Spotify</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
                                <span className="block">Welcome back,</span>
                                <span className="block text-[#1DB954]">{session.user.name}!</span>
                            </h1>
                            <p className="text-xl text-gray-400">Ready to explore your latest stats?</p>
                            <div className="mt-8"><a href={`/user/${session.user.id}`} className="bg-[#1DB954] text-black font-bold py-3 px-8 rounded-full text-lg hover:bg-[#1ed760] transition duration-300">Go to Your Profile</a></div>
                        </>
                    )}
                </div>
            </section>
            <section className="py-20">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Why TuneStats?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard icon={<BarChart2 size={48} />} title="Detailed Stats" description="Get in-depth insights into your listening habits and favorite tracks." />
                        <FeatureCard icon={<Share2 size={48} />} title="Shareable Profile" description="Create a unique, shareable page showcasing your music taste." />
                        <FeatureCard icon={<UserPlus size={48} />} title="Connect with Friends" description="Find and add friends to compare music preferences." />
                    </div>
                </div>
            </section>
            {!session && (
                <section className="py-20 text-center">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to dive into your music stats?</h2>
                        <p className="text-xl mb-8 text-gray-400">Join TuneStats today and start exploring your Spotify data!</p>
                        <button onClick={() => signIn("spotify")} className="bg-[#1DB954] text-black font-bold py-3 px-8 rounded-full text-lg hover:bg-[#1ed760] transition duration-300">Get Started</button>
                    </div>
                </section>
            )}
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="bg-zinc-900 rounded-lg p-6 transition duration-300 hover:bg-zinc-800">
            <div className="flex justify-center mb-4 text-[#1DB954]">{icon}</div>
            <h3 className="text-xl font-semibold text-center mb-2">{title}</h3>
            <p className="text-gray-400 text-center">{description}</p>
        </div>
    );
}