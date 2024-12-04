export default function handler(req, res) {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const redirectUri = `${process.env.BASE_URL}/api/callback`;
    const scopes = [
        "user-read-currently-playing",
        "user-read-playback-state",
        "user-read-private",
    ];

    const loginUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(
        scopes.join(" ")
    )}&redirect_uri=${encodeURIComponent(redirectUri)}`;

    res.status(200).json({ loginUrl });
}