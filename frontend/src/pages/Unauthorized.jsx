import { Link } from "react-router-dom";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline"; // Tailwind Heroicons

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md animate-fadeIn">
        <ExclamationTriangleIcon className="w-16 h-16 text-red-600 mx-auto mb-4 animate-pulse" />
        <h1 className="text-4xl font-bold mb-4 text-red-600">Unauthorized</h1>
        <p className="mb-6 text-gray-700">
          You do not have permission to access this page.
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
