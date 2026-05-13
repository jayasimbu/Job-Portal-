import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../core/context/ThemeContext';
import Logo from '../../../core/components/Logo';

const NAV_ITEMS = [
  { icon: 'grid_view', label: 'Dashboard', to: '/platform/jobseeker/dashboard', end: true },
  { icon: 'analytics', label: 'Resume Match', to: '/platform/jobseeker/jd-match-analysis', end: true },
  { icon: 'search', label: 'Jobs', to: '/platform/jobseeker/jobs', end: false },
  { icon: 'work_outline', label: 'Applications', to: '/platform/jobseeker/applications', end: false },
  { icon: 'school', label: 'Learning', to: '/platform/jobseeker/learning', end: false },
  { icon: 'person_outline', label: 'Profile', to: '/platform/jobseeker/profile', end: false },
];

const JobSeekerSidebar = () => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const user = (() => { try { return JSON.parse(localStorage.getItem('currentUser') || '{}'); } catch { return {}; } })();
  const userEmail = user.email || '';
  const userName = user.full_name || userEmail.split('@')[0] || 'Member';
  const initial = (userName.charAt(0) || 'U').toUpperCase();

  return (
    <>
      <aside 
        className="fixed top-0 left-0 w-[270px] h-screen bg-slate-50 dark:bg-[#0f172a] border-r border-slate-200 dark:border-slate-700/50 flex flex-col z-40 transition-all "
      >
        <div className="p-7">
          <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={() => navigate('/')}>
            <Logo size="default" />
          </div>

          <nav className="space-y-2">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `
                  flex items-center gap-[14px] px-5 py-4 rounded-2xl text-[16px] font-semibold transition-all
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                  }
                `}
              >
                <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-4 border-t border-slate-200 dark:border-slate-700/50">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3.5 px-5 py-3 rounded-2xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-semibold text-[15px]"
          >
            <span className="material-symbols-outlined text-[22px]">
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
            <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-full flex items-center gap-3.5 p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group"
            >
              <div className="size-11 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-md">
                {initial}
              </div>
              <div className="flex flex-col text-left min-w-0 flex-1">
                <span className="text-sm font-bold text-slate-900 dark:text-white truncate">{userName}</span>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Verified Pro</span>
              </div>
              <span className={`material-symbols-outlined text-slate-300 text-base transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}>unfold_more</span>
            </button>

            {isProfileOpen && (
              <div className="absolute bottom-full left-0 w-full mb-3 bg-slate-50 dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-2.5 duration-200">
                <button onClick={() => navigate('/platform/jobseeker/profile')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                  <span className="material-symbols-outlined text-xl">account_circle</span>
                  Profile Settings
                </button>
                <button 
                  onClick={() => { localStorage.clear(); navigate('/auth/login'); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
                >
                  <span className="material-symbols-outlined text-xl">logout</span>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      <style>{`
        @media (min-width: 1024px) {
          .jobseeker-content-area {
            padding-left: 270px;
          }
        }
      `}</style>
    </>
  );
};

export default JobSeekerSidebar;



