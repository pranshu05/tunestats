import { ImSpinner2 } from "react-icons/im";

export default function FetchLoader() {
    return (
        <div className="flex items-center justify-center min-h-24">
            <ImSpinner2 className="animate-spin text-gray-500 text-4xl" />
        </div>
    );
};