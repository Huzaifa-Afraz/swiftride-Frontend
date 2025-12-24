import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { Car, Calendar, Shield, Search } from 'lucide-react';

const CustomerOverview = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.fullName}! 👋</h1>
        <p className="text-gray-500">Here is what's happening with your account.</p>
      </div>

      {/* 1. Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-indigo-100 text-sm font-medium mb-1">Account Status</p>
            <h3 className="text-2xl font-bold flex items-center gap-2">
              
              {user.isVerified? 'Verified' : 'Pending'}
              {user.isVerified && <Shield className="w-5 h-5" />}
            </h3>
          </div>
          <Shield className="absolute -bottom-4 -right-4 w-32 h-32 text-indigo-500 opacity-20" />
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Ready to drive?</p>
              <h3 className="text-xl font-bold text-gray-800 mt-1">Book a Car</h3>
            </div>
            <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
              <Car className="w-6 h-6" />
            </div>
          </div>
          <Link to="/search" className="mt-4 text-sm font-bold text-indigo-600 hover:underline">Browse Fleet &rarr;</Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">My Activity</p>
              <h3 className="text-xl font-bold text-gray-800 mt-1">Trip History</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-xl text-green-600">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <Link to="/dashboard/bookings" className="mt-4 text-sm font-bold text-indigo-600 hover:underline">View All &rarr;</Link>
        </div>
      </div>

      {/* 2. Action Banner */}
      {!user.isVerified && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-full text-orange-600">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Complete your Verification</h3>
              <p className="text-sm text-gray-600">You need to upload your Driving License before you can book a car.</p>
            </div>
          </div>
          <Link to="/dashboard/kyc" className="px-6 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition whitespace-nowrap">
            Verify Now
          </Link>
        </div>
      )}
    </div>
  );
};

export default CustomerOverview;