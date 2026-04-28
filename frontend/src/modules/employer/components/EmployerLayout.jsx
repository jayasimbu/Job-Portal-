import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Moon, Sun } from 'lucide-react';
import logo from '../../../assets/logos/career_auto_logo.png';
import { useTheme } from '../../../core/context/ThemeContext';
import { getCurrentUser } from '../../../core/auth/session';
import { logoutUser } from '../../auth/services/authService';

const EmployerLayout = ({ children }) => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Dashboard', to: '/platform/employer/dashboard', icon: 'dashboard' },
    { label: 'Post Job', to: '/platform/employer/post-job', icon: 'add_circle' },
    { label: 'Candidates', to: '/platform/employer/candidates', icon: 'groups' },
    { label: 'Analytics', to: '/platform/employer/analytics', icon: 'analytics' },
    { label: 'Settings', to: '/platform/employer/profile', icon: 'settings' },
  ];

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#f8faff] dark:bg-[#020617] transition-colors duration-300 font-manrope">
      {/* Top Navbar */}
      <header className="flex-shrink-0 sticky top-0 z-[70] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="relative max-w-[1400px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          
          {/* Left: Logo & Tag */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group decoration-none">
              <div className="size-8 bg-blue-600 rounded-lg flex items-center justify-center p-1 transition-transform group-hover:scale-110 shadow-lg shadow-blue-500/20">
                <img src={logo} alt="L" className="w-full h-full object-cover scale-110" />
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white uppercase hidden sm:inline-block">Career Auto</span>
            </Link>
            <span className="text-[9px] font-black bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 px-2.5 py-0.5 rounded-full uppercase tracking-widest hidden xs:inline-block">Employer</span>
          </div>

          {/* Center: Desktop Nav */}
          <div className="absolute left-1/2 top-0 h-full -translate-x-1/2 hidden md:block">
            <nav className="flex items-center gap-6 h-full">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `relative h-full flex items-center px-1 text-[11px] font-black uppercase tracking-widest transition-all duration-300 ease-in-out decoration-none ${
                      isActive
                        ? 'text-purple-600 dark:text-purple-400 border-b-[2px] border-purple-600 dark:border-purple-400'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-b-[2px] border-transparent hover:border-slate-300 dark:hover:border-slate-700'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={toggleTheme}
              className="size-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-600 transition-all duration-200"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-700">
              <div className="size-9 bg-purple-600 text-white rounded-full flex items-center justify-center font-black text-xs uppercase shadow-lg shadow-purple-500/20">
                {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'E'}
              </div>
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors group"
                title="Logout"
              >
                <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="md:hidden size-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all duration-200"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xl z-[70] animate-in fade-in slide-in-from-top-4 duration-200">
            <nav className="flex flex-col p-4 gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                      isActive 
                        ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' 
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
                  <div className="size-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-black text-sm uppercase">
                    {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'E'}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[150px]">
                      {user?.full_name || user?.email || 'Employer'}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-tight">Employer Hub</span>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="size-10 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto py-5 px-4 md:px-6 scroll-smooth">
        <div className="max-w-[1200px] mx-auto h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default EmployerLayout;
