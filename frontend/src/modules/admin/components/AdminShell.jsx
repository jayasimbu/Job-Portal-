import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../core/context/ThemeContext';
import logo from '../../../assets/logos/career_auto_logo.png';
import GlobalFooter from '../../../core/components/GlobalFooter';
import LogoModal from '../../../core/components/LogoModal';

const styles = {
  page: { minHeight: '100vh', background: 'var(--bg-page)', color: 'var(--text-main)', transition: '0.3s', fontFamily: "'Manrope', sans-serif" },
  top: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 24px',
    background: 'white',
    opacity: 0.9,
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid var(--border)',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  brand: { fontWeight: 800, fontSize: '20px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' },
  logoCont: { height: '36px', width: '36px', background: '#2563eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', p: 0, cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.4)' },
  logo: { height: '100%', width: '100%', objectFit: 'cover', transform: 'scale(1.3)' },
  badge: { fontSize: '10px', fontWeight: 700, color: '#2563eb', backgroundColor: '#eff6ff', padding: '2px 8px', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '0.05em', marginLeft: '4px' },
  body: { display: 'grid', gridTemplateColumns: '240px 1fr' },
  side: { background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border)', padding: '20px 16px', height: 'calc(100vh - 53px)', position: 'sticky', top: '53px' },
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
  sideLinkActive: { background: 'rgba(37, 78, 216, 0.08)', color: '#1d4ed8' },
  main: { padding: '32px', maxWidth: '1600px', margin: '0 auto', width: '100%' },
};

const nav = [
  { key: 'dashboard', to: '/admin/pages/Dashboard', label: 'Dashboard' },
  { key: 'users', to: '/admin/pages/UserManagement', label: 'Users' },
  { key: 'companies', to: '/admin/pages/CompanyManagement', 'label': 'Companies' },
  { key: 'jobs', to: '/admin/pages/JobManagement', label: 'Jobs' },
  { key: 'analytics', to: '/admin/pages/Analytics', label: 'Analytics' },
  { key: 'logs', to: '/admin/pages/SystemLogs', label: 'System Logs' },
];

const AdminShell = ({ active, children }) => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div style={styles.page} className={isDark ? 'dark' : ''}>
      <header style={styles.top}>
        <div className="flex items-center gap-3 group">
          <div 
            style={styles.logoCont} 
            className="transition-transform group-hover:scale-110"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.dispatchEvent(new CustomEvent('open-logo-modal')); }}
          >
            <img src={logo} alt="Career Auto" style={styles.logo} />
          </div>
          <span 
            onClick={() => navigate('/')}
            className="font-black text-xl text-slate-900 dark:text-white tracking-tighter hover:text-blue-600 transition-colors uppercase cursor-pointer"
          >
            Career Auto
          </span>
          <span style={styles.badge}>Admin</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <input
            placeholder="Search users, jobs..."
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
          <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 700, marginBottom: '14px' }}>ADMIN MENU</div>
          {nav.map((item) => (
            <Link key={item.key} to={item.to} style={{ ...styles.sideLink, ...(active === item.key ? styles.sideLinkActive : {}) }}>
              {item.label}
            </Link>
          ))}
        </aside>

        <main style={styles.main}>
          <div className="min-h-[calc(100vh-140px)]">{children}</div>
          <GlobalFooter />
        </main>
      </div>
      <LogoModal />
    </div>
  );
};

export default AdminShell;
