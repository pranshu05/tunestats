import { Providers } from "@/app/providers";
import { Inter } from 'next/font/google';
import Navbar from "@/components/(layout)/Navbar";
import Footer from "@/components/(layout)/Footer";
import "@/app/globals.css";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'TuneStats',
    description: 'Spotify analytics for music lovers',
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
            <body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
                <Providers>
                    <Navbar />
                    <div className="flex-1">{children}</div>
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}