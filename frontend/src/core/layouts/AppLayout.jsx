import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, Search, Moon, Sun, UserCircle, Sparkles, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { getCurrentUser } from '../auth/session';
import { ResumeProvider } from '../../modules/jobseeker/context/ResumeContext';
import Sidebar from '../components/Sidebar';

const AppLayout = ({ children, title }) => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const mainContent = document.getElementById('main-content');
    const handleScroll = () => {
      setScrolled(mainContent.scrollTop > 20);
    };
    mainContent?.addEventListener('scroll', handleScroll);
    return () => mainContent?.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <ResumeProvider>
      <div className="min-h-screen flex bg-white dark:bg-[#0a0f14] transition-colors font-sans">
        <Sidebar 
          role="jobseeker" 
          isCollapsed={isSidebarCollapsed} 
          toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        />

        <div className={`flex-1 flex flex-col min-w-0 transition-all ${isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'}`}>
          {/* Header */}
          <header className={`h-20 flex-shrink-0 px-8 flex items-center justify-between sticky top-0 z-[40] transition-all ${
            scrolled ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 shadow-sm' : 'bg-transparent'
          }`}>
            <div className="flex items-center gap-4">
               {title && (
                 <div className="flex flex-col">
                   <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
                     {title}
                   </h1>
                   <div className="flex items-center gap-2 mt-1">
                      <div className="size-1.5 bg-emerald-500 rounded-full " />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Active</span>
                   </div>
                 </div>
               )}
            </div>

            <div className="flex items-center gap-6">
              {/* Search Bar */}
              <div className="hidden lg:flex items-center gap-3 px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl w-64 focus-within:w-80 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-600/50 transition-all group">
                <Search size={18} className="text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input 
                  type="text" 
                  placeholder={
                    location.pathname.includes('jobs') ? "Search roles, skills, or companies" :
                    location.pathname.includes('applications') ? "Search applications" :
                    location.pathname.includes('candidates') ? "Search candidates by skill" : "Search platform..."
                  } 
                  className="bg-transparent border-none outline-none text-sm w-full text-slate-700 dark:text-slate-200 font-medium placeholder:text-slate-400"
                />
                <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-1.5 font-mono text-[10px] font-medium text-slate-400 opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={toggleTheme}
                  className="size-11 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 hover:shadow-md transition-all border border-slate-100 dark:border-slate-700"
                >
                  {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <button className="size-11 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-blue-600 transition-all border border-slate-100 dark:border-slate-700 flex items-center justify-center relative hover:bg-white dark:hover:bg-slate-700 hover:shadow-md">
                  <Bell size={20} />
                  <span className="absolute top-2.5 right-2.5 size-2 bg-blue-600 rounded-full border-2 border-white dark:border-slate-900 shadow-sm "></span>
                </button>
              </div>
              
              <div className="h-8 w-px bg-slate-100 dark:bg-slate-800 mx-2"></div>

              <div 
                className="flex items-center gap-3 pl-2 group cursor-pointer"
                onClick={() => navigate('/platform/jobseeker/profile')}
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 transition-colors">{user?.full_name || 'Professional'}</p>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-tight mt-0.5">Identity Verified</p>
                </div>
                <div className="relative">
                   <div className="size-11 bg-slate-900 dark:bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-xl shadow-blue-500/10 transition-all group-hover:scale-110 group-hover:rotate-3">
                    {user?.full_name?.charAt(0) || 'J'}
                  </div>
                  <div className="absolute -bottom-1 -right-1 size-5 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center">
                     <Sparkles size={8} className="text-white fill-white" />
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main id="main-content" className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
            <div className="max-w-[1400px] mx-auto ">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ResumeProvider>
  );
};

export default AppLayout;



