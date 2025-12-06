import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

import Home from './pages/public/Home';
import Login from './pages/auth/Login';
import AddCar from './pages/host/AddCar';

// Placeholders for remaining pages to prevent crash
const Signup = () => <div className="p-10 text-center">Signup Page (TODO)</div>;
const CarDetails = () => <div className="p-10 text-center">Car Details Page (TODO)</div>;
const MyBookings = () => <div className="p-10 text-center">My Bookings (TODO)</div>;
const MyCars = () => <div className="p-10 text-center">My Cars List (TODO)</div>;
const AdminDashboard = () => <div className="p-10 text-center">Admin Dashboard (TODO)</div>;

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/cars/:carId" element={<CarDetails />} />
            
            <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
              <Route path="/my-bookings" element={<MyBookings />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['host', 'showroom']} />}>
              <Route path="/host/cars" element={<MyCars />} />
              <Route path="/host/add-car" element={<AddCar />} />
            </Route>
          </Route>
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
             <Route path="dashboard" element={<AdminDashboard />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;