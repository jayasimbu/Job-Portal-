import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Moon, Sun, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { getCurrentUser, logout } from '../auth/session';
import Sidebar from '../components/Sidebar';

const AdminLayout = ({ children }) => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const mainContent = document.getElementById('admin-main-content');
    const handleScroll = () => {
      setScrolled(mainContent.scrollTop > 20);
    };
    mainContent?.addEventListener('scroll', handleScroll);
    return () => mainContent?.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#0a0f14] transition-colors font-sans">
      <Sidebar 
        role="admin" 
        isCollapsed={isSidebarCollapsed} 
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />

      <div className={`flex-1 flex flex-col min-w-0 transition-all ${isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'}`}>
        {/* Header */}
        <header className={`h-14 flex-shrink-0 px-6 flex items-center justify-between sticky top-0 z-[40] transition-all ${
          scrolled ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800' : 'bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800'
        }`}>
          <div>
            <h1 className="text-sm font-semibold text-slate-900 dark:text-white">
              Admin Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg w-56">
              <Search size={14} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-sm w-full text-slate-600 dark:text-slate-300 placeholder:text-slate-400"
              />
            </div>

            <button 
              onClick={toggleTheme}
              className="size-8 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button className="size-8 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-blue-600 transition-colors border border-slate-200 dark:border-slate-700 flex items-center justify-center relative">
              <Bell size={16} />
              <span className="absolute top-1 right-1 size-1.5 bg-blue-600 rounded-full"></span>
            </button>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

            {/* User */}
            <div className="flex items-center gap-2 group cursor-pointer relative">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-700 dark:text-white leading-tight">{user?.full_name || 'Admin'}</p>
                <p className="text-[10px] text-slate-400 font-medium leading-tight">Administrator</p>
              </div>
              <div className="size-8 bg-slate-900 dark:bg-slate-700 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                {user?.full_name?.charAt(0) || 'A'}
              </div>

              {/* Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <button 
                  onClick={handleLogout}
                  className="w-full px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/10 flex items-center gap-2 transition-colors"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main id="admin-main-content" className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-[1200px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
