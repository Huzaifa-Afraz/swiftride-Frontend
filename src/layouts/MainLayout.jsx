import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Footer from '../components/layout/Footer';
import { LogOut, Car, Menu, X, User } from 'lucide-react';
import Swal from 'sweetalert2'; // Import SweetAlert2

const MainLayout = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile menu when route changes
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // --- NEW: LOGOUT CONFIRMATION HANDLER ---
  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out of your session.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33', // Red for logout
      cancelButtonColor: '#3085d6', // Blue for cancel
      confirmButtonText: 'Yes, Log Out'
    }).then((result) => {
      if (result.isConfirmed) {
        logout(); // Only calls logout if user clicks "Yes"
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-gray-50">
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Car className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-700 to-indigo-500 bg-clip-text text-transparent">
              SwiftRide
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {/* Pass handleLogout instead of direct logout */}
            <NavLinks user={user} onLogoutClick={handleLogout} /> 
          </div>
          
          <button 
            className="md:hidden text-gray-600 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-xl">
            <div className="flex flex-col p-6 space-y-4 font-medium text-gray-600">
               {/* Pass handleLogout here too */}
              <NavLinks user={user} onLogoutClick={handleLogout} isMobile={true} />
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

// Helper Component Updated to accept onLogoutClick
const NavLinks = ({ user, onLogoutClick, isMobile }) => {
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
          {/* CUSTOMER LINKS */}
          {user.role === 'customer' && (
             <Link to="/my-bookings" className={linkClass}>My Bookings</Link>
          )}
          
          {/* HOST / SHOWROOM LINKS */}
          {(user.role === 'host' || user.role === 'showroom') && (
            <>
              <Link to="/host/cars" className={linkClass}>My Cars</Link>
              <Link to="/host/bookings" className={linkClass}>Requests</Link>
              <Link to="/wallet" className={linkClass}>Wallet</Link>
            </>
          )}

          {/* ADMIN LINK (Exclusive) */}
          {user.role === 'admin' && (
            <Link to="/admin/dashboard" className={linkClass + " text-indigo-600 font-bold"}>
              Go to Admin Panel
            </Link>
          )}
          
          <div className={isMobile ? "border-t pt-4 mt-2" : "h-8 w-px bg-gray-200"}></div>
          
          <div className={`flex items-center gap-3 ${isMobile ? 'justify-between' : ''}`}>
            {/* ONLY SHOW PROFILE LINK IF NOT ADMIN */}
            {user.role !== 'admin' ? (
              <Link to="/profile" className="flex items-center gap-2 hover:bg-gray-100 p-1.5 rounded-lg transition">
                <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                  <User className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                   <span className="text-gray-900 font-semibold text-sm leading-tight">{user.fullName || user.showroomName || 'User'}</span>
                   <span className="text-xs text-gray-500 leading-tight">View Profile</span>
                </div>
              </Link>
            ) : (
              // Simple User Badge for Admin (No Link)
              <div className="flex items-center gap-2 p-1.5">
                <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center text-red-600">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-gray-900 font-semibold text-sm">Administrator</span>
              </div>
            )}
            
            <button onClick={onLogoutClick} className="text-gray-400 hover:text-red-500 transition flex items-center gap-1">
              <LogOut className="w-5 h-5" /> {isMobile && "Logout"}
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default MainLayout;