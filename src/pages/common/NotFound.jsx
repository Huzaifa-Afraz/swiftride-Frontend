import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-9xl font-extrabold text-indigo-100">404</h1>
      <p className="text-2xl font-bold text-gray-800 -mt-12 mb-4">Page Not Found</p>
      <p className="text-gray-500 max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/" className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;