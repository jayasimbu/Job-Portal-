import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import JobSeekerLayout from './components/JobSeekerLayout';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import JobSearch from './pages/JobSearch';
import Applications from './pages/Applications';
import Learning from './pages/Learning';
import ResumeAnalysis from './pages/ResumeAnalysis';
import JDMatchAnalysis from './pages/JDMatchAnalysis';
import JobDetails from './pages/JobMatchAnalysis'; // Reusing this or similar for job details

const Loader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="size-10 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
  </div>
);

const JobSeekerRoutes = () => {
  return (
    <JobSeekerLayout>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="jd-match-analysis" element={<JDMatchAnalysis />} />
          <Route path="jobs" element={<JobSearch />} />
          <Route path="jobs/:jobId" element={<JobDetails />} />
          <Route path="companies/:id" element={<CompanyDetail />} />
          <Route path="applications" element={<Applications />} />
          <Route path="learning" element={<Learning />} />
          <Route path="profile" element={<Profile />} />
          
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
    </JobSeekerLayout>
  );
};

export default JobSeekerRoutes;
