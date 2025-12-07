import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Footer from '../components/layout/Footer';
import { LogOut, Car, Menu, X, User } from 'lucide-react';
import Swal from 'sweetalert2';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Logout Confirmation Handler
  const handleLogout = () => {
    Swal.fire({
      title: 'Sign Out?',
      text: "Are you sure you want to log out?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Sign Out'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      }
    });
  };

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
            <NavLinks user={user} onLogoutClick={handleLogout} />
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
              <NavLinks user={user} onLogoutClick={handleLogout} isMobile={true} />
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

// --- SIMPLIFIED NAVLINKS COMPONENT ---
const NavLinks = ({ user, onLogoutClick, isMobile }) => {
  const linkClass = isMobile 
    ? "block py-2 border-b border-gray-50 hover:text-indigo-600" 
    : "text-gray-600 hover:text-indigo-600 transition";
  
  const btnClass = isMobile
    ? "block w-full text-center bg-indigo-600 text-white py-3 rounded-lg mt-4"
    : "bg-indigo-600 text-white px-5 py-2.5 rounded-full hover:bg-indigo-700 transition shadow-lg shadow-indigo-200";

  return (
    <>
      {/* 1. PUBLIC LINKS (Always visible) */}
      <Link to="/search" className={linkClass}>Browse Cars</Link>
      <Link to="/how-it-works" className={linkClass}>How it Works</Link>
      
      {/* 2. AUTHENTICATION LOGIC */}
      {!user ? (
        // STATE A: NOT LOGGED IN
        <div className={isMobile ? "flex flex-col gap-2 mt-4" : "flex items-center gap-4"}>
          <Link to="/login" className={isMobile ? "text-center py-2" : "text-gray-600 hover:text-indigo-600 px-4 py-2"}>Login</Link>
          <Link to="/signup" className={btnClass}>Sign Up</Link>
        </div>
      ) : (
        // STATE B: LOGGED IN (Show Dashboard Button + Logout)
        <div className={`flex items-center gap-4 ${isMobile ? 'flex-col mt-4' : ''}`}>
          
          {/* THE DASHBOARD BUTTON */}
          <Link 
            to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} 
            className={`${btnClass} font-bold`}
          >
            Go to Dashboard
          </Link>

          {/* User Icon (Desktop Only) */}
          {!isMobile && (
            <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold ml-2">
              {user.fullName?.charAt(0).toUpperCase() || <User className="w-5 h-5"/>}
            </div>
          )}

          {/* Logout Button */}
          <button 
            onClick={onLogoutClick} 
            className={`text-gray-400 hover:text-red-500 transition flex items-center gap-1 ${isMobile ? 'w-full justify-center py-2' : ''}`}
            title="Logout"
          >
            <LogOut className="w-6 h-6" /> {isMobile && "Sign Out"}
          </button>
        </div>
      )}
    </>
  );
};

export default MainLayout;