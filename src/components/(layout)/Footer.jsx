export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-zinc-900">
            <div className="max-w-7xl mx-auto p-4 text-center text-gray-400">
                <p>&copy; {currentYear} TuneStats. All rights reserved.</p>
            </div>
        </footer>
    )
}