import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchEmployerAnalytics } from '../services/employerService';
import { getCurrentUser, getCurrentUserId } from '../../../core/auth/session';

const EmployerDashboard = () => {
  const navigate = useNavigate();
  
  // Animated Counter Component for data simulation
  const AnimatedCounter = ({ value }) => {
    const [count, setCount] = useState(0);
    const end = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value;
    const isPercentage = typeof value === 'string' && value.includes('%');
    
    useEffect(() => {
      let startTimestamp = null;
      const duration = 1500; // 1.5s animation
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // Easing function: easeOutQuart
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeProgress * end));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }, [end]);

    return <span>{count}{isPercentage ? '%' : ''}</span>;
  };

  const user = getCurrentUser();
  const userId = getCurrentUserId(1);
  const companyName = user?.full_name || user?.email?.split('@')[0] || 'Employer';
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    active_jobs: 0,
    total_applicants: 0,
    shortlisted: 0,
    interviews: 0,
    avg_ats_score: 0,
    top_ats_score: 0,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetchEmployerAnalytics(userId);
        setMetrics(response?.analytics || { ...metrics, ...response });
      } catch {
        setMetrics({
          active_jobs: 5,
          total_applicants: 42,
          shortlisted: 8,
          interviews: 3,
          avg_ats_score: 72.5,
          top_ats_score: 94
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  const Skeleton = ({ className }) => (
    <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-2xl ${className}`} />
  );

  if (loading) {
    return (
      <div className="h-full flex flex-col overflow-hidden animate-in fade-in duration-500">
        <div className="flex flex-col gap-2 mb-6">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-28" />)}
        </div>
        <div className="flex-1 grid grid-cols-3 gap-4 min-h-0">
          <div className="col-span-2"><Skeleton className="h-full" /></div>
          <Skeleton className="h-full" />
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Active Jobs', value: metrics.active_jobs, icon: 'work', color: 'purple', comparison: '+12% vs last 30d', trend: 'up' },
    { label: 'Total Candidates', value: metrics.total_applicants, icon: 'groups', color: 'blue', comparison: '+5% vs last 30d', trend: 'up' },
    { label: 'Avg Match Score', value: `${metrics.avg_ats_score}%`, icon: 'analytics', color: 'emerald', comparison: '-2% vs last 30d', trend: 'down' },
    { label: 'Interviews', value: metrics.interviews, icon: 'record_voice_over', color: 'amber', comparison: '+8% vs last 30d', trend: 'up' },
  ];

  const recentCandidates = [
    { name: 'Sarah Jenkins', role: 'Senior React Developer', match: 94, status: 'Shortlisted', avatar: 'S' },
    { name: 'Alex Rivera', role: 'Product Manager', match: 88, status: 'New', avatar: 'A' },
    { name: 'Priya Sharma', role: 'Backend Engineer', match: 82, status: 'Interview', avatar: 'P' },
    { name: 'David Chen', role: 'UI/UX Designer', match: 76, status: 'Reviewed', avatar: 'D' },
  ];

  const recentActivity = [
    { text: 'New application received for Product Manager role.', time: '2m ago', icon: 'person_add' },
    { text: 'Interview scheduled with Sarah Jenkins.', time: '1h ago', icon: 'event' },
    { text: 'Two jobs marked as featured today.', time: '3h ago', icon: 'campaign' },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER + STATS */}
      <header className="flex-shrink-0 mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-[0.2em] mb-1">Employer Hub</p>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Welcome back, {companyName} 👋</p>
          <h1 className="text-[24px] font-black text-slate-900 dark:text-white tracking-tight leading-tight mt-1 uppercase">Employer Dashboard</h1>
        </div>
        <button
          onClick={() => navigate('/platform/employer/post-job')}
          className="h-12 px-8 bg-purple-600 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-purple-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-purple-500/20 active:scale-95"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Post New Job
        </button>
      </header>

      {/* STATS GRID */}
      <div className="flex-shrink-0 grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl hover:border-purple-500/50 transition-all group cursor-pointer shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`size-11 rounded-2xl flex items-center justify-center ${
                s.color === 'purple' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600' :
                s.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' :
                s.color === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' :
                'bg-amber-50 dark:bg-amber-900/20 text-amber-600'
              } group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined text-xl">{s.icon}</span>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white leading-none">
                  <AnimatedCounter value={s.value ?? 0} />
                </div>
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mt-2">{s.label}</div>
              </div>
              <div className="h-8 w-16 opacity-50 group-hover:opacity-100 transition-opacity">
                <svg className="w-full h-full" viewBox="0 0 100 40">
                  <path 
                    d={s.trend === 'up' ? "M0,35 Q25,30 50,20 T100,5" : "M0,5 Q25,10 50,25 T100,35"} 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="3" 
                    className={s.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}
                  />
                </svg>
              </div>
            </div>
            <div className={`mt-3 text-[10px] font-bold flex items-center gap-1 ${s.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
              <span className="material-symbols-outlined text-[14px]">
                {s.trend === 'up' ? 'trending_up' : 'trending_down'}
              </span>
              {s.comparison}
            </div>
          </div>
        ))}
      </div>

      {/* MAIN GRID: Candidates + Activity */}
      <div className="flex-1 grid grid-cols-3 gap-4 min-h-0">

        {/* LEFT: Recent Candidates (2/3) */}
        <div className="col-span-2 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
              <span className="material-symbols-outlined text-purple-600 text-sm">person_search</span>
              Recent Candidates
            </h3>
            <button
              onClick={() => navigate('/platform/employer/candidates')}
              className="text-[10px] font-black text-purple-600 hover:text-purple-700 uppercase tracking-widest"
            >
              View All →
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0 space-y-3 pb-4">
            {recentCandidates.map((c, i) => (
              <div key={i} className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl hover:border-purple-500 transition-all group shadow-sm cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="size-12 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center font-black text-lg text-purple-600 group-hover:scale-110 transition-transform">
                      {c.avatar}
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors uppercase tracking-tight leading-tight">{c.name}</h4>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">{c.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="block text-xl font-black text-purple-600 dark:text-purple-400 leading-none">{c.match}%</span>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">AI Match</span>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      c.status === 'Shortlisted' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' :
                      c.status === 'Interview' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' :
                      c.status === 'New' ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/20' :
                      'bg-slate-50 text-slate-500 dark:bg-slate-800'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Hiring Activity (1/3) */}
        <div className="flex flex-col gap-4 min-h-0">
          <section className="flex-1 min-h-0 p-6 bg-slate-900 dark:bg-purple-600 rounded-3xl text-white flex flex-col shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 size-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl transition-all group-hover:bg-white/10" />
            <h3 className="text-sm font-black flex items-center gap-2 mb-5 uppercase tracking-widest relative z-10">
              <span className="material-symbols-outlined text-lg">history</span>
              Hiring Activity
            </h3>
            <div className="flex-1 space-y-3 min-h-0 overflow-y-auto pr-1 custom-scrollbar-white relative z-10">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-white/10 rounded-2xl border border-white/10 hover:bg-white/20 transition-all">
                  <div className="size-9 bg-white/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-base">{item.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold leading-relaxed">{item.text}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/50 mt-1.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/platform/employer/candidates')}
              className="w-full mt-5 h-12 bg-white text-slate-900 font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:bg-purple-50 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 flex-shrink-0 relative z-10"
            >
              View All Candidates
              <span className="material-symbols-outlined text-sm">trending_flat</span>
            </button>
          </section>

          {/* Quick Hiring Stats */}
          <section className="flex-shrink-0 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Recruitment Funnel</h3>
              <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full uppercase tracking-widest">Healthy</span>
            </div>
            
            <div className="flex flex-col gap-3">
              {[
                { label: 'Applied', count: 42, width: 'w-full', color: 'bg-slate-200 dark:bg-slate-800', drop: null },
                { label: 'Screened', count: 28, width: 'w-[85%]', color: 'bg-purple-100 dark:bg-purple-900/30', drop: '33% drop' },
                { label: 'Interview', count: 12, width: 'w-[60%]', color: 'bg-purple-300 dark:bg-purple-600/50', drop: '57% drop' },
                { label: 'Offer', count: 4, width: 'w-[35%]', color: 'bg-purple-500', drop: '66% drop' },
                { label: 'Hired', count: 2, width: 'w-[20%]', color: 'bg-purple-700', drop: '50% drop' },
              ].map((stage, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-tight text-slate-500 dark:text-slate-400">
                    <span>{stage.label}</span>
                    <span className="text-slate-900 dark:text-white">{stage.count}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`${stage.width} h-6 ${stage.color} rounded-lg flex items-center px-3 shadow-inner relative overflow-hidden transition-all duration-500`}>
                      {i === 3 && <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />}
                    </div>
                    {stage.drop && (
                      <span className="text-[9px] font-black text-red-500 uppercase tracking-tighter whitespace-nowrap">
                        ↓ {stage.drop}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <p className="text-[9px] font-medium text-slate-400 leading-relaxed italic">
                * Screening stage losing 33% candidates. Consider refining AI filter.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
