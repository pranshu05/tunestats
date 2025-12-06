import { Providers } from "@/app/providers";
import { Inter } from 'next/font/google';
import Navbar from "@/components/(layout)/Navbar";
import Footer from "@/components/(layout)/Footer";
import "@/app/globals.css";
import type { Metadata } from 'next';

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
});

export const metadata: Metadata = {
    title: 'TuneStats - Spotify Analytics for Music Lovers',
    description: 'Discover insights about your music listening habits. Track your top artists, tracks, and albums. Compare your music taste with friends.',
    keywords: ['spotify', 'music', 'analytics', 'statistics', 'listening history'],
    authors: [{ name: 'TuneStats' }],
    openGraph: {
        title: 'TuneStats',
        description: 'Spotify analytics for music lovers',
        type: 'website',
    },
    viewport: 'width=device-width, initial-scale=1',
    themeColor: '#c38e70',
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en" className={inter.variable}>
            <body className={`${inter.className} antialiased min-h-screen flex flex-col bg-[#121212]`}>
                <Providers>
                    <Navbar />
                    <main className="flex-1">
                        {children}
                    </main>
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}