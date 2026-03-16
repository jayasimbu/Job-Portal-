import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import AuthRoutes from './modules/auth/authRoutes';
import JobSeekerRoutes from './modules/jobseeker/jobseekerRoutes';
import EmployerRoutes from './modules/employer/employerRoutes';
import AdminRoutes from './modules/admin/adminRoutes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth/*" element={<AuthRoutes />} />
        <Route path="/jobseeker/*" element={<JobSeekerRoutes />} />
        <Route path="/employer/*" element={<EmployerRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;