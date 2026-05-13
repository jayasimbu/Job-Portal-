import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  FileText, 
  Bookmark, 
  Settings, 
  LogOut, 
  CheckCircle2, 
  ShieldCheck,
  TrendingUp,
  LayoutDashboard
} from 'lucide-react';
import { fetchJobSeekerProfile, fetchApplications } from '../../modules/jobseeker/services/jobseekerService';
import { getCurrentUserId } from '../auth/session';

const ProfileDropdown = ({ user, onClose }) => {
  const navigate = useNavigate();
  const userId = getCurrentUserId();
  const role = user?.role || 'jobseeker';
  const [profile, setProfile] = useState(null);
  const [appStats, setAppStats] = useState({ applied: 0, shortlisted: 0, interviews: 0 });

  useEffect(() => {
    if (role === 'jobseeker' && userId) {
      const loadStats = async () => {
        try {
          const profileRes = await fetchJobSeekerProfile(userId);
          const appsRes = await fetchApplications(userId);
          
          setProfile(profileRes?.profile);
          
          const apps = appsRes?.applications || [];
          setAppStats({
            applied: apps.length,
            shortlisted: apps.filter(a => ['shortlisted', 'reviewing', 'shortlist'].includes(a.status?.toLowerCase())).length,
            interviews: apps.filter(a => ['interview', 'offered'].includes(a.status?.toLowerCase())).length
          });
        } catch (err) {
          console.error("Failed to load dropdown stats:", err);
        }
      };
      loadStats();
    }
  }, [role, userId]);

  const menuItems = role === 'employer' ? [
    { icon: User, label: 'Company Profile', path: '/platform/employer/profile' },
  ] : [
    { icon: User, label: 'View Profile', path: '/platform/jobseeker/profile' },
  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/auth/login';
  };

  return (
    <div className="absolute top-16 right-0 w-80 bg-slate-50 dark:bg-[#0d1117] border border-slate-300 dark:border-slate-700 rounded-3xl shadow-2xl shadow-blue-500/10 overflow-hidden animate-in fade-in zoom-in duration-200 z-[60]">
      
      {/* User Header */}
      <div className="p-6 pb-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-4 mb-4">
          <div className="size-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg shadow-blue-500/20">
            {user?.full_name?.charAt(0) || 'J'}
          </div>
          <div>
            <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">
              {user?.full_name || 'User'}
            </h4>
            <div className="flex items-center gap-1.5 mt-1">
              <ShieldCheck size={12} className="text-blue-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {user?.is_verified ? 'Verified Expert' : 'Standard Profile'}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Strength */}
        <div className="space-y-2 bg-slate-100 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Profile Strength</span>
            <span className="text-xs font-black text-emerald-500">{Math.round(profile?.ats_score || 0)}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${Math.round(profile?.ats_score || 0)}%` }} />
          </div>
        </div>
      </div>

      {/* Stats Grid (Only for Jobseeker for now as per image) */}
      {role === 'jobseeker' && (
        <div className="grid grid-cols-3 border-b border-slate-200 dark:border-slate-700">
          <div className="p-4 text-center border-r border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800/30 transition-colors">
            <p className="text-lg font-black text-slate-900 dark:text-white">{appStats.applied}</p>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Applied</p>
          </div>
          <div className="p-4 text-center border-r border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800/30 transition-colors">
            <p className="text-lg font-black text-slate-900 dark:text-white">{appStats.shortlisted}</p>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Shortlisted</p>
          </div>
          <div className="p-4 text-center hover:bg-slate-100 dark:hover:bg-slate-800/30 transition-colors">
            <p className="text-lg font-black text-slate-900 dark:text-white">{appStats.interviews}</p>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Interviews</p>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <div className="p-2">
        {menuItems.map((item, i) => (
          <button
            key={i}
            onClick={() => {
              navigate(item.path);
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all group"
          >
            <item.icon size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
            {item.label}
          </button>
        ))}
      </div>

      {/* Logout */}
      <div className="p-2 bg-slate-100 dark:bg-slate-800/30">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all group"
        >
          <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
          Logout
        </button>
      </div>

    </div>
  );
};

export default ProfileDropdown;
