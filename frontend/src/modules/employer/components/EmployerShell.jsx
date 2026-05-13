import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../core/context/ThemeContext';
import Logo from '../../../core/components/Logo';
import GlobalFooter from '../../../core/components/GlobalFooter';
import LogoModal from '../../../core/components/LogoModal';

const styles = {
  page: { minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-page)', color: 'var(--text-main)', transition: '0.3s', fontFamily: "'Manrope', sans-serif" },
  top: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 32px',
    background: 'white',
    borderBottom: '1px solid var(--border)',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  brand: { fontWeight: 800, fontSize: '20px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' },
  logoCont: { height: '36px', width: '36px', background: '#2563eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', p: 0, cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.4)' },
  logo: { height: '100%', width: '100%', objectFit: 'cover', transform: 'scale(1.3)' },
  body: { display: 'flex', flex: 1, minHeight: 'calc(100vh - 80px)' },
  side: { width: '280px', background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border)', padding: '24px 20px', height: 'calc(100vh - 80px)', position: 'sticky', top: '80px', overflowY: 'auto' },
  sideLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 14px',
    textDecoration: 'none',
    color: 'var(--text-muted)',
    borderRadius: '12px',
    fontWeight: 600,
    fontSize: '14px',
    marginBottom: '4px',
    transition: '0.2s',
  },
  sideLinkActive: { background: 'rgba(15, 23, 42, 0.08)', color: '#0f172a' },
  main: { flex: 1, padding: '24px', maxWidth: '1440px', margin: '0 auto', width: '100%' },
  badge: { fontSize: '10px', fontWeight: 700, color: '#f97316', background: '#fff7ed', padding: '2px 8px', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '0.05em', marginLeft: '4px' },
};

const nav = [
  { key: 'dashboard', to: '/platform/employer/dashboard', label: 'Dashboard' },
  { key: 'post', to: '/platform/employer/post-job', label: 'Post Job' },
  { key: 'candidates', to: '/platform/employer/candidates', label: 'Candidates' },
  { key: 'analytics', to: '/platform/employer/analytics', label: 'Analytics' },
  { key: 'policy', to: '/platform/employer/hiring-policy', label: 'Hiring Policy' },
  { key: 'interview', to: '/platform/employer/interviews', label: 'Interviews' },
  { key: 'profile', to: '/platform/employer/profile', label: 'Company Profile' },
];

const EmployerShell = ({ active, children }) => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div style={styles.page} className={isDark ? 'dark' : ''}>
      <header style={styles.top}>
          <div className="flex items-center gap-3 group">
            <Link to="/" className="no-underline">
              <Logo />
            </Link>
            <span style={styles.badge}>Employer</span>
          </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <input
            placeholder="Search candidates..."
            style={{ 
              border: '1px solid var(--border)', 
              borderRadius: '12px', 
              padding: '8px 14px', 
              width: '280px',
              background: 'var(--bg-page)',
              color: 'var(--text-main)',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          <button
            onClick={toggleTheme}
            className="size-9 rounded-full bg-[var(--bg-page)] dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center transition-all hover:border-blue-500 hover:shadow-md active:scale-95"
            title="Toggle Theme"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1"></div>
          <button 
            onClick={async () => {
              const { logoutUser } = await import('../../auth/services/authService').catch(() => ({}));
              if (logoutUser) await logoutUser();
              else {
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
        </div>
      </header>

      <div style={styles.body}>
        <aside style={styles.side}>
          <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 700, marginBottom: '14px' }}>RECRUITER MENU</div>
          {nav.map((item) => (
            <Link key={item.key} to={item.to} style={{ ...styles.sideLink, ...(active === item.key ? styles.sideLinkActive : {}) }}>
              {item.label}
            </Link>
          ))}
        </aside>

        <main style={styles.main}>
          <div className="min-h-[calc(100vh-140px)] w-full max-w-[1200px] mx-auto">{children}</div>
        </main>
      </div>
      <LogoModal />
    </div>
  );
};

export default EmployerShell;



