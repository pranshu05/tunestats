import { useState } from 'react';
import { useRouter } from 'next/router';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) { router.push(`/search?query=${query}`); }
    };

    return (
        <form onSubmit={handleSearch} className="w-11/12 md:w-3/4 lg:w-1/2">
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search users by name" className="py-3 px-5 bg-[#121212] rounded-full w-full" />
        </form>
    );
}