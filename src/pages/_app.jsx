import '../styles/globals.css';
import { SessionProvider } from "next-auth/react";

export const metadata = {
    title: "Protify",
    description: "Display your Spotify activity in a unique way!",
};

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    return (
        <SessionProvider session={session}>
            <Component {...pageProps} />
        </SessionProvider>
    );
}