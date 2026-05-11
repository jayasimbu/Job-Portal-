import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../core/context/ThemeContext';
import logo from '../../../assets/logos/linkup_logo.png';

const NAV_ITEMS = [
  { icon: 'grid_view', label: 'Dashboard', to: '/jobseeker/dashboard', end: true },
  { icon: 'search', label: 'Job Marketplace', to: '/jobseeker/jobs', end: true },
  { icon: 'compare_arrows', label: 'JD Match', to: '/jobseeker/jd-match', end: false },
  { icon: 'work_outline', label: 'Applications', to: '/jobseeker/applications', end: false },
  { icon: 'school', label: 'Upskilling', to: '/jobseeker/learning', end: false },
  { icon: 'person_outline', label: 'My Profile', to: '/jobseeker/profile', end: false },
];

const JobSeekerSidebar = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const userEmail = user.email || '';
  const userName = user.full_name || userEmail.split('@')[0] || 'Member';
  const initial = (userName.charAt(0) || 'U').toUpperCase();

  return (
    <>
      <aside 
        className="fixed top-0 left-0 w-[240px] h-screen bg-white dark:bg-[#0f172a] border-r border-slate-100 dark:border-slate-800/50 flex flex-col z-40 transition-all duration-300"
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div 
              onClick={() => navigate('/')}
              className="size-10 bg-blue-600 rounded-xl flex items-center justify-center p-2 shadow-lg shadow-blue-500/20 cursor-pointer"
            >
              <img src={logo} alt="L" className="w-full h-full object-contain brightness-0 invert" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white uppercase">LINKUP</span>
          </div>

          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all
                  ${isActive 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                  }
                `}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-100 dark:border-slate-800/50">
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-full flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group"
            >
              <div className="size-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                {initial}
              </div>
              <div className="flex flex-col text-left min-w-0 flex-1">
                <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">{userName}</span>
                <span className="text-[10px] font-medium text-slate-400 truncate">Free Tier</span>
              </div>
              <span className={`material-symbols-outlined text-slate-300 text-base transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}>unfold_more</span>
            </button>

            {isProfileOpen && (
              <div className="absolute bottom-full left-0 w-full mb-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-2 animate-in slide-in-from-bottom-2 fade-in duration-200">
                <button onClick={() => navigate('/jobseeker/profile')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                  <span className="material-symbols-outlined text-lg">account_circle</span>
                  Profile
                </button>
                <button 
                  onClick={() => { localStorage.clear(); navigate('/auth/login'); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
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
            padding-left: 240px;
          }
        }
      `}</style>
    </>
  );
};

export default JobSeekerSidebar;
