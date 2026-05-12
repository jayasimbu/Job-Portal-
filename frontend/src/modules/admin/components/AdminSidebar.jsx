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
    <aside className="fixed left-0 top-0 h-full w-[270px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-[60]">
      {/* Branding */}
      <div className="h-24 px-8 flex items-center border-b border-slate-100 dark:border-slate-800">
        <Link to="/" className="decoration-none">
          <Logo variant="light" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3.5 h-[54px] px-4 rounded-xl text-[16px] font-semibold transition-all
              ${isActive 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}
            `}
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <button 
          onClick={handleLogout}
          className="w-full h-12 flex items-center justify-center gap-2.5 px-4 rounded-xl text-[15px] font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
    </aside>
  );
};

export default AdminSidebar;
