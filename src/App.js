import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// --- Auth Pages ---
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

// --- Public Pages ---
import Home from './pages/public/Home';
import CarDetails from './pages/public/CarDetails';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import NotFound from './pages/common/NotFound';
import { Terms, Privacy, TrustSafety } from './pages/public/Legal';
import { Careers, Blog, Press, HelpCenter } from './pages/public/CompanyInfo';

// --- Customer Pages ---
import MyBookings from './pages/customer/MyBookings';

// --- Host Pages ---
import AddCar from './pages/host/AddCar';
import MyCars from './pages/host/MyCars';
import OwnerBookings from './pages/host/OwnerBookings';
import Wallet from './pages/host/Wallet';

// --- Admin Pages ---
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminKYC from './pages/admin/AdminKYC';
import AdminBookingDetail from './pages/admin/AdminBookingDetail';
import AdminUsers from './pages/admin/AdminUsers';
import AdminHosts from './pages/admin/AdminHosts';
import AdminShowrooms from './pages/admin/AdminShowrooms';

// --- Common Pages ---
import KYCSubmit from './pages/common/KYCSubmit';

import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import PaymentReturn from './pages/customer/PaymentReturn';
import AdminBookings from './pages/admin/AdminBookings';
import BrowseCars from './pages/public/BrowseCars';

import UserProfile from './pages/customer/UserProfile';

import AdminLayout from './layouts/AdminLayout'; // Import new layout
import HowItWorks from './pages/public/HowItWorks';

import Unauthorized from './pages/common/Unauthorized';
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Main Layout wraps standard pages */}
          <Route element={<MainLayout />}>

            {/* PUBLIC ROUTES */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/cars/:carId" element={<CarDetails />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/search" element={<BrowseCars />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            {/* Footer Links */}
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/trust" element={<TrustSafety />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/press" element={<Press />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* COMMON PROTECTED ROUTES */}
            <Route element={<ProtectedRoute allowedRoles={['customer', 'host', 'showroom', 'admin']} />}>
              <Route path="/kyc/submit" element={<KYCSubmit />} />
              <Route path="/profile" element={<UserProfile />} />
            </Route>

            {/* CUSTOMER ROUTES */}
            <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/payment/return" element={<PaymentReturn />} />
            </Route>

            {/* HOST & SHOWROOM ROUTES */}
            <Route element={<ProtectedRoute allowedRoles={['host', 'showroom',]} />}>
              <Route path="/host/cars" element={<MyCars />} />
              <Route path="/host/add-car" element={<AddCar />} />
              <Route path="/host/bookings" element={<OwnerBookings />} />
              <Route path="/wallet" element={<Wallet />} />
            </Route>
          </Route>

          {/* ADMIN ROUTES (Corrected nesting) */}
          {/* <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
             <Route path="dashboard" element={<AdminDashboard />} />
             <Route path="kyc" element={<AdminKYC />} />
             <Route path="bookings" element={<AdminBookings />} />
             <Route path="bookings/:id" element={<AdminBookingDetail />} />
          </Route> */}
          {/* ADMIN ROUTES - Uses separate AdminLayout */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<AdminLayout />}>  {/* Nest inside AdminLayout */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/kyc" element={<AdminKYC />} />
              <Route path="/admin/bookings" element={<AdminBookings />} />
              <Route path="/admin/bookings/:id" element={<AdminBookingDetail />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/hosts" element={<AdminHosts />} />
              <Route path="/admin/showrooms" element={<AdminShowrooms />} />
            </Route>
          </Route>

          {/* Catch-all Redirect */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;