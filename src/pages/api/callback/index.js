import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default async function handler(req, res) {
    const { code } = req.query;
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const redirectUri = `${process.env.BASE_URL}/api/callback`;

    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            grant_type: "authorization_code",
            code,
            redirect_uri: redirectUri,
            client_id: clientId,
            client_secret: clientSecret,
        }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenResponse.ok) {
        const { access_token, refresh_token } = tokenData;

        // Fetch user details from Spotify using the access token
        const userInfoResponse = await fetch("https://api.spotify.com/v1/me", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        const userInfo = await userInfoResponse.json();

        if (userInfoResponse.ok) {
            const userID = userInfo.id; // Use the Spotify user ID
            await setDoc(doc(db, "users", userID), { access_token, refresh_token });

            res.redirect(`/user/${userID}`);
        } else {
            res.status(400).json({ error: "Failed to fetch user info from Spotify" });
        }
    } else {
        res.status(400).json({ error: "Failed to authenticate with Spotify" });
    }
}
