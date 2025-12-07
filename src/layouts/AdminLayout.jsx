import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { LayoutDashboard, Users, Car, FileText, LogOut, Shield, Building2 } from 'lucide-react'; // Added Building2
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
            <FileText className="w-5 h-5" /> KYC Requests
          </Link>
          <Link to="/admin/bookings" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive('bookings')}`}>
            <Car className="w-5 h-5" /> All Bookings
          </Link>
          
          <div className="pt-4 pb-2 text-xs font-bold text-indigo-400 uppercase px-4">User Management</div>
          
          <Link to="/admin/users" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive('users')}`}>
            <Users className="w-5 h-5" /> Customers
          </Link>
          <Link to="/admin/hosts" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive('hosts')}`}>
            <Car className="w-5 h-5" /> Hosts
          </Link>
          <Link to="/admin/showrooms" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive('showrooms')}`}>
            <Building2 className="w-5 h-5" /> Showrooms
          </Link>
        </nav>

        <div className="p-6 border-t border-indigo-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-indigo-300 hover:text-white transition w-full"
          >
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