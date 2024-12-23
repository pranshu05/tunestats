import Link from 'next/link';
import SearchBar from "@/components/(layout)/SearchBar";
import { AlignJustify } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);

    return (
        <nav className="bg-black border-b border-zinc-900 p-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="text-[#1DB954] font-semibold text-xl"><span>TuneStats</span></Link>
                <div className="sm:hidden"><button onClick={toggleMenu}className="text-[#1DB954] focus:outline-none"aria-label="Toggle Menu"><AlignJustify /></button></div>
                <div className="hidden sm:flex items-center"><SearchBar /></div>
            </div>
            {isMenuOpen && (
                <div className="sm:hidden mt-2 p-3 rounded shadow-lg"><SearchBar /></div>
            )}
        </nav>
    );
}