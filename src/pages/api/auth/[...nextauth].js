import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

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
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    await updateDoc(userRef, {
                        email: user.email || "unknown",
                        name: user.name || "unknown",
                        spotifyId: user.id || "unknown",
                        image: user.image || "unknown",
                        accessToken: account.access_token || "unknown",
                        refreshToken: account.refresh_token || "unknown",
                        lastLogin: new Date(),
                    });
                } else {
                    await setDoc(userRef, {
                        email: user.email || "unknown",
                        name: user.name || "unknown",
                        spotifyId: user.id || "unknown",
                        image: user.image || "unknown",
                        accessToken: account.access_token || "unknown",
                        refreshToken: account.refresh_token || "unknown",
                        lastLogin: new Date(),
                    });
                }
            }
            return true;
        },
        async session({ session, token }) {
            session.user.id = token.sub;
            return session;
        },
    },
});