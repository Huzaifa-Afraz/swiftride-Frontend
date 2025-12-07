import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { LayoutDashboard, Users, Car, FileText, LogOut, Shield } from 'lucide-react';
import Swal from 'sweetalert2';

const AdminLayout = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const handleLogout = () => {
    Swal.fire({
      title: 'Admin Logout',
      text: "End your admin session?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Logout'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      }
    });
  };

  const isActive = (path) => location.pathname.includes(path) ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-800';

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-indigo-900 text-white flex flex-col fixed h-full">
        <div className="p-6 border-b border-indigo-800">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="w-8 h-8 text-indigo-400" />
            Admin
          </h1>
        </div>

        <nav className="flex-grow p-4 space-y-2">
          <Link to="/admin/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive('dashboard')}`}>
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link to="/admin/kyc" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive('kyc')}`}>
            <Users className="w-5 h-5" /> KYC Requests
          </Link>
          <Link to="/admin/bookings" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive('bookings')}`}>
            <FileText className="w-5 h-5" /> All Bookings
          </Link>
          {/* Placeholder for future car management */}
          <div className="flex items-center gap-3 px-4 py-3 text-indigo-400 cursor-not-allowed opacity-50">
            <Car className="w-5 h-5" /> Car Management
          </div>
        </nav>

        <div className="p-6 border-t border-indigo-800">
          <button onClick={handleLogout} className="flex items-center gap-2 text-indigo-300 hover:text-white transition">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;