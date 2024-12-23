import { useState } from "react";
import { useRouter } from "next/router";
import { Search } from 'lucide-react';

export default function SearchBar() {
    const [query, setQuery] = useState("");
    const router = useRouter();

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.trim()) {
            router.push(`/search?query=${encodeURIComponent(value)}`, undefined, { shallow: true });
        } else {
            router.push(`/search`, undefined, { shallow: true });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) { router.push(`/search?query=${encodeURIComponent(query)}`); }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="relative">
                <input type="text" value={query} onChange={handleInputChange} placeholder="Search users by name" className="w-full py-2 px-4 pr-10 bg-zinc-800 text-white placeholder-zinc-400 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1DB954] transition duration-300" />
                <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-[#1DB954] transition duration-300"><Search className="w-5 h-5" /></button>
            </div>
        </form>
    );
}