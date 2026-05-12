import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Briefcase, 
  FileText, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import Logo from '../../../core/components/Logo';
import { Link } from 'react-router-dom';

const AdminSidebar = () => {
  const navigate = useNavigate();
  
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/platform/admin/dashboard' },
    { name: 'Users', icon: Users, path: '/platform/admin/users' },
    { name: 'Employers', icon: Building2, path: '/platform/admin/employers' },
    { name: 'Jobs', icon: Briefcase, path: '/platform/admin/jobs' },
    { name: 'Applications', icon: FileText, path: '/platform/admin/applications' },
  ];

  const handleLogout = async () => {
    try {
      const { logoutUser } = await import('../../auth/services/authService').catch(() => ({}));
      if (logoutUser) await logoutUser();
      else localStorage.clear();
      navigate('/auth/login', { replace: true });
    } catch {
      navigate('/auth/login', { replace: true });
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-[60]">
      {/* Branding */}
      <div className="h-16 px-6 flex items-center border-b border-slate-100 dark:border-slate-800">
        <Link to="/" className="decoration-none">
          <Logo variant="light" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 h-10 px-3 rounded-lg text-sm font-medium transition-colors
              ${isActive 
                ? 'bg-blue-600 text-white' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}
            `}
          >
            <item.icon size={18} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800">
        <button 
          onClick={handleLogout}
          className="w-full h-10 flex items-center justify-center gap-2 px-3 rounded-lg text-sm font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
