import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { User, Shield, CreditCard, Car, LayoutDashboard, LogOut, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import Swal from 'sweetalert2'; // Add import
const UserProfile = () => {
  const { user, logout } = useAuth();
const handleLogout = () => {
    Swal.fire({
      title: 'Log out?',
      text: "Are you sure you want to exit?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Log Out'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      }
    });
  };
  if (!user) return null;

  const isHost = user.role === 'host' || user.role === 'showroom';

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* 1. HEADER SECTION */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border mb-8 flex flex-col md:flex-row items-center gap-8">
        <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center text-4xl font-bold shadow-md">
          {user.fullName ? user.fullName.charAt(0) : <User />}
        </div>
        <div className="text-center md:text-left flex-grow">
          <h1 className="text-3xl font-bold text-gray-900">{user.fullName || user.showroomName}</h1>
          <p className="text-gray-500 font-medium">{user.email}</p>
          <div className="flex items-center justify-center md:justify-start gap-2 mt-3">
             <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase border border-indigo-100">
               {user.role} Account
             </span>
             {user.phoneNumber && (
               <span className="px-3 py-1 rounded-full bg-gray-50 text-gray-600 text-xs font-bold border border-gray-200">
                 {user.phoneNumber}
               </span>
             )}
          </div>
        </div>
       <button 
        onClick={handleLogout} 
        className="flex items-center gap-2 text-red-500 font-bold hover:bg-red-50 px-4 py-2 rounded-lg transition"
      >
        <LogOut className="w-5 h-5" /> Log Out
      </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. LEFT COLUMN: KYC STATUS (Crucial for Hosts) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border h-fit">
          <div className="flex items-center gap-3 mb-6 border-b pb-4">
            <Shield className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold">Identity Verification</h2>
          </div>
          
          {/* Logic: We assume user object has isVerified or we check if they can access features */}
          {/* Since the API login response structure varies, we show a generic status card */}
          
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
            <h3 className="font-bold text-blue-800 text-sm mb-1">Why Verify?</h3>
            <p className="text-blue-600 text-xs leading-relaxed">
              {isHost 
                ? "You must verify your identity/business to list cars and receive payouts." 
                : "You must verify your identity (Driver's License) to book cars."}
            </p>
          </div>

          <Link 
            to="/kyc/submit" 
            className="flex items-center justify-between w-full p-4 bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 rounded-xl transition group"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-full shadow-sm">
                <FileTextIcon />
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-800 group-hover:text-indigo-700">KYC Documents</p>
                <p className="text-xs text-gray-500">Update or Submit</p>
              </div>
            </div>
            <ArrowIcon />
          </Link>
        </div>

        {/* 3. RIGHT COLUMN: DASHBOARD SHORTCUTS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* HOST / SHOWROOM DASHBOARD */}
          {isHost && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DashboardCard 
                icon={<Car className="w-6 h-6 text-white" />} 
                color="bg-indigo-500"
                title="My Fleet"
                desc="Manage your listed cars"
                link="/host/cars"
              />
              <DashboardCard 
                icon={<Clock className="w-6 h-6 text-white" />} 
                color="bg-purple-500"
                title="Booking Requests"
                desc="Accept or reject trips"
                link="/host/bookings"
              />
              <DashboardCard 
                icon={<CreditCard className="w-6 h-6 text-white" />} 
                color="bg-green-500"
                title="My Wallet"
                desc="View earnings & payouts"
                link="/wallet"
              />
              <DashboardCard 
                icon={<LayoutDashboard className="w-6 h-6 text-white" />} 
                color="bg-orange-500"
                title="Add New Car"
                desc="List a vehicle for rent"
                link="/host/add-car"
              />
            </div>
          )}

          {/* CUSTOMER DASHBOARD */}
          {!isHost && (
            <div className="bg-white p-6 rounded-xl shadow-sm border">
               <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-6 h-6 text-indigo-600" />
                <h2 className="text-xl font-bold">My Trips</h2>
              </div>
              
              <Link to="/my-bookings" className="block group">
                <div className="flex items-center gap-4 p-4 border rounded-xl hover:shadow-md transition bg-gray-50 hover:bg-white">
                   <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                     <Car />
                   </div>
                   <div className="flex-grow">
                     <h3 className="font-bold text-gray-900">Booking History</h3>
                     <p className="text-sm text-gray-500">View upcoming trips, past rentals, and download invoices.</p>
                   </div>
                   <div className="bg-white p-2 rounded-full shadow-sm text-gray-400 group-hover:text-indigo-600">
                     <ArrowIcon />
                   </div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Sub Components ---
const DashboardCard = ({ icon, color, title, desc, link }) => (
  <Link to={link} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-lg hover:-translate-y-1 transition group">
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition`}>
      {icon}
    </div>
    <h3 className="font-bold text-lg text-gray-900">{title}</h3>
    <p className="text-sm text-gray-500">{desc}</p>
  </Link>
);

const FileTextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
  </svg>
);

export default UserProfile;