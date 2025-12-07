import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 bg-gray-50">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <ShieldAlert className="w-12 h-12" />
        </div>

        {/* Text Content */}
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-500 text-lg mb-8">
          You do not have the necessary permissions to view this page. If you believe this is an error, please contact support.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-white hover:shadow-sm transition"
          >
            <ArrowLeft className="w-5 h-5" /> Go Back
          </button>
          
          <Link 
            to="/" 
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition"
          >
            <Home className="w-5 h-5" /> Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;