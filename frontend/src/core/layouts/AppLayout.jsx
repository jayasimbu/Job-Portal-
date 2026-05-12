import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, Search, Moon, Sun, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { getCurrentUser, getCurrentUserRole } from '../auth/session';
import { ResumeProvider } from '../../modules/jobseeker/context/ResumeContext';
import Sidebar from '../components/Sidebar';
import ProfileDropdown from '../components/ProfileDropdown';

const AppLayout = ({ children, title }) => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();
  const userRole = getCurrentUserRole();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    const handleScroll = () => {
      setScrolled(mainContent.scrollTop > 20);
    };

    mainContent.addEventListener('scroll', handleScroll);
    return () => mainContent.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <ResumeProvider>
      <div className="h-screen flex overflow-hidden bg-white dark:bg-[#0a0f14] transition-colors font-sans">
        <Sidebar role={userRole || 'jobseeker'} />

        <div className="flex-1 flex flex-col min-w-0 md:pl-[270px]">
          {/* Header */}
          <header className={`h-20 flex-shrink-0 px-8 flex items-center justify-between sticky top-0 z-50 transition-all ${
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
              {/* Profile Section with Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <div 
                  className="flex items-center gap-4 pl-2 group cursor-pointer"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="text-right hidden sm:block">
                    <p className="text-[15px] font-bold text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 transition-colors">{user?.full_name || 'Professional'}</p>
                    <div className="flex items-center justify-end gap-1.5 mt-0.5">
                       <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest leading-tight">Identity Verified</span>
                       <div className="size-3.5 bg-blue-600 rounded-full flex items-center justify-center">
                          <Sparkles size={8} className="text-white fill-white" />
                       </div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="size-11 bg-slate-900 dark:bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-xl shadow-blue-500/10 transition-all group-hover:scale-110 group-hover:rotate-3 border-2 border-white dark:border-slate-800">
                      {user?.full_name?.charAt(0) || 'J'}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 size-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                  </div>
                </div>

                {/* DROPDOWN POPUP */}
                {isDropdownOpen && (
                  <ProfileDropdown 
                    user={user} 
                    onClose={() => setIsDropdownOpen(false)} 
                  />
                )}
              </div>
            </div>
          </header>

          {/* Main Content Area - Only this scrolls */}
          <main id="main-content" className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-8 pb-10 scroll-smooth">
            <div className="max-w-[1440px] mx-auto ">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ResumeProvider>
  );
};

export default AppLayout;



