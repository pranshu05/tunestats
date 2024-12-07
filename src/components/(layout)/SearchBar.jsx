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

    return (
        <form className="w-full sm:w-96">
            <div className="flex items-center justify-between gap-2">
                <input type="text" value={query} onChange={handleInputChange} placeholder="Search users by name" className="py-2 px-4 pr-10 bg-[#121212] rounded-full w-full focus:outline-none" />
                <Search className="w-5 h-5 text-gray-400" />
            </div>
        </form>
    );
}