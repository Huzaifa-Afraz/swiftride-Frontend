import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Footer from '../components/layout/Footer';
import { User, LogOut, Car, Menu } from 'lucide-react';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-gray-50">
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Car className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-700 to-indigo-500 bg-clip-text text-transparent">
              SwiftRide
            </span>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link to="/" className="text-gray-600 hover:text-indigo-600 transition">Browse Cars</Link>
            <Link to="#" className="text-gray-600 hover:text-indigo-600 transition">How it Works</Link>
            
            {!user ? (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-gray-600 hover:text-indigo-600 px-4 py-2">Login</Link>
                <Link to="/signup" className="bg-indigo-600 text-white px-5 py-2.5 rounded-full hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                {user.role === 'customer' && (
                   <Link to="/my-bookings" className="text-gray-600 hover:text-indigo-600">My Bookings</Link>
                )}
                {(user.role === 'host' || user.role === 'showroom') && (
                  <>
                    <Link to="/host/cars" className="text-gray-600 hover:text-indigo-600">My Cars</Link>
                    <Link to="/host/add-car" className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full hover:bg-indigo-100 transition">
                      + List Car
                    </Link>
                  </>
                )}
                
                <div className="h-8 w-px bg-gray-200"></div>
                
                <div className="flex items-center gap-3">
                  <span className="text-gray-900 font-semibold">{user.fullName || 'User'}</span>
                  <button onClick={logout} className="text-gray-400 hover:text-red-500 transition">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Icon (Placeholder) */}
          <button className="md:hidden text-gray-600">
            <Menu className="w-7 h-7" />
          </button>
        </div>
      </nav>

      {/* Dynamic Page Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;