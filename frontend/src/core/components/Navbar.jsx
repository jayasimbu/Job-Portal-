import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { UI } from '../../constants/ui';
import { logoutUser } from '../../modules/auth/services/authService';
import { getCurrentUser } from '../../core/auth/session';
import Logo from './Logo';
const Navbar = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  const getNavLinks = (role) => {
    if (role === 'admin') {
      return [
        { label: 'System Overview', to: '/platform/admin/dashboard' },
        { label: 'User Hub', to: '/platform/admin/users' },
        { label: 'Partners', to: '/platform/admin/companies' },
        { label: 'Marketplace', to: '/platform/admin/jobs' },
        { label: 'Talent Analytics', to: '/platform/admin/analytics' },
      ];
    }
    if (role === 'employer') {
      return [
        { label: 'Dashboard', to: '/platform/employer/dashboard' },
        { label: 'Post Job', to: '/platform/employer/post-job' },
        { label: 'Talent Pool', to: '/platform/employer/candidates' },
        { label: 'Interviews', to: '/platform/employer/interviews' },
        { label: 'Analytics', to: '/platform/employer/analytics' },
      ];
    }
    return [
      { label: 'Dashboard', to: '/platform/jobseeker/dashboard' },
      { label: 'Explore Jobs', to: '/platform/jobseeker/jobs' },
      { label: 'Applications', to: '/platform/jobseeker/applications' },
      { label: 'Learning Center', to: '/platform/jobseeker/learning' },
      { label: 'Career Profile', to: '/platform/jobseeker/profile' },
    ];
  };

  const navLinks = getNavLinks(user?.role);

  return (
    <header className="sticky top-0 z-[100] bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="decoration-none shrink-0 group hover:opacity-80 transition-opacity">
          <Logo variant="light" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center justify-center gap-10 h-full flex-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-semibold transition-all relative py-2 decoration-none ${
                  isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-blue-600 rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-6">
           <button className="size-12 rounded-[20px] hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 transition-all active:scale-95">
              <span className="material-symbols-outlined text-2xl">notifications_none</span>
           </button>
           
           <div className="h-8 w-px bg-slate-100 dark:bg-slate-800 hidden sm:block"></div>

            <div className="flex items-center gap-4 group relative cursor-pointer">
              <div className="text-right hidden sm:block">
                 <p className="text-sm font-semibold text-slate-900 dark:text-white leading-none mb-1">
                    {user?.full_name || 'Professional'}
                 </p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                    {user?.role || 'Member'}
                 </p>
              </div>
              <div className="size-10 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-[20px] flex items-center justify-center font-semibold text-base transition-all group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white">
                 {user?.full_name?.[0] || 'U'}
              </div>
              
              {/* DROPDOWN */}
              <div className="absolute top-[calc(100%+12px)] right-0 w-[300px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-[32px] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-[110] translate-y-4 group-hover:translate-y-0 overflow-hidden">
                 <div className="p-8 pb-6 flex items-center gap-4">
                    <div className="size-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center font-semibold text-xl">
                       {user?.full_name?.[0] || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className="text-base font-semibold text-slate-900 dark:text-white truncate">{user?.full_name || 'My Account'}</p>
                       <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest truncate">{user?.role || 'Welcome'}</p>
                    </div>
                 </div>

                 <div className="px-4 pb-4 space-y-1">
                    <Link to={user?.role === 'employer' ? "/platform/employer/profile" : "/platform/jobseeker/profile"} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all group/item">
                       <span className="material-symbols-outlined text-[20px] text-slate-400 group-hover/item:text-blue-500 transition-colors">account_circle</span>
                       <span className="text-sm font-medium text-slate-700 dark:text-slate-300">My Profile</span>
                    </Link>
                    <Link to="/platform/settings" className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all group/item">
                       <span className="material-symbols-outlined text-[20px] text-slate-400 group-hover/item:text-blue-500 transition-colors">settings</span>
                       <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Account Settings</span>
                    </Link>
                 </div>

                 <div className="p-4 bg-slate-100 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 h-12 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-[18px] transition-all group/logout border-none bg-transparent font-semibold">
                       <span className="material-symbols-outlined text-[20px] transition-transform group-hover/logout:-translate-x-1">logout</span>
                       <span>Sign Out</span>
                    </button>
                 </div>
              </div>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;



