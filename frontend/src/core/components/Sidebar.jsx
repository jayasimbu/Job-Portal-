import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileSearch, 
  Target, 
  Send, 
  GraduationCap, 
  UserCircle, 
  Settings, 
  LogOut,
  Briefcase,
  Users,
  Search,
  BarChart3,
  Building2,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  PlusCircle
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
          { label: 'Dashboard', to: '/platform/jobseeker/dashboard', icon: LayoutDashboard },
          { label: 'JD Match', to: '/platform/jobseeker/jd-match-analysis', icon: BarChart3 },
          { label: 'Jobs', to: '/platform/jobseeker/jobs', icon: Briefcase },
          { label: 'Applications', to: '/platform/jobseeker/applications', icon: Send },
          { label: 'Learning', to: '/platform/jobseeker/learning', icon: GraduationCap },
          { label: 'Profile', to: '/platform/jobseeker/profile', icon: UserCircle },
        ];
      case 'employer':
        return [
          { label: 'Dashboard', to: '/platform/employer/dashboard', icon: LayoutDashboard },
          { label: 'Post Job', to: '/platform/employer/post-job', icon: Briefcase },
          { label: 'Candidates', to: '/platform/employer/candidates', icon: Users },
          { label: 'Applications', to: '/platform/employer/applications', icon: Send },
          { label: 'Company Profile', to: '/platform/employer/profile', icon: Building2 },
          { label: 'Analytics', to: '/platform/employer/analytics', icon: BarChart3 },
        ];
      case 'admin':
        return [
          { label: 'Dashboard', to: '/platform/admin/dashboard', icon: LayoutDashboard },
          { label: 'Users', to: '/platform/admin/users', icon: Users },
          { label: 'Employers', to: '/platform/admin/employers', icon: Building2 },
          { label: 'Jobs', to: '/platform/admin/jobs', icon: Briefcase },
          { label: 'Applications', to: '/platform/admin/applications', icon: Send },
        ];
      default:
        return [];
    }
  };

  const links = getLinks(role);

  return (
    <aside 
      className={`fixed top-0 left-0 h-full bg-white dark:bg-[#0f172a] border-r border-slate-100 dark:border-slate-800/50 z-50 flex flex-col w-[270px] transition-all`}
    >
      {/* Sidebar Header */}
      <div className="h-24 flex items-center px-8 border-b border-slate-50 dark:border-slate-800/50">
          <Logo variant="light" showText={true} />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-[14px] px-5 h-[54px] rounded-2xl text-[16px] font-semibold transition-all group ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/50'
              }`
            }
          >
            <link.icon size={20} />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Utility Section */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800/50 space-y-2">
        <button 
          onClick={handleLogout}
          className="w-full h-12 flex items-center gap-3.5 px-5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-2xl text-[15px] font-bold transition-all"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;



