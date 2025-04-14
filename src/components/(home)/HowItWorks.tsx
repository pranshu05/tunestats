import { Headphones, User, Share2 } from "lucide-react"

export default function HowItWorksSection() {
    return (
        <section className="bg-[#1e1814] border-y border-[#3d2e23]">
            <div className="px-4 lg:px-8 py-16 lg:py-24">
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-[#e6d2c0] mb-4">How It Works</h2>
                    <p className="text-[#a18072] max-w-2xl mx-auto">Get started with TuneStats in three simple steps</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <StepCard
                        number={1}
                        icon={<Headphones className="text-[#c38e70]" size={32} />}
                        title="Connect Your Spotify"
                        description="Sign in with your Spotify account to allow TuneStats to access your listening data."
                    />
                    <StepCard
                        number={2}
                        icon={<User className="text-[#c38e70]" size={32} />}
                        title="Explore Your Profile"
                        description="Discover your listening habits, top tracks, and favorite artists on your personalized profile."
                    />
                    <StepCard
                        number={3}
                        icon={<Share2 className="text-[#c38e70]" size={32} />}
                        title="Connect With Friends"
                        description="Add friends, compare music tastes, and discover new music through your connections."
                    />
                </div>
            </div>
        </section>
    )
}

type StepCardProps = {
    number: number
    icon: React.ReactNode
    title: string
    description: string
}

function StepCard({ number, icon, title, description }: StepCardProps) {
    return (
        <div className="bg-[#2a211c] border border-[#3d2e23] rounded-lg p-6 relative">
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#c38e70] rounded-full flex items-center justify-center text-[#1e1814] font-bold text-xl">{number}</div>
            <div className="pt-6">
                <div className="w-16 h-16 bg-[#1e1814] rounded-full flex items-center justify-center mb-4 mx-auto">{icon}</div>
                <h3 className="text-xl font-bold text-[#e6d2c0] text-center mb-3">{title}</h3>
                <p className="text-[#a18072] text-center">{description}</p>
            </div>
        </div>
    )
}