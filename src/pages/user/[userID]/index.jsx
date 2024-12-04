import { useRouter } from "next/router";
import { SpotifyPlayer } from "@/components/SpotifyPlayer";

export default function UserPage() {
    const router = useRouter();
    const { userID } = router.query;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <SpotifyPlayer userID={userID} />
        </div>
    );
}