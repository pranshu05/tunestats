import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import Navbar from "@/components/(layout)/NavBar";
import UserSearchProfile from "@/components/(search)/UserSearchProfile";

export default function Search() {
    const router = useRouter();
    const { query: searchQuery } = router.query;
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!searchQuery) return;

        const fetchUsers = async () => {
            setLoading(true);
            try {
                const usersRef = collection(db, "users");
                const querySnapshot = await getDocs(usersRef);

                const filteredUsers = querySnapshot.docs
                    .map((doc) => doc.data())
                    .filter((user) =>
                        user.name.toLowerCase().includes(searchQuery.toLowerCase())
                    );

                setUsers(filteredUsers);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [searchQuery]);

    return (
        <div className="w-full min-h-screen">
            <Navbar />
            <div className="w-full p-4">
                <h2 className="text-2xl font-bold mb-6">Search Results</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : users.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {users.map((user) => (<UserSearchProfile key={user.spotifyId} user={user} />))}
                    </div>
                ) : (
                    <p>No users found</p>
                )}
            </div>
        </div>
    );
}