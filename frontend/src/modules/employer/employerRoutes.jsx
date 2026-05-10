import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CompanyProfile from './pages/CompanyProfile';
import PostJob from './pages/PostJob';
import Candidates from './pages/Candidates';
import Analytics from './pages/Analytics';
import HiringPolicy from './pages/HiringPolicy';
import InterviewScheduling from './pages/InterviewScheduling';
import JobManagement from './pages/JobManagement';
import BiasFreeJobRequirements from './pages/BiasFreeJobRequirements';

const EmployerRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="profile" element={<CompanyProfile />} />
      <Route path="post-job" element={<PostJob />} />
      <Route path="candidates" element={<Candidates />} />
      <Route path="analytics" element={<Analytics />} />
      <Route path="hiring-policy" element={<HiringPolicy />} />
      <Route path="interviews" element={<InterviewScheduling />} />
      <Route path="job-management" element={<JobManagement />} />
      <Route path="bias-free" element={<BiasFreeJobRequirements />} />

      {/* Legacy route compatibility */}
      <Route path="pages/Dashboard" element={<Navigate to="/employer/dashboard" replace />} />
      <Route path="pages/CompanyProfile" element={<Navigate to="/employer/profile" replace />} />
      <Route path="pages/PostJob" element={<Navigate to="/employer/post-job" replace />} />
      <Route path="pages/Candidates" element={<Navigate to="/employer/candidates" replace />} />
      <Route path="pages/Analytics" element={<Navigate to="/employer/analytics" replace />} />
      <Route path="pages/HiringPolicy" element={<Navigate to="/employer/hiring-policy" replace />} />
      <Route path="pages/InterviewSchedule" element={<Navigate to="/employer/interviews" replace />} />

      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};

export default EmployerRoutes;