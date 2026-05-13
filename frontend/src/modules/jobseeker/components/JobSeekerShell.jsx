import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../core/context/ThemeContext';
import Logo from '../../../core/components/Logo';
import GlobalFooter from '../../../core/components/GlobalFooter';
import LogoModal from '../../../core/components/LogoModal';

const styles = {
  page: { minHeight: '100vh', background: 'var(--bg-page)', color: 'var(--text-main)', transition: '0.3s', fontFamily: "'Outfit', sans-serif" },
  top: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 32px',
    borderBottom: '1px solid var(--border)',
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(12px)',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  brand: { display: 'flex', flexDirection: 'column', gap: '0px', textDecoration: 'none', lineHeight: 1 },
  logoText: { fontWeight: 900, fontSize: '22px', color: '#0f172a', letterSpacing: '-0.5px' },
  subText: { fontWeight: 800, fontSize: '9px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' },
  topNav: { display: 'flex', gap: '24px', alignItems: 'center' },
  body: { display: 'block' },
  main: { padding: '24px', maxWidth: '1440px', margin: '0 auto', width: '100%' },
  search: {
    width: '240px',
    border: '1px solid var(--border)',
    background: '#f8fafc',
    color: 'var(--text-main)',
    borderRadius: '12px',
    padding: '10px 16px',
    fontSize: '13px',
    outline: 'none',
    transition: 'all 0.2s',
  },
};

const topLinks = [
  { key: 'dashboard', to: '/platform/jobseeker/dashboard', label: 'Dashboard' },
  { key: 'resume', to: '/platform/jobseeker/resume-insights', label: 'Resume' },
  { key: 'jobs', to: '/platform/jobseeker/jobs', label: 'Jobs' },
  { key: 'applications', to: '/platform/jobseeker/applications', label: 'Applications' },
  { key: 'learning', to: '/platform/jobseeker/learning', label: 'Learning' },
  { key: 'profile', to: '/platform/jobseeker/profile', label: 'Profile' },
];

const JobSeekerShell = ({ active, children }) => {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <header style={styles.top}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <Link to="/platform/jobseeker/dashboard" style={styles.brand}>
            <Logo />
          </Link>
          
          <div className="relative hidden md:block">
            <input 
              style={styles.search} 
              placeholder="Search roles, skills..." 
              className="focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        <nav style={styles.topNav}>
          <div className="hidden lg:flex gap-8 mr-6">
            {topLinks.map((item) => (
              <Link
                key={item.key}
                to={item.to}
                style={{
                  textDecoration: 'none',
                  color: active === item.key ? '#2563eb' : '#64748b',
                  fontWeight: active === item.key ? 800 : 600,
                  fontSize: '13px',
                  letterSpacing: '0.2px'
                }}
                className="hover:text-blue-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
             <button className="p-2 hover:bg-slate-100 rounded-full transition-colors relative">
               <span className="material-symbols-outlined text-[20px] text-slate-500">notifications</span>
               <div className="absolute top-2 right-2 size-2 bg-rose-500 rounded-full border-2 border-white"></div>
             </button>
             
             <button 
                onClick={async () => {
                  localStorage.clear();
                  navigate('/auth/login', { replace: true });
                }}
                className="size-9 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xs hover:bg-slate-800 transition-all shadow-md active:scale-95"
              >
                {(() => {
                  try {
                    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
                    return user.full_name?.charAt(0) || 'J';
                  } catch {
                    return 'J';
                  }
                })()}
              </button>
          </div>
        </nav>
      </header>

      <main style={styles.main}>
        <div className="min-h-[calc(100vh-160px)]">{children}</div>
        <GlobalFooter />
      </main>
      <LogoModal />
    </div>
  );
};

export default JobSeekerShell;



