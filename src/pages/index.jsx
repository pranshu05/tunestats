import { useRouter } from "next/router";

export default function LandingPage() {
    const router = useRouter();

    const handleLoginRedirect = () => {
        router.push("/login");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="text-center space-y-6">
                <h1 className="text-4xl font-bold">Welcome to Protify!</h1>
                <p className="text-lg">View and share your current Spotify activity!</p>
                <button onClick={handleLoginRedirect} className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-400">Get Started</button>
            </div>
        </div>
    );
}