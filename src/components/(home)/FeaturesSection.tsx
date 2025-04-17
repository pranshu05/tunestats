import { useState } from "react"
import { User, Users, BarChart3, MessageSquare, ChevronRight } from "lucide-react"
import FeatureTab from "./FeatureTab"

export default function FeaturesSection() {
    const [activeTab, setActiveTab] = useState("discover")

    return (
        <section id="features" className="px-4 lg:px-8 py-16 lg:py-24">
            <div className="text-center mb-12">
                <h2 className="text-2xl lg:text-4xl font-bold text-[#e6d2c0] mb-4">Powerful Features</h2>
                <p className="text-[#a18072] max-w-2xl mx-auto">Explore everything TuneStats has to offer to enhance your music experience</p>
            </div>
            <div className="bg-[#1e1814] border border-[#3d2e23] rounded-xl overflow-hidden shadow-lg">
                <div className="flex flex-wrap border-b border-[#3d2e23]">
                    <FeatureTab id="discover" label="Discover" isActive={activeTab === "discover"} onClick={() => setActiveTab("discover")} />
                    <FeatureTab id="connect" label="Connect" isActive={activeTab === "connect"} onClick={() => setActiveTab("connect")} />
                    <FeatureTab id="explore" label="Explore" isActive={activeTab === "explore"} onClick={() => setActiveTab("explore")} />
                    <FeatureTab id="engage" label="Engage" isActive={activeTab === "engage"} onClick={() => setActiveTab("engage")} />
                </div>
                <div className="p-6 lg:p-8">
                    {activeTab === "discover" && (
                        <FeatureContent
                            icon={<User className="text-[#c38e70]" />}
                            title="Personal Music Profile"
                            description="Get detailed insights into your listening habits with personalized statistics, top tracks, and favorite artists. Your profile updates in real-time as you listen to more music."
                            listItems={["View your top tracks by time period (week, month, year)", "Discover your most listened to artists", "Track your listening history over time"]} imageAlt="User Profile" rotation={1} />
                    )}
                    {activeTab === "connect" && (
                        <FeatureContent
                            icon={<Users className="text-[#c38e70]" />}
                            title="Friend Comparison"
                            description="Connect with friends and discover your musical compatibility. See shared artists, tracks, and get a compatibility score based on your listening habits."
                            listItems={["Get detailed compatibility scores with friends", "Discover shared favorite artists and tracks", "Find new music through friends' recommendations"]}
                            imageAlt="Friend Comparison"
                            rotation={-1}
                        />
                    )}
                    {activeTab === "explore" && (
                        <FeatureContent
                            icon={<BarChart3 className="text-[#c38e70]" />}
                            title="Detailed Pages & Charts"
                            description="Explore detailed pages for tracks, artists, and albums. View global charts, popularity metrics, and discover new music based on community trends."
                            listItems={["Detailed artist pages with albums and top tracks", "Album pages with track listings and artist info", "Track pages with playback stats and related content"]}
                            imageAlt="Detailed Pages"
                            rotation={1}
                        />
                    )}
                    {activeTab === "engage" && (
                        <FeatureContent
                            icon={<MessageSquare className="text-[#c38e70]" />}
                            title="Community Engagement"
                            description="Rate and comment on tracks, albums, and artists. Share your opinions and see what others think about your favorite music."
                            listItems={["Rate tracks, albums, and artists", "Leave comments and join discussions", "Share your profile with friends"]}
                            imageAlt="Community Engagement"
                            rotation={-1}
                        />
                    )}
                </div>
            </div>
        </section>
    )
}

type FeatureContentProps = {
    icon: React.ReactNode
    title: string
    description: string
    listItems: string[]
    imageAlt: string
    rotation: number
}

function FeatureContent({
    icon,
    title,
    description,
    listItems
}: FeatureContentProps) {
    return (
        <div>
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#2a211c] rounded-full flex items-center justify-center">{icon}</div>
                <h3 className="text-xl font-bold text-[#e6d2c0]">{title}</h3>
            </div>
            <p className="text-[#a18072] mb-6">{description}</p>
            <ul className="space-y-3">
                {listItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                        <ChevronRight className="text-[#c38e70] mt-1 flex-shrink-0" size={18} />
                        <span className="text-[#e6d2c0]">{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}