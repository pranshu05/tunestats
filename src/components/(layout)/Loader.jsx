import { Loader2 } from 'lucide-react';

export default function Loader() {
    return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 animate-spin text-[#1DB954]" />
        </div>
    );
}