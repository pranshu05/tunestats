export default function LoginPage() {
    const handleSpotifyLogin = async () => {
        const response = await fetch("/api/login");
        const { loginUrl } = await response.json();
        window.location.href = loginUrl;
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="text-center space-y-6">
                <h1 className="text-3xl font-bold">Log In with Spotify</h1>
                <button onClick={handleSpotifyLogin} className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-400">Log In with Spotify</button>
            </div>
        </div>
    );
}