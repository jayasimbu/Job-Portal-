import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import JobSearch from './pages/JobSearch';
import Applications from './pages/Applications';

const JobSeekerRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="profile" element={<Profile />} />
      <Route path="jobs" element={<JobSearch />} />
      <Route path="applications" element={<Applications />} />

      <Route path="pages/Dashboard" element={<Dashboard />} />
      <Route path="pages/Profile" element={<Profile />} />
      <Route path="pages/JobSearch" element={<JobSearch />} />
      <Route path="pages/Applications" element={<Applications />} />

      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};

export default JobSeekerRoutes;