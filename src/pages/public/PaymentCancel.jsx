import React from 'react';
import { Link } from 'react-router-dom';

const PaymentCancel = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
        {/* Red X Icon */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
          <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Cancelled</h1>
        <p className="text-gray-600 mb-6">
          You cancelled the process. No charges were made.
        </p>

        <Link 
          to="/bookings" 
          className="block w-full bg-gray-600 text-white font-semibold py-2 px-4 rounded hover:bg-gray-700 transition"
        >
          Return to Bookings
        </Link>
      </div>
    </div>
  );
};

export default PaymentCancel;