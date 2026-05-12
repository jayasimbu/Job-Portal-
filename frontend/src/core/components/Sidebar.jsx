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

const Sidebar = ({ role, isCollapsed, toggleCollapse }) => {
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
          { label: 'Resume', to: '/platform/jobseeker/resume-analysis', icon: FileSearch },
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
      className={`fixed top-0 left-0 h-full bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 z-50 flex flex-col ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Sidebar Header */}
      <div className="h-24 flex items-center px-6">
          <Logo variant="light" showText={!isCollapsed} />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium group ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
              }`
            }
          >
            <link.icon size={18} className={isCollapsed ? 'mx-auto' : ''} />
            {!isCollapsed && <span className="text-sm">{link.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Utility Section */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <div className="space-y-1">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Collapse Toggle */}
      <button onClick={toggleCollapse} className="absolute -right-3 top-10 size-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-600 shadow-sm transition-all z-50">
        {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
};

export default Sidebar;



