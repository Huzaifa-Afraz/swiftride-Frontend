import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Footer from '../components/layout/Footer';
import { LogOut, Car, Menu, X, User } from 'lucide-react';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <NavLinks user={user} logout={logout} />
          </div>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-gray-600 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-xl">
            <div className="flex flex-col p-6 space-y-4 font-medium text-gray-600">
              <NavLinks user={user} logout={logout} isMobile={true} />
            </div>
          </div>
        )}
      </nav>

      {/* Dynamic Page Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

// Helper Component for Links to avoid duplication
const NavLinks = ({ user, logout, isMobile }) => {
  const linkClass = isMobile 
    ? "block py-2 border-b border-gray-50 hover:text-indigo-600" 
    : "text-gray-600 hover:text-indigo-600 transition";
  
  const btnClass = isMobile
    ? "block w-full text-center bg-indigo-600 text-white py-3 rounded-lg mt-4"
    : "bg-indigo-600 text-white px-5 py-2.5 rounded-full hover:bg-indigo-700 transition shadow-lg shadow-indigo-200";

  return (
    <>
      <Link to="/search" className={linkClass}>Browse Cars</Link>
      <Link to="/about" className={linkClass}>About Us</Link>
      <Link to="/contact" className={linkClass}>Contact</Link>
      
      {!user ? (
        <div className={isMobile ? "flex flex-col gap-2 mt-4" : "flex items-center gap-4"}>
          <Link to="/login" className={isMobile ? "text-center py-2" : "text-gray-600 hover:text-indigo-600 px-4 py-2"}>Login</Link>
          <Link to="/signup" className={btnClass}>Sign Up</Link>
        </div>
      ) : (
        <>
          {user.role === 'customer' && (
             <Link to="/my-bookings" className={linkClass}>My Bookings</Link>
          )}
          
          {(user.role === 'host' || user.role === 'showroom') && (
            <>
              <Link to="/host/cars" className={linkClass}>My Cars</Link>
              <Link to="/host/bookings" className={linkClass}>Requests</Link>
              <Link to="/wallet" className={linkClass}>Wallet</Link>
            </>
          )}

          {user.role === 'admin' && (
            <Link to="/admin/dashboard" className={linkClass + " text-indigo-600 font-bold"}>Admin Panel</Link>
          )}
          
          <div className={isMobile ? "border-t pt-4 mt-2" : "h-8 w-px bg-gray-200"}></div>
          
          <div className={`flex items-center gap-3 ${isMobile ? 'justify-between' : ''}`}>
            {/* <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                <User className="w-4 h-4" />
              </div>
              <span className="text-gray-900 font-semibold">{user.fullName || user.showroomName || 'User'}</span>
            </div> */}
            {/* Link to Profile */}
           <Link to="/profile" className="flex items-center gap-2 hover:bg-gray-100 p-1.5 rounded-lg transition">
             <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
              <User className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
              <span className="text-gray-900 font-semibold text-sm leading-tight">{user.fullName || user.showroomName || 'User'}</span>
             <span className="text-xs text-gray-500 leading-tight">View Profile</span>
             </div>
            </Link>
            <button onClick={logout} className="text-gray-400 hover:text-red-500 transition flex items-center gap-1">
              <LogOut className="w-5 h-5" /> {isMobile && "Logout"}
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default MainLayout;