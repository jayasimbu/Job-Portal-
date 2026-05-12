import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../../core/layouts/AdminLayout';

// Pages
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import CompanyManagement from './pages/CompanyManagement';
import JobManagement from './pages/JobManagement';
import Applications from './pages/Applications';

const AdminRoutes = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="employers" element={<CompanyManagement />} />
        <Route path="jobs" element={<JobManagement />} />
        <Route path="applications" element={<Applications />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminRoutes;
