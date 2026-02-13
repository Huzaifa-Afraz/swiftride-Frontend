import { RefreshCcw } from "lucide-react";

const Loader = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <RefreshCcw className="w-12 h-12 text-gray-500 animate-spin" />
        </div>
    );
};

export default Loader;  