import React from 'react';
import { Navigate } from 'react-router-dom';
import appConfig from '../config/appConfig';

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem(appConfig.auth.tokenStorageKey);
  const role = localStorage.getItem(appConfig.auth.roleStorageKey);

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    const redirect = appConfig.auth.roleRedirectMap[role] || '/platform/home';
    return <Navigate to={redirect} replace />;
  }

  return children;
};

export default ProtectedRoute;



