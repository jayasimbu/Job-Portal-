import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Moon, Sun } from 'lucide-react';
import logo from '../../assets/logos/linkup_logo.png';
import { useTheme } from '../context/ThemeContext';
import { getCurrentUser } from '../auth/session';
import { logoutUser } from '../../modules/auth/services/authService';
import { ResumeProvider } from '../../modules/jobseeker/context/ResumeContext';

const AppLayout = ({ children, title }) => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navLinks = [
    { label: 'Dashboard', to: '/platform/jobseeker/dashboard', icon: 'dashboard' },
    { label: 'Jobs', to: '/platform/jobseeker/jobs', icon: 'work' },
    { label: 'Applications', to: '/platform/jobseeker/applications', icon: 'send' },
    { label: 'Learning', to: '/platform/jobseeker/learning', icon: 'school' },
    { label: 'Profile', to: '/platform/jobseeker/profile', icon: 'person' },
  ];

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <ResumeProvider>
    <div className={`h-screen flex flex-col overflow-hidden bg-[#f8faff] dark:bg-[#020617] transition-colors duration-300 font-manrope`}>
      {/* Platform Header */}
      <header className="flex-shrink-0 sticky top-0 z-[70] bg-white border-b border-slate-100 dark:bg-slate-900 dark:border-slate-800">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
             <div className="size-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-white text-xl">all_inclusive</span>
             </div>
             <span className="font-bold text-lg tracking-tighter text-slate-900 dark:text-white uppercase">LINKUP</span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => 
                  `text-[10px] font-black uppercase tracking-[0.2em] transition-all relative py-2 ${
                    isActive 
                      ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600' 
                      : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
             <button className="size-9 rounded-md bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors border border-slate-100">
                <span className="material-symbols-outlined text-lg">notifications</span>
             </button>
             
             <div className="flex items-center gap-3 pl-4 border-l border-slate-100 dark:border-slate-800">
                <div className="text-right hidden sm:block">
                   <p className="text-xs font-bold text-slate-900 dark:text-white leading-none mb-1">{user?.full_name || 'Jaya Simbu'}</p>
                   <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tight leading-none">Jobseeker Account</p>
                </div>
                <div className="size-9 bg-slate-800 dark:bg-blue-600 rounded-md flex items-center justify-center text-white font-bold text-sm">
                   {user?.full_name?.charAt(0) || 'J'}
                </div>
             </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-lg z-[70]">
            <nav className="flex flex-col p-4 gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-semibold transition-all ${
                      isActive 
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                    }`
                  }
                >
                  <span className="material-symbols-outlined text-lg">{link.icon}</span>
                  {link.label}
                </NavLink>
              ))}
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                  <div className="size-9 bg-blue-600 text-white rounded-md flex items-center justify-center font-bold text-xs">
                    {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[150px]">
                      {user?.full_name || user?.email || 'User'}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase">Active Session</span>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="size-9 rounded-md bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto py-8 px-4 md:px-8 bg-slate-50/50">
        <div className="max-w-[1200px] mx-auto h-full">
          {title && (
            <div className="mb-6">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight uppercase">
                {title}
              </h1>
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
    </ResumeProvider>
  );
};

export default AppLayout;
