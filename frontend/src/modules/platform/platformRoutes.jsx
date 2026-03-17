import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Intelligence from './pages/Intelligence';
import Legal from './pages/Legal';
import Search from './pages/Search';
import Settings from './pages/Settings';
import System from './pages/System';

const PlatformRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="home" replace />} />
      <Route path="home" element={<Home />} />
      <Route path="intelligence" element={<Intelligence />} />
      <Route path="legal" element={<Legal />} />
      <Route path="search" element={<Search />} />
      <Route path="settings" element={<Settings />} />
      <Route path="system" element={<System />} />

      <Route path="pages/Home" element={<Home />} />
      <Route path="pages/Intelligence" element={<Intelligence />} />
      <Route path="pages/Legal" element={<Legal />} />
      <Route path="pages/Search" element={<Search />} />
      <Route path="pages/Settings" element={<Settings />} />
      <Route path="pages/System" element={<System />} />

      <Route path="*" element={<Navigate to="home" replace />} />
    </Routes>
  );
};

export default PlatformRoutes;
