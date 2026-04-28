import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthCenter from './pages/AuthCenter';
import VerifyEmail from './pages/VerifyEmail';
import NewPassword from './pages/NewPassword';

const AuthRoutes = () => {
  return (
    <Routes>
      <Route index element={<AuthCenter />} />
      <Route path="login" element={<AuthCenter />} />
      <Route path="signin" element={<AuthCenter />} />
      <Route path="register" element={<AuthCenter />} />
      <Route path="signup" element={<AuthCenter />} />
      <Route path="verify" element={<VerifyEmail />} />
      <Route path="reset-password" element={<NewPassword />} />
      <Route path="*" element={<Navigate to="" replace />} />
    </Routes>
  );
};

export default AuthRoutes;