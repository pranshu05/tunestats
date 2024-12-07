import SearchBar from "@/components/(layout)/SearchBar";

export default function Navbar() {
    return (
        <nav className="bg-black p-3 flex item-center justify-center w-full">
            <SearchBar />
        </nav>
    );
}