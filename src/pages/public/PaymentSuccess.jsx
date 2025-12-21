import React from 'react';
import { Link } from 'react-router-dom';

const PaymentSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
        {/* Green Check Icon */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Your booking has been confirmed. You will receive a confirmation email shortly.
        </p>

        <Link 
          to="/bookings" 
          className="block w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          View My Bookings
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;