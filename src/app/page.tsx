"use client"
import { useSession } from "next-auth/react"
import LoadingScreen from "@/components/(home)/LoadingScreen"
import HeroSection from "@/components/(home)/HeroSection"
import FeaturesSection from "@/components/(home)/FeaturesSection"
import HowItWorksSection from "@/components/(home)/HowItWorks"
import CTASection from "@/components/(home)/CTA"

export default function HomePage() {
    const { data: session, status } = useSession()

    if (status === "loading") {
        return <LoadingScreen />
    }

    return (
        <div>
            <HeroSection session={session} />
            <FeaturesSection />
            <HowItWorksSection />
            <CTASection session={session} />
        </div>
    )
}