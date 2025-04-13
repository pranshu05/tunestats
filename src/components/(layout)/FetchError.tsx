import { CiWarning } from "react-icons/ci";

export default function FetchError() {
    return (
        <div className="flex flex-col items-center text-center p-8">
            <div className="text-4xl"><CiWarning /></div>
            <h2 className="mt-4 text-lg font-semibold">Something went wrong</h2>
            <p className="mt-2 text-gray-600">Error fetching the data. Please try again later.</p>
        </div>
    );
}