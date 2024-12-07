import { useState } from "react";
import { useRouter } from "next/router";

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
        <form className="w-11/12 md:w-3/4 lg:w-1/2">
            <input type="text" value={query} onChange={handleInputChange} placeholder="Search users by name" className="py-3 px-5 bg-[#121212] rounded-full w-full" />
        </form>
    );
}