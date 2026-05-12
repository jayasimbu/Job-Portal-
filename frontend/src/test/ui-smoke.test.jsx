import React from 'react';
import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import AuthRoutes from '../modules/auth/authRoutes';
import JobSeekerRoutes from '../modules/jobseeker/jobseekerRoutes';
import EmployerRoutes from '../modules/employer/employerRoutes';
import AdminRoutes from '../modules/admin/adminRoutes';

vi.mock('../core/components/HtmlPage', () => ({
  default: ({ title }) => <div data-testid="html-page">{title}</div>,
}));

const renderRoute = (initialEntry, element, path) => {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path={path} element={element} />
      </Routes>
    </MemoryRouter>
  );
};

describe('UI smoke tests', () => {
  test('auth login route renders native React page', () => {
    renderRoute('/auth/pages/Login', <AuthRoutes />, '/auth/*');
    expect(screen.getByText('Job Portal Authentication')).toBeInTheDocument();
  });

  test('jobseeker applications route renders native React page', () => {
    renderRoute('/jobseeker/pages/Applications', <JobSeekerRoutes />, '/jobseeker/*');
    expect(screen.getByText('My Applications')).toBeInTheDocument();
  });

  test('employer candidates route renders native React page', () => {
    renderRoute('/employer/pages/Candidates', <EmployerRoutes />, '/employer/*');
    expect(screen.getByText('Refined Candidate Management')).toBeInTheDocument();
  });

  test('admin users route renders native React page', () => {
    renderRoute('/admin/pages/UserManagement', <AdminRoutes />, '/admin/*');
    expect(screen.getByText('User Management')).toBeInTheDocument();
  });
});



