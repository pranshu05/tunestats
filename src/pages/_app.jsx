import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/(layout)/NavBar";
import Footer from "@/components/(layout)/Footer";
import '../styles/globals.css';

export const metadata = {
    title: "TuneStats",
    description: "Display your Spotify activity in a unique way!",
};

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    return (
        <SessionProvider session={session}>
            <div className="min-h-screen bg-black text-white">
                <Navbar />
                <Component {...pageProps} />
                {/* <Footer /> */}
            </div>
        </SessionProvider>
    )
}