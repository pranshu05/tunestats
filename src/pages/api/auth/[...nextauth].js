import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { db } from "@/lib/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export default NextAuth({
    providers: [
        SpotifyProvider({
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            authorization: {
                params: {
                    scope: [
                        "user-read-currently-playing",
                        "user-read-playback-state",
                        "user-read-recently-played",
                        "user-top-read",
                        "user-library-read",
                        "user-read-email",
                    ].join(" "),
                },
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account.provider === "spotify") {
                const userRef = doc(db, "users", user.id);

                const userData = {
                    email: user.email || "unknown_email@example.com",
                    name: user.name || "Unknown Name",
                    spotifyId: account.id || null,
                    image: user.image || null,
                    lastLogin: new Date().toISOString(),
                };

                try {
                    await setDoc(userRef, userData, { merge: true });
                    return true;
                } catch (error) {
                    return false;
                }
            }
            return true;
        },
        async session({ session, token }) {
            session.user.id = token.sub;
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
});