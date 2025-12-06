import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <div className="p-10 text-center text-red-600">Access Denied</div>;
  }
  return <Outlet />;
};
export default ProtectedRoute;