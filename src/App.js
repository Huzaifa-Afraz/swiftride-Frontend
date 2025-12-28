import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout'; // NEW
import AdminLayout from './layouts/AdminLayout';

// Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Home from './pages/public/Home';
import CarDetails from './pages/public/CarDetails';
import BrowseCars from './pages/public/BrowseCars';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import HowItWorks from './pages/public/HowItWorks';
import NotFound from './pages/common/NotFound';
import Unauthorized from './pages/common/Unauthorized';
import TrackBookingPage from './pages/common/TrackBookingPage';

// Dashboard Pages
import CustomerOverview from './pages/customer/CustomerOverview'; // NEW
import HostDashboard from './pages/host/HostDashboard';
import MyBookings from './pages/customer/MyBookings';
import UserProfile from './pages/customer/UserProfile'; // Rename file or import as UserProfile
import MyCars from './pages/host/MyCars';
import AddCar from './pages/host/AddCar';
import OwnerBookings from './pages/host/OwnerBookings';
import Wallet from './pages/host/Wallet';
import KYCSubmit from './pages/common/KYCSubmit';
import Inbox from './pages/common/Inbox';

// Admin Pages... (Keep existing imports)
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminKYC from './pages/admin/AdminKYC';
import AdminBookings from './pages/admin/AdminBookings';
import AdminBookingDetail from './pages/admin/AdminBookingDetail';
import AdminUsers from './pages/admin/AdminUsers';
import AdminHosts from './pages/admin/AdminHosts';
import AdminShowrooms from './pages/admin/AdminShowrooms';
import useAuth from './hooks/useAuth';
import PaymentReturn from './pages/public/PaymentReturn';
import PaymentSuccess from './pages/public/PaymentSuccess';
import PaymentCancel from './pages/public/PaymentCancel';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* --- PUBLIC WEBSITE (Navbar Layout) --- */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/cars/:carId" element={<CarDetails />} />
            <Route path="/search" element={<BrowseCars />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/payment-return" element={<PaymentReturn />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/cancel" element={<PaymentCancel />} />
          </Route>

          {/* --- NEW UNIFIED DASHBOARD (Sidebar Layout) --- */}
          <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['customer', 'host', 'showroom']} />}>
            <Route element={<DashboardLayout />}>

              {/* 1. Shared Routes */}
              <Route path="profile" element={<UserProfile />} />
              <Route path="inbox" element={<Inbox />} />
              <Route path="kyc" element={<KYCSubmit />} />

              {/* 2. Customer Routes */}
              <Route index element={<CustomerOverviewWrapper />} /> {/* Smart Wrapper */}
              <Route path="bookings" element={<MyBookings />} />

              {/* 3. Host Routes */}
              <Route path="fleet" element={<MyCars />} />
              <Route path="requests" element={<OwnerBookings />} />
              <Route path="wallet" element={<Wallet />} />
              <Route path="track/:id" element={<TrackBookingPage />} />
            </Route>
          </Route>

          {/* --- HOST ADD CAR (Keep separate or move to dashboard as needed) --- */}
          {/* We link to /host/add-car in sidebar, so we keep this route accessible */}
          <Route element={<ProtectedRoute allowedRoles={['host', 'showroom']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/host/add-car" element={<AddCar />} />
              <Route path="/host/edit-car/:id" element={<AddCar />} />
            </Route>
          </Route>

          {/* --- ADMIN PANEL (Admin Layout) --- */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="kyc" element={<AdminKYC />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="bookings/:id" element={<AdminBookingDetail />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="hosts" element={<AdminHosts />} />
              <Route path="showrooms" element={<AdminShowrooms />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

// Helper to switch Dashboard Home based on Role
// import useAuth from './hooks/useAuth';
const CustomerOverviewWrapper = () => {
  const { user } = useAuth();
  if (user.role === 'host' || user.role === 'showroom') {
    return <HostDashboard />;
  }
  return <CustomerOverview />;
};

export default App;