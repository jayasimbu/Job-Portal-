import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Candidates from './pages/Candidates';
import Analytics from './pages/Analytics';
import Applications from './pages/Applications';
import PostJob from './pages/PostJob';
import CompanyProfile from './pages/CompanyProfile';

const EmployerRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="post-job" element={<PostJob />} />
      <Route path="candidates" element={<Candidates />} />
      <Route path="applications" element={<Applications />} />
      <Route path="profile" element={<CompanyProfile />} />
      <Route path="analytics" element={<Analytics />} />
      
      {/* Legacy/Alias routes */}
      <Route path="jobs" element={<Navigate to="../post-job" replace />} />
      <Route path="job-management" element={<Navigate to="../post-job" replace />} />
      <Route path="settings" element={<Navigate to="../profile" replace />} />

      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};

export default EmployerRoutes;
