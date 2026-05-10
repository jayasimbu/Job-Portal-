import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import AuthRoutes from './modules/auth/authRoutes';
import EmployerRoutes from './modules/employer/employerRoutes';
import AdminRoutes from './modules/admin/adminRoutes';
import PlatformRoutes from './modules/platform/platformRoutes';
import ProtectedRoute from './core/components/ProtectedRoute';
import PublicLayout from './core/layouts/PublicLayout';
import AppLayout from './core/layouts/AppLayout';
import EmployerLayout from './modules/employer/components/EmployerLayout';
import Home from './modules/platform/pages/Home';
import ErrorBoundary from './core/components/ErrorBoundary';

import { ThemeProvider } from './core/context/ThemeContext';
import { ToastProvider } from './core/context/ToastContext';

import SystemStatus from './modules/platform/pages/SystemStatus';
// Career Info Pages
import AIMatcher from './pages/career/AIMatcher';
import ResumeBuilder from './pages/career/ResumeBuilder';
import SkillsAnalysis from './pages/career/SkillsAnalysis';
import Applications from './pages/career/Applications';
// Hiring Info Pages
import TalentSourcing from './pages/hiring/TalentSourcing';
import AIRanking from './pages/hiring/AIRanking';
import ATSIntegration from './pages/hiring/ATSIntegration';
import EnterpriseHiring from './pages/hiring/EnterpriseHiring';
// Resource Info Pages
import HowItWorks from './pages/resources/HowItWorks';
import CareerGuide from './pages/resources/CareerGuide';
import ResumeTips from './pages/resources/ResumeTips';
import InterviewPrep from './pages/resources/InterviewPrep';
import HelpCenter from './pages/resources/HelpCenter';
// Company Info Pages
import About from './pages/company/About';
import Careers from './pages/company/Careers';
import Press from './pages/company/Press';
import Contact from './pages/company/Contact';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <ErrorBoundary>
            <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/status" element={<PublicLayout><SystemStatus /></PublicLayout>} />

            {/* Auth Module */}
            <Route path="/auth/*" element={<AuthRoutes />} />
            
            {/* Protected Platform Module: Job Seeker */}
            <Route
              path="/platform/jobseeker/*"
              element={(
                <ProtectedRoute requiredRole="jobseeker">
                  <AppLayout>
                    <PlatformRoutes />
                  </AppLayout>
                </ProtectedRoute>
              )}
            />

            {/* Protected Platform Module: Employer */}
            <Route
              path="/platform/employer/*"
              element={(
                <ProtectedRoute requiredRole="employer">
                  <EmployerLayout>
                    <EmployerRoutes />
                  </EmployerLayout>
                </ProtectedRoute>
              )}
            />

            {/* Protected Platform Module: Admin */}
            <Route
              path="/platform/admin/*"
              element={(
                <ProtectedRoute requiredRole="admin">
                  <AdminRoutes />
                </ProtectedRoute>
              )}
            />

            {/* Explicit Info Pages */}
            <Route path="/ai-matcher" element={<PublicLayout><AIMatcher /></PublicLayout>} />
            <Route path="/resume-builder" element={<PublicLayout><ResumeBuilder /></PublicLayout>} />
            <Route path="/skills-analysis" element={<PublicLayout><SkillsAnalysis /></PublicLayout>} />
            <Route path="/applications" element={<PublicLayout><Applications /></PublicLayout>} />
            
            {/* Hiring */}
            <Route path="/talent-sourcing" element={<PublicLayout><TalentSourcing /></PublicLayout>} />
            <Route path="/ai-ranking" element={<PublicLayout><AIRanking /></PublicLayout>} />
            <Route path="/ats" element={<PublicLayout><ATSIntegration /></PublicLayout>} />
            <Route path="/enterprise" element={<PublicLayout><EnterpriseHiring /></PublicLayout>} />
            
            {/* Resources */}
            <Route path="/how-it-works" element={<PublicLayout><HowItWorks /></PublicLayout>} />
            <Route path="/guide" element={<PublicLayout><CareerGuide /></PublicLayout>} />
            <Route path="/resume-tips" element={<PublicLayout><ResumeTips /></PublicLayout>} />
            <Route path="/interview-prep" element={<PublicLayout><InterviewPrep /></PublicLayout>} />
            <Route path="/help" element={<PublicLayout><HelpCenter /></PublicLayout>} />

            {/* Company */}
            <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
            <Route path="/careers" element={<PublicLayout><Careers /></PublicLayout>} />
            <Route path="/press" element={<PublicLayout><Press /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </ErrorBoundary>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;