import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CompanyProfile from './pages/CompanyProfile';
import PostJob from './pages/PostJob';
import Candidates from './pages/Candidates';

const EmployerRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="profile" element={<CompanyProfile />} />
      <Route path="post-job" element={<PostJob />} />
      <Route path="candidates" element={<Candidates />} />

      <Route path="pages/Dashboard" element={<Dashboard />} />
      <Route path="pages/CompanyProfile" element={<CompanyProfile />} />
      <Route path="pages/PostJob" element={<PostJob />} />
      <Route path="pages/Candidates" element={<Candidates />} />

      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};

export default EmployerRoutes;