import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { User, Shield, CreditCard, Car, LayoutDashboard, LogOut, Clock, FileText, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';
import Swal from 'sweetalert2';

const UserProfile = () => {
  const { user, logout, updateUser } = useAuth();
  const [uploading, setUploading] = React.useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire('Error', 'Image too large (max 2MB)', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      // Assuming you have an api client instance or use axios directly
      // Better to use apiClient if available to handle headers automatically
      // But for now, using localStorage token manually if needed or standard fetch
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api'}/users/profile-picture`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        // Update local user context
        updateUser({ ...user, profilePicture: data.data.profilePicture });
        Swal.fire('Success', 'Profile picture updated!', 'success');
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', error.message, 'error');
    } finally {
      setUploading(false);
    }
  };

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
      if (result.isConfirmed) logout();
    });
  };

  if (!user) return null;

  const isHost = user.role === 'host' || user.role === 'showroom';
  // Check either field depending on your backend logic
  const isVerified = user.isVerified; 

  return (
    <div className="max-w-5xl mx-auto">
      {/* 1. HEADER SECTION */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border mb-8 flex flex-col md:flex-row items-center gap-8">
        
        {/* Profile Image with Upload Overlay */}
        <div className="relative group">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center text-4xl font-bold shadow-md overflow-hidden border-4 border-white">
            {user.profilePicture ? (
               <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
               user.fullName ? user.fullName.charAt(0).toUpperCase() : <User />
            )}
          </div>
          
          <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
             {uploading ? (
               <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
             ) : (
               <span className="text-white text-xs font-bold">Change</span>
             )}
             <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
          </label>
        </div>

        <div className="text-center md:text-left flex-grow">
          <h1 className="text-3xl font-bold text-gray-900">{user.fullName || user.showroomName}</h1>
          <p className="text-gray-500 font-medium">{user.email}</p>
          <div className="flex items-center justify-center md:justify-start gap-2 mt-3">
             <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase border border-indigo-100">
               {user.role} Account
             </span>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 font-bold hover:bg-red-50 px-4 py-2 rounded-lg transition">
          <LogOut className="w-5 h-5" /> Log Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. LEFT COLUMN: KYC STATUS (CONDITIONAL UI) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border h-fit">
          <div className="flex items-center gap-3 mb-6 border-b pb-4">
            <Shield className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold">Identity Verification</h2>
          </div>
          
          {isVerified ? (
            // --- CASE 1: VERIFIED (Non-clickable Badge) ---
            <div className="bg-green-50 p-5 rounded-xl border border-green-200 flex flex-col items-center text-center cursor-default">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-green-800 text-lg">Verified Account</h3>
              <p className="text-green-700 text-xs mt-1">
                Your identity has been confirmed. You have full access to {isHost ? 'list cars' : 'book cars'}.
              </p>
            </div>
          ) : (
            // --- CASE 2: UNVERIFIED (Clickable Action) ---
            <Link 
              to="/dashboard/kyc" // Link to KYC Submit page
              className="block bg-orange-50 p-5 rounded-xl border border-orange-200 hover:shadow-md hover:border-orange-300 transition group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <ChevronRight className="text-orange-400 group-hover:translate-x-1 transition" />
              </div>
              <h3 className="font-bold text-orange-800 text-lg">Unverified</h3>
              <p className="text-orange-700 text-xs mt-1">
                Action Required: Submit your ID documents to activate your account features.
              </p>
              <div className="mt-4 text-orange-600 text-sm font-bold underline decoration-orange-300 underline-offset-4">
                Verify Now &rarr;
              </div>
            </Link>
          )}
        </div>

        {/* 3. RIGHT COLUMN: DASHBOARD SHORTCUTS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* HOST / SHOWROOM LINKS */}
          {isHost && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DashboardCard 
                icon={<Car className="w-6 h-6 text-white" />} 
                color="bg-indigo-500"
                title="My Fleet"
                desc="Manage your listed cars"
                link="/dashboard/fleet"
              />
              <DashboardCard 
                icon={<Clock className="w-6 h-6 text-white" />} 
                color="bg-purple-500"
                title="Booking Requests"
                desc="Accept or reject trips"
                link="/dashboard/requests"
              />
              <DashboardCard 
                icon={<CreditCard className="w-6 h-6 text-white" />} 
                color="bg-green-500"
                title="My Wallet"
                desc="View earnings & payouts"
                link="/dashboard/wallet"
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

          {/* CUSTOMER LINKS */}
          {!isHost && (
            <div className="bg-white p-6 rounded-xl shadow-sm border">
               <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-6 h-6 text-indigo-600" />
                <h2 className="text-xl font-bold">My Trips</h2>
              </div>
              
              <Link to="/dashboard/bookings" className="block group">
                <div className="flex items-center gap-4 p-4 border rounded-xl hover:shadow-md transition bg-gray-50 hover:bg-white">
                   <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                     <Car className="w-6 h-6" />
                   </div>
                   <div className="flex-grow">
                     <h3 className="font-bold text-gray-900">Booking History</h3>
                     <p className="text-sm text-gray-500">View upcoming trips, past rentals, and download invoices.</p>
                   </div>
                   <div className="bg-white p-2 rounded-full shadow-sm text-gray-400 group-hover:text-indigo-600">
                     <ChevronRight className="w-5 h-5" />
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

// Helper Component
const DashboardCard = ({ icon, color, title, desc, link }) => (
  <Link to={link} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-lg hover:-translate-y-1 transition group">
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition`}>
      {icon}
    </div>
    <h3 className="font-bold text-lg text-gray-900">{title}</h3>
    <p className="text-sm text-gray-500">{desc}</p>
  </Link>
);

export default UserProfile;