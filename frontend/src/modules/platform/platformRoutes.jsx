import React, { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import Dashboard from '../jobseeker/pages/Dashboard';
import Profile from '../jobseeker/pages/Profile';
import ResumeAnalysis from '../jobseeker/pages/ResumeAnalysis';
import JDMatch from '../jobseeker/pages/JDMatch';
import GrowthInsights from '../jobseeker/pages/GrowthInsights';
import Jobs from './pages/Jobs';
import Applications from './pages/Applications';
import LearningHub from './pages/LearningHub';
import LearningPage from './pages/LearningPage';
import DetailView from './pages/DetailView';
import JobRecommendations from '../jobseeker/pages/JobRecommendations';

const PlatformRoutes = () => {
  return (
    <Suspense fallback={<div className="p-8 font-black uppercase tracking-widest text-slate-400">Loading System...</div>}>
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          
          {/* Main Core Pages */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="applications" element={<Applications />} />
          <Route path="learning" element={<LearningHub />} />
          <Route path="learning/:id" element={<LearningPage />} />
          <Route path="profile" element={<Profile />} />
          
          {/* Intelligence Sub-Pages (Accessed via Dashboard/Jobs) */}
          <Route path="resume-analysis" element={<ResumeAnalysis />} />
          <Route path="jd-match" element={<JDMatch />} />
          <Route path="growth" element={<GrowthInsights />} />
          <Route path="recommendations" element={<JobRecommendations />} />
          
          {/* Support Pages */}
          <Route path="details/:id" element={<DetailView />} />
          
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
  );
};

export default PlatformRoutes;
