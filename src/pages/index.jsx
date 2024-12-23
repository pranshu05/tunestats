import { useSession, signIn } from "next-auth/react";
import Navbar from "@/components/(layout)/NavBar";
import { useState, useEffect } from 'react';
import { BarChart2, Share2, UserPlus, Lock, Users } from 'lucide-react';

export default function Home() {
    const { data: session } = useSession();

    const [currentText, setCurrentText] = useState("Welcome to TuneStats 🎵");
    const texts = ["Discover Your Spotify Stats 🎶", "Share, Compare, and Explore Your Music Journey!", "Welcome to TuneStats 🎵"];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentText((prevText) => {
                const currentIndex = texts.indexOf(prevText);
                return texts[(currentIndex + 1) % texts.length];
            });
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />

            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center py-24 px-4 md:px-12 text-center">
                <div className="space-y-2 max-w-6xl flex flex-col md:flex-row items-center justify-between">
                    {/* Left Side Content */}
                    <div className="text-center md:text-center md:w-1/2 space-y-2">
                        {!session ? (
                            <>
                                <h1 className="text-4xl md:text-7xl font-bold tracking-tighter bg-gradient-to-r from-white to-green-500 bg-clip-text text-transparent animate-fade-in">
                                    {currentText}
                                </h1>
                                <p className="text-xl md:text-2xl text-gray-400 animate-fade-in-delay">
                                    Track your Spotify stats, share profiles, and compare your music taste with friends.
                                </p>
                                <div
                                    onClick={() => signIn("spotify")}
                                    className="md:mx-auto cursor-pointer bg-[#1DB954] text-black font-bold py-3 px-6 text-base lg:text-lg w-fit rounded-full mx-auto md:mx-0 animate-fade-in-delay"
                                >
                                    Login with Spotify
                                </div>
                            </>
                        ) : (
                            <>
                                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-gradient-to-r from-white to-green-500 bg-clip-text text-transparent animate-fade-in">
                                    Welcome back, {session.user.name}!
                                </h1>
                                <p className="text-xl md:text-2xl text-gray-400 animate-fade-in-delay">
                                    Explore your latest stats and share them with friends!
                                </p>
                                <div className="cursor-pointer bg-[#1DB954] text-black font-bold py-3 px-6 text-base lg:text-lg w-fit rounded-md mx-auto md:mx-0 animate-fade-in-delay">
                                    <Link href={`/user/${session.user.id}`}>Go to Your Profile</Link>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Right Side Image */}
                    <div className="mt-8 md:mt-0 md:w-1/2 flex justify-center">
                        <div className="relative w-full max-w-lg overflow-hidden">
                            <img
                                src="/home.jpg"
                                alt="TuneStats"
                                className="w-full object-contain rounded-lg transform transition-all duration-500 ease-in-out hover:scale-110 hover:translate-y-2"
                                style={{ maxHeight: '100%', maxWidth: '100%' }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Section */}
            <section className="py-20 px-6 md:px-12">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-green-500 mb-12">
                        Why TuneStats?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<BarChart2 size={48} />}
                            title="Spotify Stats"
                            description="Get detailed insights into your listening habits with personalized charts."
                        />
                        <FeatureCard
                            icon={<Share2 size={48} />}
                            title="Share Profiles"
                            description="Create and share your personalized profile showcasing your top tracks and artists."
                        />
                        <FeatureCard
                            icon={<UserPlus size={48} />}
                            title="Connect with Friends"
                            description="Find and add friends to compare music tastes and explore their preferences."
                        />
                    </div>

                    <div className="flex justify-center items-center gap-8 mt-8" style={{ width: '1152px', height: '257px' }}>
                        <div className="flex justify-center w-[362px] h-[257px]">
                            <FeatureCard
                                icon={<Lock size={48} />}
                                title="Privacy Control"
                                description="Set your profile as public or private based on your preference."
                            />
                        </div>
                        <div className="flex justify-center w-[362px] h-[257px]">
                            <FeatureCard
                                icon={<Users size={48} />}
                                title="Friend Comparison"
                                description="Compare your Spotify stats with friends through interactive charts."
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            {!session && (
                <section className="py-20 text-center">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Ready to dive into your music stats?
                        </h2>
                        <p className="text-xl mb-8 text-gray-400">
                            Join TuneStats today and explore your Spotify data like never before!
                        </p>
                        <div
                            onClick={() => signIn("spotify")}
                            className="cursor-pointer bg-[#1DB954] text-black font-bold py-3 px-6 text-sm lg:text-base w-fit rounded-full mx-auto"
                        >
                            Get Started
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="p-6 md:px-12 bg-black text-gray-400">
                <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 text-sm">
                    <FooterSection
                        title="TuneStats 🎵"
                        content="Track your Spotify stats, share profiles, and compare music tastes with friends."
                        extra="Music data, album covers, and song previews are provided by Spotify. Spotify is a trademark of Spotify AB."
                    />
                    <FooterSection title="TOOLS" links={["Roast my Spotify 🔥"]} />
                    <FooterSection
                        title="GLOBAL"
                        links={[
                            "Most Followed Artists",
                            "Most Popular Artists",
                            "Most Popular Songs",
                            "Most Popular Albums",
                        ]}
                    />
                    <FooterSection
                        title="MORE"
                        links={["Blog", "Terms of Service", "Privacy Policy", "Permissions"]}
                    />
                </div>
                <div className="mt-12 border-t border-gray-700 pt-6 text-center">
                    <p className="text-gray-500 font-medium">
                        &copy; {currentYear} TuneStats. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="relative group border border-green-500 text-white p-8 rounded-lg transition-transform duration-300 transform hover:scale-105 hover:shadow-lg bg-gradient-to-r from-black via-gray-800 to-black">
            <div className="flex items-center justify-center mb-6 text-green-400">
                <div className="transition-transform duration-300 transform group-hover:scale-110">{icon}</div>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-center group-hover:text-green-500">{title}</h3>
            <p className="text-center text-gray-400 group-hover:text-gray-200">{description}</p>
        </div>
    );
}

function FooterSection({ title, content, links, extra }) {
    return (
        <div>
            <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
            {content && <p>{content}</p>}
            {extra && <p className="mt-4">{extra}</p>}
            {links && (
                <ul className="space-y-3">
                    {links.map((link, idx) => (
                        <li key={idx}>
                            <a href="#" className="hover:text-white transition-colors">{link}</a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
