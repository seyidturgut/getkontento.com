import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const AdminGuard: React.FC = () => {
  const { user } = useAuthStore();

  // If user is not authenticated or not an admin, redirect to dashboard (or login)
  if (!user || user.role !== 'admin') {
    return <Navigate to="/app/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminGuard;