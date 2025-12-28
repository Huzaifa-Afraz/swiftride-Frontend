import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { 
  LayoutDashboard, Car, Calendar, User, CreditCard, LogOut, 
  Menu, X, Shield, Plus, Home, MessageSquare 
} from 'lucide-react';
import Swal from 'sweetalert2';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: 'Sign Out?',
      text: "You will be redirected to the login page.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sign Out'
    }).then((result) => {
      if (result.isConfirmed) logout();
    });
  };

  // Helper to check active route
  const isActive = (path) => location.pathname === path ? "bg-indigo-600 text-white shadow-md" : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600";

  const SidebarLink = ({ to, icon, label }) => (
    <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${isActive(to)}`}>
      {icon} <span className="text-sm">{label}</span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      
      {/* 1. SIDEBAR (Desktop: Fixed, Mobile: Drawer) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <div className="h-full flex flex-col">
          
          {/* Logo Area */}
          <div className="h-20 flex items-center px-8 border-b border-gray-50">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Car className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-gray-800 tracking-tight">SwiftRide</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <div className="mb-6 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Main Menu</div>
            
            {/* COMMON LINKS */}
            <SidebarLink to="/dashboard" icon={<LayoutDashboard className="w-5 h-5"/>} label="Overview" />
            <SidebarLink to="/dashboard/inbox" icon={<MessageSquare className="w-5 h-5"/>} label="Messages" />
            <SidebarLink to="/dashboard/profile" icon={<User className="w-5 h-5"/>} label="My Profile" />

            {/* CUSTOMER LINKS */}
            {user.role === 'customer' && (
              <>
                <SidebarLink to="/dashboard/bookings" icon={<Calendar className="w-5 h-5"/>} label="My Trips" />
                <SidebarLink to="/search" icon={<Car className="w-5 h-5"/>} label="Book a Car" />
              </>
            )}

            {/* HOST / SHOWROOM LINKS */}
            {(user.role === 'host' || user.role === 'showroom') && (
              <>
                <SidebarLink to="/dashboard/fleet" icon={<Car className="w-5 h-5"/>} label="My Fleet" />
                <SidebarLink to="/dashboard/requests" icon={<Calendar className="w-5 h-5"/>} label="Booking Requests" />
                <SidebarLink to="/dashboard/wallet" icon={<CreditCard className="w-5 h-5"/>} label="Wallet & Payouts" />
                
                <div className="mt-8 mb-2 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</div>
                <Link to="/host/add-car" className="flex items-center gap-3 px-4 py-3 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition font-bold">
                  <Plus className="w-5 h-5" /> Add New Car
                </Link>
              </>
            )}
          </nav>

          {/* User & Logout Area */}
          <div className="p-4 border-t border-gray-50">
            <div className="bg-gray-50 rounded-xl p-4 mb-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                {user.fullName?.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-900 truncate">{user.fullName || user.showroomName}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout} 
              className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 py-2.5 rounded-lg transition font-medium text-sm"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-600">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-lg">Dashboard</span>
          <div className="w-6"></div> {/* Spacer */}
        </header>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={() => setSidebarOpen(false)}></div>
        )}

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;