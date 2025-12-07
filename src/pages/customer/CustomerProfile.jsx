import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { User, Shield, CreditCard, CheckCircle, XCircle } from 'lucide-react';

const CustomerProfile = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header Card */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border mb-8 flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-4xl font-bold">
          {user.fullName?.charAt(0) || <User />}
        </div>
        <div className="text-center md:text-left flex-grow">
          <h1 className="text-3xl font-bold text-gray-900">{user.fullName}</h1>
          <p className="text-gray-500">{user.email}</p>
          <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-xs font-bold uppercase text-gray-600">
            Role: {user.role}
          </div>
        </div>
        <div>
          <button onClick={logout} className="text-red-500 font-medium hover:underline">
            Log Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* KYC Status Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold">Identity Verification</h2>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600 text-sm mb-4">
              To ensure safety, all drivers must provide a valid ID and Driving License.
            </p>
            
            {/* Logic: If user has 'isVerified' or similar field. 
                Since backend structure isn't fully known for user obj, we default to showing the status or button */}
            {user.isVerified ? (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg border border-green-100">
                <CheckCircle className="w-5 h-5" />
                <span className="font-bold">Verified Account</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-orange-600 bg-orange-50 p-3 rounded-lg border border-orange-100 mb-4">
                <AlertIcon />
                <span className="font-bold">Verification Pending / Required</span>
              </div>
            )}
          </div>

          {!user.isVerified && (
            <Link 
              to="/kyc/submit" 
              className="block w-full text-center bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 transition"
            >
              Submit Documents
            </Link>
          )}
        </div>

        {/* Quick Links / Invoices Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <CreditCard className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold">Billing & History</h2>
          </div>
          
          <ul className="space-y-3">
            <li>
              <Link to="/my-bookings" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition group">
                <span className="font-medium text-gray-700">View Booking History</span>
                <span className="text-gray-400 group-hover:text-indigo-600">&rarr;</span>
              </Link>
            </li>
            <li>
               {/* This is a visual placeholder since we handle invoices in MyBookings */}
              <Link to="/my-bookings" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition group">
                <span className="font-medium text-gray-700">Download Invoices</span>
                <span className="text-gray-400 group-hover:text-indigo-600">&rarr;</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
  </svg>
);

export default CustomerProfile;