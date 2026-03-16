import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import CompanyManagement from './pages/CompanyManagement';
import JobManagement from './pages/JobManagement';
import SystemLogs from './pages/SystemLogs';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="users" element={<UserManagement />} />
      <Route path="companies" element={<CompanyManagement />} />
      <Route path="jobs" element={<JobManagement />} />
      <Route path="logs" element={<SystemLogs />} />

      <Route path="pages/Dashboard" element={<Dashboard />} />
      <Route path="pages/UserManagement" element={<UserManagement />} />
      <Route path="pages/CompanyManagement" element={<CompanyManagement />} />
      <Route path="pages/JobManagement" element={<JobManagement />} />
      <Route path="pages/SystemLogs" element={<SystemLogs />} />

      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};

export default AdminRoutes;