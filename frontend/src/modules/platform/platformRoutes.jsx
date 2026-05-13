import React, { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import Dashboard from '../jobseeker/pages/Dashboard';
import JobseekerHome from '../jobseeker/pages/JobseekerHome';
import Profile from '../jobseeker/pages/Profile';
import JDMatchAnalysis from '../jobseeker/pages/JDMatchAnalysis';
import Jobs from './pages/Jobs';
import Applications from './pages/Applications';
import LearningHub from './pages/LearningHub';
import LearningPage from './pages/LearningPage';
import CompanyDetail from '../jobseeker/pages/CompanyDetail';
import JobDetails from '../jobseeker/pages/JobDetails';

const PlatformRoutes = () => {
  return (
    <Suspense fallback={<div className="p-8 font-black uppercase tracking-widest text-slate-400">Loading System...</div>}>
        <Routes>
          <Route index element={<Navigate to="home" replace />} />
          
          {/* Main Core Pages */}
          <Route path="home" element={<JobseekerHome />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="jobs/:id" element={<JobDetails />} />
          <Route path="applications" element={<Applications />} />
          <Route path="learning" element={<LearningHub />} />
          <Route path="learning/:id" element={<LearningPage />} />
          <Route path="companies/:id" element={<CompanyDetail />} />
          <Route path="profile" element={<Profile />} />
          
          {/* Intelligence Sub-Pages */}
          <Route path="jd-match-analysis" element={<JDMatchAnalysis />} />
          
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
  );
};

export default PlatformRoutes;



