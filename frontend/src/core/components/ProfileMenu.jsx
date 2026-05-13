import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getCurrentUser } from '../../core/auth/session';
import { logoutUser } from '../../modules/auth/services/authService';

export default function ProfileMenu({ role = 'jobseeker' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const navigate = useNavigate();

  const user = getCurrentUser() || {};
  const isEmployer = role === 'employer';
  const isAdmin = role === 'admin';
  const name = user?.full_name || user?.company_name || (isAdmin ? 'System Admin' : isEmployer ? 'Recruiter' : 'Job Seeker');
  const subtitle = isAdmin ? 'Superuser' : isEmployer ? (user?.industry || 'Employer') : (user?.role_title || 'Professional');
  const initial = name?.charAt(0)?.toUpperCase() || 'A';

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    try { await logoutUser(); } catch {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('userRole');
    }
    navigate('/auth/login', { replace: true });
  };

  const menuItems = isAdmin
    ? [
        { label: 'Admin Dashboard', icon: 'shield', to: '/platform/admin/dashboard' },
        { label: 'Logout', icon: 'logout', action: handleLogout },
      ]
    : isEmployer
    ? [
        { label: 'Company Profile', icon: 'corporate_fare', to: '/platform/employer/profile' },
      ]
    : [
        { label: 'View Profile', icon: 'person', to: '/platform/jobseeker/profile' },
      ];

  const stats = isAdmin
    ? [
        { value: '99%', label: 'Uptime' },
        { value: '0', label: 'Errors' },
        { value: '12', label: 'Nodes' },
      ]
    : isEmployer
    ? [
        { value: '5', label: 'Jobs' },
        { value: '120', label: 'Candidates' },
        { value: '12', label: 'Interviews' },
      ]
    : [
        { value: '8', label: 'Applied' },
        { value: '3', label: 'Shortlisted' },
        { value: '1', label: 'Interviews' },
      ];

  return (
    <div className="relative" ref={ref}>

      {/* Avatar Trigger */}
      <div
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm cursor-pointer shadow-md hover:shadow-lg hover:scale-105 transition-all active:scale-95 select-none"
      >
        {initial}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute right-0 mt-3 w-72 rounded-2xl p-4 bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-2xl z-[100]"
          >
            {/* Profile Info */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md">
                {initial}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{subtitle}</p>
              </div>
            </div>

            {/* Profile Strength */}
            <div className="mb-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Profile Strength</p>
                <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">75%</p>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                <div className="bg-emerald-500 h-1.5 rounded-full transition-all " style={{ width: '75%' }}></div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 text-center mb-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
              {stats.map((s, i) => (
                <div key={i} className={i > 0 ? 'border-l border-slate-200 dark:border-slate-700' : ''}>
                  <p className="font-black text-lg text-slate-900 dark:text-white leading-tight">{s.value}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-1">
              {menuItems.map((item, i) => (
                <button
                  key={i}
                  onClick={() => { 
                    setOpen(false); 
                    if (item.action) item.action();
                    else if (item.to) navigate(item.to); 
                  }}
                  className="w-full text-left text-sm py-2.5 px-3 rounded-xl font-bold flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-slate-400">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>

            {/* Logout */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-2 mt-2">
              <button
                onClick={handleLogout}
                className="w-full text-left text-sm py-2.5 px-3 rounded-xl font-bold flex items-center gap-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}



