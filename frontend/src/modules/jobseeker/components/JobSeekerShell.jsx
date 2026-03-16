import React from 'react';
import { Link } from 'react-router-dom';

const styles = {
  page: { minHeight: '100vh', background: '#f6f7fb' },
  top: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    borderBottom: '1px solid #e5e7eb',
    background: '#fff',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  brand: { fontWeight: 800, fontSize: '24px', color: '#1e3a8a' },
  topNav: { display: 'flex', gap: '20px', alignItems: 'center' },
  body: { display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: 'calc(100vh - 62px)' },
  side: { background: '#fff', borderRight: '1px solid #e5e7eb', padding: '16px' },
  sideLink: {
    display: 'block',
    padding: '10px 12px',
    borderRadius: '8px',
    textDecoration: 'none',
    color: '#475569',
    fontWeight: 600,
    marginBottom: '8px',
  },
  sideLinkActive: { background: '#1d4ed8', color: '#fff' },
  main: { padding: '24px' },
  search: {
    width: '360px',
    maxWidth: '45vw',
    border: '1px solid #d1d5db',
    borderRadius: '10px',
    padding: '10px 12px',
    fontSize: '14px',
  },
};

const topLinks = [
  { key: 'dashboard', to: '/jobseeker/pages/Dashboard', label: 'Dashboard' },
  { key: 'jobs', to: '/jobseeker/pages/JobSearch', label: 'Jobs' },
  { key: 'applications', to: '/jobseeker/pages/Applications', label: 'Applications' },
  { key: 'profile', to: '/jobseeker/pages/Profile', label: 'Profile' },
];

const sideLinks = [
  { key: 'dashboard', to: '/jobseeker/pages/Dashboard', label: 'Dashboard' },
  { key: 'jobs', to: '/jobseeker/pages/JobSearch', label: 'Job Search' },
  { key: 'applications', to: '/jobseeker/pages/Applications', label: 'Applications' },
  { key: 'profile', to: '/jobseeker/pages/Profile', label: 'Profile' },
];

const JobSeekerShell = ({ active, children }) => {
  return (
    <div style={styles.page}>
      <header style={styles.top}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={styles.brand}>AI Job Portal</div>
          <input style={styles.search} placeholder="Search jobs, skills..." />
        </div>
        <nav style={styles.topNav}>
          {topLinks.map((item) => (
            <Link
              key={item.key}
              to={item.to}
              style={{
                textDecoration: 'none',
                color: active === item.key ? '#1d4ed8' : '#475569',
                fontWeight: active === item.key ? 700 : 500,
              }}
            >
              {item.label}
            </Link>
          ))}
          <Link to="/auth/pages/Login" style={{ textDecoration: 'none', color: '#334155', fontWeight: 700 }}>
            Logout
          </Link>
        </nav>
      </header>

      <div style={styles.body}>
        <aside style={styles.side}>
          <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 700, marginBottom: '14px' }}>MAIN MENU</div>
          {sideLinks.map((item) => (
            <Link
              key={item.key}
              to={item.to}
              style={{
                ...styles.sideLink,
                ...(active === item.key ? styles.sideLinkActive : {}),
              }}
            >
              {item.label}
            </Link>
          ))}
        </aside>

        <main style={styles.main}>{children}</main>
      </div>
    </div>
  );
};

export default JobSeekerShell;
