import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Moon, Sun, LogOut, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { getCurrentUser, logout } from '../auth/session';
import Sidebar from '../components/Sidebar';

const AdminLayout = ({ children, title }) => {
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
    <div className="h-screen flex overflow-hidden bg-slate-50 dark:bg-[#0a0f14] transition-colors font-sans">
      <Sidebar role="admin" />

      <div className="flex-1 flex flex-col min-w-0 md:pl-[270px]">
        {/* Header */}
        <header className={`h-20 flex-shrink-0 px-8 flex items-center justify-between sticky top-0 z-50 transition-all ${
          scrolled ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 shadow-sm' : 'bg-transparent'
        }`}>
          <div>
            <div className="flex flex-col">
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
                {title || 'Admin Control Center'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div 
              className="flex items-center gap-4 pl-2 group cursor-pointer"
              onClick={() => navigate('/platform/admin/profile')}
            >
              <div className="text-right hidden sm:block">
                <p className="text-[15px] font-bold text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 transition-colors">{user?.full_name || 'Admin'}</p>
                <div className="flex items-center justify-end gap-1.5 mt-0.5">
                   <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest leading-tight">Master Admin</span>
                   <div className="size-3.5 bg-blue-600 rounded-full flex items-center justify-center">
                      <Sparkles size={8} className="text-white fill-white" />
                   </div>
                </div>
              </div>
              <div className="relative">
                 <div className="size-11 bg-slate-900 dark:bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-xl shadow-blue-500/10 transition-all group-hover:scale-110 group-hover:rotate-3 border-2 border-white dark:border-slate-800">
                  {user?.full_name?.charAt(0) || 'A'}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 size-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area - Only this scrolls */}
        <main id="admin-main-content" className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-6 pb-10 scroll-smooth">
          <div className="max-w-[1440px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
