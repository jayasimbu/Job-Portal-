import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Briefcase, 
  FileText, 
  BarChart3, 
  Settings, 
  ShieldAlert,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

const AdminSidebar = () => {
  const navigate = useNavigate();
  
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/platform/admin/dashboard', desc: 'Core Overview' },
    { name: 'User Management', icon: Users, path: '/platform/admin/users', desc: 'Manage Identity' },
    { name: 'Companies', icon: Building2, path: '/platform/admin/companies', desc: 'Partner Registry' },
    { name: 'Jobs & Postings', icon: Briefcase, path: '/platform/admin/jobs', desc: 'Marketplace' },
    { name: 'Global Applications', icon: FileText, path: '/platform/admin/applications', desc: 'Talent Flow' },
    { name: 'System Analytics', icon: BarChart3, path: '/platform/admin/analytics', desc: 'Intelligence' },
    { name: 'AI Optimization', icon: Zap, path: '/platform/admin/ai-intelligence', desc: 'Neural Engine' },
    { name: 'Activity Logs', icon: ShieldAlert, path: '/platform/admin/logs', desc: 'Security Audit' },
    { name: 'System Settings', icon: Settings, path: '/platform/admin/settings', desc: 'Global Config' },
  ];

  const handleLogout = async () => {
    try {
      const { logoutUser } = await import('../../auth/services/authService').catch(() => ({}));
      if (logoutUser) await logoutUser();
      else {
        localStorage.clear();
      }
      navigate('/auth/login', { replace: true });
    } catch (e) {
      navigate('/auth/login', { replace: true });
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-[280px] bg-white dark:bg-[#0f172a] border-r border-slate-100 dark:border-slate-800/50 flex flex-col z-[60] transition-all duration-300">
      {/* Branding Section */}
      <div className="p-8">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/platform/admin/dashboard')}>
          <div className="relative">
            <div className="size-11 bg-slate-900 dark:bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-slate-900/10 transition-transform duration-500">
              <ShieldCheck className="text-white" size={22} />
            </div>
            <div className="absolute -top-1 -right-1 size-4 bg-emerald-500 border-2 border-white dark:border-[#0f172a] rounded-full" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 dark:text-white text-lg tracking-tight uppercase leading-none">LINKUP</span>
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mt-1">Admin OS</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto custom-scrollbar">
        <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 mt-2">Management Matrix</p>
        {menuItems.map((item, idx) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              relative flex items-center gap-4 h-14 px-4 rounded-2xl text-sm transition-all duration-300 group
              ${isActive 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'}
            `}
          >
            {({ isActive }) => (
              <>
                <div className={`size-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-white/20' : 'bg-slate-50 dark:bg-slate-800 group-hover:bg-white'}`}>
                  <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600 transition-colors'} />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className={`font-semibold tracking-tight ${isActive ? 'text-white' : 'text-slate-700 dark:text-slate-200'}`}>{item.name}</span>
                  <span className={`text-[9px] font-medium uppercase tracking-wider ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>{item.desc}</span>
                </div>
                {isActive && (
                  <motion.div layoutId="active-pill" className="absolute right-3">
                    <ChevronRight size={14} className="text-white/50" />
                  </motion.div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer / System Status */}
      <div className="p-6 border-t border-slate-100 dark:border-slate-800/50">
        <div className="bg-slate-50 dark:bg-slate-800/30 rounded-2xl p-4 mb-4 border border-transparent">
           <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                 <Zap size={16} className="animate-pulse" />
              </div>
              <div className="space-y-0.5">
                 <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase leading-none">System Active</p>
                 <p className="text-[9px] font-medium text-slate-400">Nodes Operational</p>
              </div>
           </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full h-12 flex items-center justify-center gap-3 px-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-red-600 bg-red-50 dark:bg-red-500/10 hover:bg-red-600 hover:text-white transition-all duration-300"
        >
          <LogOut size={16} />
          End Session
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
