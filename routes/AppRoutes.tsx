import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
import SeoAnalysis from '../pages/SeoAnalysis';
import Login from '../pages/Login';
import ContentList from '../pages/ContentList';
import ContentDetailPage from '../pages/ContentDetailPage';
import AdminClientsPage from '../pages/admin/AdminClientsPage';
import AdminClientDetailPage from '../pages/admin/AdminClientDetailPage';
import LandingPage from '../pages/LandingPage';
import ProtectedRoute from './ProtectedRoute';
import AdminGuard from './AdminGuard';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes */}
      <Route path="/app" element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analysis" element={<SeoAnalysis />} />
          
          {/* Content Routes */}
          <Route path="content" element={<ContentList />} />
          <Route path="content/:id" element={<ContentDetailPage />} />

          <Route path="tasks" element={<div className="p-4 text-slate-400">Görevler Sayfası</div>} />
          <Route path="account" element={<div className="p-4 text-slate-400">Hesap Ayarları</div>} />
          
          {/* Admin Routes */}
          <Route path="admin" element={<AdminGuard />}>
            <Route path="clients" element={<AdminClientsPage />} />
            <Route path="clients/:id" element={<AdminClientDetailPage />} />
            <Route path="customers" element={<Navigate to="/app/admin/clients" replace />} /> {/* Legacy redirect */}
            <Route path="settings" element={<div className="p-4 text-slate-400">Admin Sistem Ayarları</div>} />
          </Route>
        </Route>
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;