import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Session } from "next-auth"

type CTASectionProps = {
    session: Session | null
}

export default function CTASection({ session }: CTASectionProps) {
    return (
        <section className="border-y border-[#3d2e23]">
            <div className="px-4 py-16 lg:py-24 text-center">
                <h2 className="text-3xl lg:text-4xl font-bold text-[#e6d2c0] mb-6">Ready to Discover Your Music DNA?</h2>
                <p className="text-[#a18072] max-w-2xl mx-auto mb-8">Join thousands of music lovers who are exploring their listening habits and connecting with friends through TuneStats.</p>
                {session ? (
                    <Link href={session.user?.id ? `/user/${session.user.id}` : "#"} className="px-8 py-4 bg-[#c38e70] text-[#1e1814] font-bold rounded-lg hover:bg-opacity-90 transition-all inline-flex items-center gap-2 text-lg">Go to Your Profile <ArrowRight size={20} /></Link>
                ) : (
                    <Link href="/api/auth/signin" className="px-8 py-4 bg-[#c38e70] text-[#1e1814] font-bold rounded-lg hover:bg-opacity-90 transition-all inline-flex items-center gap-2 text-lg">Get Started with Spotify <ArrowRight size={20} /></Link>
                )}
            </div>
        </section>
    )
}