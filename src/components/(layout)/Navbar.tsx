'use client';
import Link from 'next/link';
import AuthButton from '@/components/(layout)/AuthButton';

export default function Navbar() {
    return (
        <nav className="p-3 border-b border-white flex justify-between items-center">
            <Link href="/" className="text-3xl font-extrabold tracking-tight">TuneStats</Link>
            <AuthButton />
        </nav>
    );
}