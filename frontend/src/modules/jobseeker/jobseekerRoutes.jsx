import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import JobSeekerLayout from './components/JobSeekerLayout';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import JobSearch from './pages/JobSearch';
import Applications from './pages/Applications';
import Insights from './pages/Insights';
import Learning from './pages/Learning';
import JDMatch from './pages/JDMatch';
import Notifications from './pages/Notifications';

// New migrated pages from stitch designs
const ResumeUpload = lazy(() => import('./pages/ResumeUpload'));
const ProjectVerify = lazy(() => import('./pages/ProjectVerify'));
const SavedJobs = lazy(() => import('./pages/SavedJobs'));
const CandidateProfile = lazy(() => import('./pages/CandidateProfile'));
const MatchInsights = lazy(() => import('./pages/MatchInsights'));
const LearningHub = lazy(() => import('./pages/LearningHub'));
const SearchHistory = lazy(() => import('./pages/SearchHistory'));
const LearningRoadmap = lazy(() => import('./pages/LearningRoadmap'));
const GrowthInsights = lazy(() => import('./pages/GrowthInsights'));
const SkillGapAnalysis = lazy(() => import('./pages/SkillGapAnalysis'));

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
          <Route path="profile" element={<Profile />} />
          <Route path="profile/resume" element={<ResumeUpload />} />
          <Route path="profile/verify" element={<ProjectVerify />} />
          <Route path="profile/insights" element={<Insights />} />
          <Route path="jd-match" element={<JDMatch />} />
          <Route path="jobs" element={<JobSearch />} />
          <Route path="jobs/saved" element={<SavedJobs />} />
          <Route path="job-search" element={<JobSearch />} />
          <Route path="applications" element={<Applications />} />
          <Route path="ats-analysis" element={<Insights />} />
          <Route path="my-resumes" element={<Profile />} />
          <Route path="upload-resume" element={<ResumeUpload />} />
          <Route path="insights" element={<Insights />} />
          <Route path="learning" element={<Learning />} />
          <Route path="learning/hub" element={<LearningHub />} />
          <Route path="learning/roadmap" element={<LearningRoadmap />} />
          <Route path="growth" element={<GrowthInsights />} />
          <Route path="profile/gaps" element={<SkillGapAnalysis />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="search-history" element={<SearchHistory />} />
          <Route path="profile/candidate" element={<CandidateProfile />} />
          <Route path="profile/match-insights" element={<MatchInsights />} />

          {/* Legacy compat */}
          <Route path="pages/Dashboard" element={<Dashboard />} />
          <Route path="pages/Profile" element={<Profile />} />
          <Route path="pages/JobSearch" element={<JobSearch />} />
          <Route path="pages/Applications" element={<Applications />} />
          <Route path="pages/Insights" element={<Insights />} />
          <Route path="pages/Learning" element={<Learning />} />
          <Route path="pages/Notifications" element={<Notifications />} />

          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
      </JobSeekerLayout>
  );
};

export default JobSeekerRoutes;
