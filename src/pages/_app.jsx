import { SessionProvider } from "next-auth/react";
import '../styles/globals.css';

export const metadata = {
    title: "Protify",
    description: "Display your Spotify activity in a unique way!",
};

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    return (
        <SessionProvider session={session}>
            <Component {...pageProps} />
        </SessionProvider>
    )
}