import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, BookOpen, Users } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KYC Card */}
        <Link to="/admin/kyc" className="bg-white p-8 rounded-xl shadow-sm border hover:shadow-md transition group">
          <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold mb-2">KYC Requests</h2>
          <p className="text-gray-500">Review and approve pending identity documents from hosts and showrooms.</p>
        </Link>

        {/* Bookings Card */}
        <Link to="/admin/bookings" className="bg-white p-8 rounded-xl shadow-sm border hover:shadow-md transition group">
          <div className="w-14 h-14 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white transition">
            <BookOpen className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold mb-2">All Bookings</h2>
          <p className="text-gray-500">Monitor all platform bookings, statuses, and payment disputes.</p>
        </Link>

        {/* Users Card (Placeholder for now) */}
        <div className="bg-gray-50 p-8 rounded-xl border border-dashed border-gray-300 opacity-60">
          <div className="w-14 h-14 bg-gray-200 text-gray-400 rounded-lg flex items-center justify-center mb-4">
            <Users className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold mb-2 text-gray-400">User Management</h2>
          <p className="text-gray-400">Coming soon.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;