import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import Applications from './pages/Applications';
import Settings from './pages/Settings';
import LearningHub from './pages/LearningHub';
import LearningPage from './pages/LearningPage';
import DetailView from './pages/DetailView';
import MCP from './pages/MCP';

const PlatformRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="jobs" element={<Jobs />} />
      <Route path="applications" element={<Applications />} />
      <Route path="learning" element={<LearningHub />} />
      <Route path="learning/:id" element={<LearningPage />} />
      <Route path="mcp" element={<MCP />} />
      <Route path="settings" element={<Settings />} />
      
      {/* Detail pages (footer links) */}
      <Route path="details/:id" element={<DetailView />} />

      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};

export default PlatformRoutes;
