import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../core/context/ThemeContext';
import logo from '../../../assets/logos/career_auto_logo.png';

const NAV_ITEMS = [
  { icon: 'dashboard', label: 'Dashboard', to: '/jobseeker/dashboard', end: true },
  { icon: 'search', label: 'Job Search', to: '/jobseeker/jobs', end: true },
  { icon: 'bookmark', label: 'My Jobs', to: '/jobseeker/jobs/saved', end: false },
  { icon: 'work', label: 'Applications', to: '/jobseeker/applications', end: false },
  { icon: 'cloud_upload', label: 'Upload Resume', to: '/jobseeker/upload-resume', end: false },
  { icon: 'analytics', label: 'Resume Insights', to: '/jobseeker/insights', end: false },
  { icon: 'school', label: 'Learning', to: '/jobseeker/learning', end: false },
  { icon: 'chat', label: 'Messages', to: '/jobseeker/notifications', end: false },
  { icon: 'history', label: 'Search History', to: '/jobseeker/search-history', end: false },
  { icon: 'person', label: 'Profile Settings', to: '/jobseeker/profile', end: false },
];

const JobSeekerSidebar = () => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Formulate correct username and initial strictly via full_name and email
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const userEmail = user.email || '';
  const userName = user.full_name || userEmail || 'User';
  const initial = (user.full_name?.charAt(0) || userEmail?.charAt(0) || 'U').toUpperCase();

  return (
    <>
      {/* Sidebar Panel */}
      <aside 
        id="career-auto-sidebar"
        className="fixed top-0 left-0 w-[220px] h-screen bg-white dark:bg-[#1a2632] border-r border-[#e4eaf0] dark:border-[#2a3b4d] flex flex-col z-40 p-5 pb-6 transition-all duration-300 overflow-y-auto"
      >
        {/* Brand Row */}
        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-[#e4eaf0] dark:border-[#2a3b4d]">
          <div 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.dispatchEvent(new CustomEvent('open-logo-modal')); }}
            className="w-[38px] h-[38px] rounded-xl bg-white flex items-center justify-center shadow-sm overflow-hidden p-1 border border-slate-100 cursor-pointer hover:scale-105 transition-transform group-hover:shadow-md"
            title="View Logo"
          >
            <img src={logo} alt="Logo" className="w-full h-full object-contain pointer-events-none" />
          </div>
          <div 
            onClick={() => navigate('/')} 
            className="flex flex-col overflow-hidden cursor-pointer hover:text-blue-600 transition-colors"
            title="Go to Home"
          >
            <span className="text-sm font-extrabold text-[#0d141b] dark:text-white truncate hover:text-blue-600">Career Auto</span>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-[#1e3a5f] dark:text-[#60a5fa] px-2 py-0.5 rounded-full w-fit mt-0.5">Pro Plan</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1 flex-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                ${isActive 
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                  : 'text-[#4a6075] dark:text-[#94a3b8] hover:bg-blue-50/50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400'
                }
              `}
            >
              <span className="material-symbols-outlined text-[20px] shrink-0">{item.icon}</span>
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer / Profile */}
        <div className="mt-auto pt-4 border-t border-[#e4eaf0] dark:border-[#2a3b4d]">
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-[#1e3a5f] transition-colors text-left group"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                {user.picture ? (
                  <img src={user.picture} alt="avatar" className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center shrink-0">
                    {initial}
                  </div>
                )}
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-bold text-slate-900 dark:text-white truncate max-w-[100px]">{userName}</span>
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 truncate max-w-[100px]">{userEmail}</span>
                </div>
              </div>
              <span className={`material-symbols-outlined text-slate-400 text-base transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}>
                expand_less
              </span>
            </button>

            {/* Profile Dropup Menu */}
            {isProfileOpen && (
              <div className="absolute bottom-[110%] left-0 w-full bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in slide-in-from-bottom-2 fade-in duration-200 z-50">
                <div className="p-2 flex flex-col gap-1">
                  <NavLink to="/jobseeker/profile" className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">person</span>
                    Profile
                  </NavLink>
                  <NavLink to="/platform/settings" className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">settings</span>
                    Settings
                  </NavLink>

                </div>
                <div className="p-2 border-t border-slate-100 dark:border-slate-800">
                  <button 
                    onClick={() => {
                      localStorage.clear();
                      navigate('/auth/login');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-red-600 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Shift Helper (for body) */}
      <style>{`
        @media (min-width: 1024px) {
          .jobseeker-content-area {
            padding-left: 220px;
          }
        }
      `}</style>
    </>
  );
};

export default JobSeekerSidebar;
