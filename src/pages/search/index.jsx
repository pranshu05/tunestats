import { useState, useEffect } from "react";
import { db } from "@/lib/firebaseConfig";
import { collection, query, orderBy, startAt, endAt, getDocs, limit } from "firebase/firestore";
import UserSearchProfile from "@/components/(search)/UserSearchProfile";
import { Loader2, UserX } from 'lucide-react';
import debounce from "lodash.debounce"; // Use debounce to optimize search calls

const BATCH_SIZE = 20;

export default function Search() {
    const [searchQuery, setSearchQuery] = useState(""); // Local state for the search query
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastVisible, setLastVisible] = useState(null);

    const fetchUsers = async (queryText) => {
        if (!queryText) {
            setUsers([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        try {
            const usersRef = collection(db, "users");

            const firestoreQuery = query(
                usersRef,
                orderBy("name"),
                startAt(queryText),
                endAt(queryText + "\uf8ff"),
                limit(BATCH_SIZE)
            );

            const querySnapshot = await getDocs(firestoreQuery);

            const fetchedUsers = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setUsers(fetchedUsers);
            setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    // Debounce the fetchUsers function to avoid excessive API calls
    const debouncedFetchUsers = debounce((queryText) => fetchUsers(queryText), 300);

    // Handle search input change
    const handleSearchChange = (event) => {
        const queryText = event.target.value;
        setSearchQuery(queryText);
        debouncedFetchUsers(queryText); // Call debounced fetchUsers function
    };

    return (
        <div className="max-w-7xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Search Users</h1>
            <div className="mb-4">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search by name..."
                    className="w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
            </div>
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-12 h-12 animate-spin text-[#1DB954]" />
                </div>
            ) : users.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {users.map((user) => (
                        <UserSearchProfile key={user.id} user={user} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-64">
                    <UserX className="w-16 h-16 mb-4 text-zinc-600" />
                    <p className="text-xl text-zinc-400">No users found</p>
                    <p className="mt-2 text-zinc-500">Try adjusting your search terms</p>
                </div>
            )}
        </div>
    );
}
