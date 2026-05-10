import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../core/context/ThemeContext';
import logo from '../../../assets/logos/linkup_logo.png';
import GlobalFooter from '../../../core/components/GlobalFooter';
import LogoModal from '../../../core/components/LogoModal';

const styles = {
  page: { minHeight: '100vh', background: 'var(--bg-page)', color: 'var(--text-main)', transition: '0.3s', fontFamily: "'Manrope', sans-serif" },
  top: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 24px',
    borderBottom: '1px solid var(--border)',
    background: 'white',
    opacity: 0.9,
    backdropFilter: 'blur(10px)',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  brand: { fontWeight: 800, fontSize: '20px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' },
  logoCont: { height: '36px', width: '36px', background: '#2563eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', p: 0, cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.4)' },
  logo: { height: '100%', width: '100%', objectFit: 'cover', transform: 'scale(1.3)' },
  topNav: { display: 'flex', gap: '24px', alignItems: 'center' },
  body: { display: 'block' },
  side: { background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border)', padding: '20px 16px', height: 'calc(100vh - 53px)', position: 'sticky', top: '53px' },
  sideLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 14px',
    borderRadius: '12px',
    textDecoration: 'none',
    color: 'var(--text-muted)',
    fontWeight: 600,
    fontSize: '14px',
    marginBottom: '4px',
    transition: '0.2s',
  },
  sideLinkActive: { background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' },
  main: { padding: '32px', maxWidth: '1600px', margin: '0 auto', width: '100%' },
  search: {
    width: '320px',
    border: '1px solid var(--border)',
    background: 'var(--bg-page)',
    color: 'var(--text-main)',
    borderRadius: '12px',
    padding: '8px 14px',
    fontSize: '14px',
    outline: 'none',
  },
};

const topLinks = [
  { key: 'dashboard', to: '/jobseeker/pages/Dashboard', label: 'Dashboard' },
  { key: 'jobs', to: '/jobseeker/pages/JobSearch', label: 'Jobs' },
  { key: 'applications', to: '/jobseeker/pages/Applications', label: 'Applications' },
  { key: 'insights', to: '/jobseeker/pages/Insights', label: 'Insights' },
  { key: 'learning', to: '/jobseeker/pages/Learning', label: 'Learning' },
  { key: 'notifications', to: '/jobseeker/pages/Notifications', label: 'Alerts' },
  { key: 'profile', to: '/jobseeker/pages/Profile', label: 'Profile' },
];

const sideLinks = [
  { key: 'dashboard', to: '/jobseeker/pages/Dashboard', label: 'Dashboard' },
  { key: 'jobs', to: '/jobseeker/pages/JobSearch', label: 'Job Search' },
  { key: 'applications', to: '/jobseeker/pages/Applications', label: 'Applications' },
  { key: 'insights', to: '/jobseeker/pages/Insights', label: 'Insights' },
  { key: 'learning', to: '/jobseeker/pages/Learning', label: 'Learning' },
  { key: 'notifications', to: '/jobseeker/pages/Notifications', label: 'Notifications' },
  { key: 'profile', to: '/jobseeker/pages/Profile', label: 'Profile' },
];

const JobSeekerShell = ({ active, children }) => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div style={styles.page} className={isDark ? 'dark' : ''}>
      <header style={styles.top}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="relative hidden md:block">
            <input style={styles.search} placeholder="Search jobs, skills..." />
          </div>
        </div>
        <nav style={styles.topNav}>
          <div className="hidden lg:flex gap-6 mr-4">
            {topLinks.map((item) => (
              <Link
                key={item.key}
                to={item.to}
                style={{
                  textDecoration: 'none',
                  color: active === item.key ? '#2563eb' : 'var(--text-muted)',
                  fontWeight: active === item.key ? 700 : 500,
                  fontSize: '14px'
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1"></div>
          <button 
            onClick={async () => {
              const { logoutUser } = await import('../../auth/services/authService').catch(() => ({}));
              if (logoutUser) await logoutUser();
              else {
                // local fallback if import fails
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('currentUser');
                localStorage.removeItem('userRole');
              }
              navigate('/auth/login', { replace: true });
            }}
            className="text-sm font-bold text-red-500 hover:text-red-600 transition-colors flex items-center gap-1 bg-transparent border-none cursor-pointer p-0"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Logout
          </button>
        </nav>
      </header>

      <div style={styles.body}>

        <main style={styles.main}>
          <div className="min-h-[calc(100vh-140px)]">{children}</div>
          {active !== 'profile' && <GlobalFooter />}
        </main>
      </div>
      <LogoModal />
    </div>
  );
};

export default JobSeekerShell;
