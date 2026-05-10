import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Moon, Sun } from 'lucide-react';
import logo from '../../../assets/logos/linkup_logo.png';
import { useTheme } from '../../../core/context/ThemeContext';
import { getCurrentUser } from '../../../core/auth/session';
import { logoutUser } from '../../auth/services/authService';

const EmployerLayout = ({ children }) => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Dashboard', to: '/platform/employer/dashboard', icon: 'grid_view' },
    { label: 'Post a Job', to: '/platform/employer/post-job', icon: 'add_box' },
    { label: 'Talent Pool', to: '/platform/employer/candidates', icon: 'diversity_3' },
    { label: 'Analytics', to: '/platform/employer/analytics', icon: 'bar_chart' },
    { label: 'Profile', to: '/platform/employer/profile', icon: 'business' },
  ];

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-50 dark:bg-[#0f172a] transition-colors duration-300 font-sans">
      {/* Top Navbar */}
      <header className="flex-shrink-0 sticky top-0 z-[70] bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800/50">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3 group decoration-none">
              <div className="size-10 flex items-center justify-center transition-transform group-hover:scale-110">
                <img src={logo} alt="LINKUP" className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white uppercase hidden sm:inline-block">LINKUP</span>
            </Link>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2 hidden md:block" />
            <span className="text-[10px] font-bold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full uppercase tracking-widest hidden xs:inline-block">Recruiter Hub</span>
          </div>

          <nav className="hidden lg:flex items-center gap-8 h-full">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `relative flex items-center gap-2 py-5 text-sm font-semibold transition-all ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`
                }
              >
                <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="size-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="hidden sm:flex items-center gap-4 pl-4 border-l border-slate-100 dark:border-slate-800">
              <div className="flex flex-col items-end mr-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[120px]">
                  {user?.full_name || user?.email?.split('@')[0] || 'Employer'}
                </span>
                <span className="text-[10px] font-medium text-slate-400">Enterprise</span>
              </div>
              <button onClick={handleLogout} className="size-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-red-500 transition-all flex items-center justify-center">
                <LogOut size={18} />
              </button>
            </div>

            <button
              onClick={toggleMenu}
              className="lg:hidden size-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-blue-50 transition-all"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-2xl z-[70] animate-in fade-in slide-in-from-top-4 duration-300">
            <nav className="flex flex-col p-6 gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) => 
                    `flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all ${
                      isActive 
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                    }`
                  }
                >
                  <span className="material-symbols-outlined text-xl">{link.icon}</span>
                  {link.label}
                </NavLink>
              ))}
              <div className="mt-4 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-sm">
                    {(user?.full_name || user?.email || 'E')[0].toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">Account Hub</span>
                    <span className="text-xs text-slate-500">Sign Out</span>
                  </div>
                </div>
                <button onClick={handleLogout} className="size-11 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors">
                  <LogOut size={20} />
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1 overflow-y-auto py-8 px-6 scroll-smooth bg-white dark:bg-[#0d141b]">
        <div className="max-w-[1400px] mx-auto h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default EmployerLayout;
