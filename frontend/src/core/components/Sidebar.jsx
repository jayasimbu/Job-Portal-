import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { 
  LayoutGrid, 
  Sparkles, 
  Zap, 
  Briefcase, 
  Users, 
  Activity, 
  Layers, 
  Send,
  UserCircle,
  Settings,
  LogOut,
  Target,
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { logoutUser } from '../../modules/auth/services/authService';
import { getCurrentUser } from '../../core/auth/session';
import Logo from './Logo';

const Sidebar = ({ role }) => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  const getLinks = (userRole) => {
    switch (userRole) {
      case 'jobseeker':
        return [
          { label: 'Intelligence', to: '/platform/jobseeker/dashboard', icon: Zap },
          { label: 'JD Workspace', to: '/platform/jobseeker/jd-match-analysis', icon: Target },
          { label: 'Job Search', to: '/platform/jobseeker/jobs', icon: Briefcase },
          { label: 'Applications', to: '/platform/jobseeker/applications', icon: Send },
          { label: 'Learning AI', to: '/platform/jobseeker/learning', icon: Sparkles },
          { label: 'Profile', to: '/platform/jobseeker/profile', icon: UserCircle },
        ];
      case 'employer':
        return [
          { label: 'Hiring Dashboard', to: '/platform/employer/dashboard', icon: LayoutGrid },
          { label: 'Publish Role', to: '/platform/employer/post-job', icon: Plus },
          { label: 'Talent Pool', to: '/platform/employer/candidates', icon: Users },
          { label: 'Candidate Feed', to: '/platform/employer/applications', icon: Activity },
          { label: 'Intelligence', to: '/platform/employer/analytics', icon: TrendingUp },
          { label: 'Company Profile', to: '/platform/employer/profile', icon: Layers },
        ];
      case 'admin':
        return [
          { label: 'System Overview', to: '/platform/admin/dashboard', icon: LayoutGrid },
          { label: 'User Governance', to: '/platform/admin/users', icon: Users },
          { label: 'Enterprise Partners', to: '/platform/admin/employers', icon: ShieldCheck },
          { label: 'Opportunity Hub', to: '/platform/admin/jobs', icon: Briefcase },
          { label: 'Traffic Analytics', to: '/platform/admin/analytics', icon: BarChart3 },
        ];
      default:
        return [];
    }
  };

  const links = getLinks(role);

  return (
    <aside className="fixed top-0 left-0 h-full w-[270px] bg-white dark:bg-[#0a0f14] border-r border-gray-50 dark:border-gray-900 z-[100] flex flex-col transition-all duration-500">
      
      {/* Brand Header */}
      <div className="h-24 flex items-center px-10">
          <Logo variant="light" showText={true} />
      </div>

      {/* Navigation Ecosystem */}
      <nav className="flex-1 px-6 py-4 space-y-1.5 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 h-12 rounded-2xl text-[13px] font-black uppercase tracking-widest transition-all duration-300 group ${
                isActive 
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm shadow-primary/5' 
                  : 'text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900/50'
              }`
            }
          >
            <link.icon size={18} className="transition-transform group-hover:scale-110" />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* System Status / User Meta */}
      <div className="p-6 border-t border-gray-50 dark:border-gray-900 space-y-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-3">
           <div className="flex items-center justify-between">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Enterprise Plan</span>
              <span className="text-[9px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-full">Pro</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">AI Engine Online</span>
           </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full h-12 flex items-center gap-3 px-5 text-gray-400 hover:text-danger hover:bg-danger/5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
