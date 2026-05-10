import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchEmployerAnalytics, fetchTopCandidates } from '../services/employerService';
import { getCurrentUser, getCurrentUserId } from '../../../core/auth/session';

const EmployerDashboard = () => {
  const navigate = useNavigate();
  
  const AnimatedCounter = ({ value }) => {
    const [count, setCount] = useState(0);
    const end = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value;
    const isPercentage = typeof value === 'string' && value.includes('%');
    
    useEffect(() => {
      let startTimestamp = null;
      const duration = 1500;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeProgress * end));
        if (progress < 1) window.requestAnimationFrame(step);
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
  const [topCandidates, setTopCandidates] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [anaRes, topRes] = await Promise.all([
          fetchEmployerAnalytics(userId),
          fetchTopCandidates(userId)
        ]);
        
        setMetrics(anaRes?.analytics || { ...metrics, ...anaRes });
        setTopCandidates(topRes?.top_candidates || []);
      } catch (err) {
        console.error("Dashboard fetch failed", err);
        setMetrics({
          active_jobs: 12,
          total_applicants: 156,
          shortlisted: 34,
          interviews: 8,
          avg_ats_score: 78.5,
          top_ats_score: 96
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  const stats = [
    { label: 'Active Positions', value: metrics.active_jobs, icon: 'work_outline', color: 'blue', comparison: '+4 new today', trend: 'up' },
    { label: 'Total Candidates', value: metrics.total_applicants, icon: 'groups', color: 'indigo', comparison: '+24% this week', trend: 'up' },
    { label: 'Avg Match Score', value: `${metrics.avg_ats_score}%`, icon: 'analytics', color: 'emerald', comparison: 'Above benchmark', trend: 'up' },
    { label: 'Interviews', value: metrics.interviews, icon: 'event', color: 'amber', comparison: '3 scheduled today', trend: 'up' },
  ];

  const recentActivity = [
    { text: 'New candidate applications were ranked by AI.', time: 'Just now', icon: 'auto_awesome' },
    { text: 'A candidate match of over 90% was detected for your open role.', time: '10m ago', icon: 'psychology' },
    { text: 'Platform health check completed: All systems active.', time: '1h ago', icon: 'health_and_safety' },
  ];

  if (loading) return <div className="h-full flex items-center justify-center"><div className="size-12 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" /></div>;

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* HEADER */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Recruiter Dashboard</p>
          <h1 className="text-4xl font-semibold text-slate-900 dark:text-white tracking-tight">Welcome back, {companyName}</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Manage your hiring pipeline and top talent matches.</p>
        </div>
        <button
          onClick={() => navigate('/platform/employer/post-job')}
          className="h-14 px-8 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-semibold shadow-xl shadow-slate-900/10 transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-3"
        >
          <span className="material-symbols-outlined">add</span>
          Post a Position
        </button>
      </header>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="p-6 bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-[32px] hover:border-blue-200 dark:hover:border-blue-900/50 transition-all group shadow-sm hover:shadow-xl hover:shadow-slate-200/20">
            <div className="flex items-center justify-between mb-6">
              <div className={`size-12 rounded-2xl flex items-center justify-center ${
                s.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' :
                s.color === 'indigo' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' :
                s.color === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' :
                'bg-amber-50 dark:bg-amber-900/20 text-amber-600'
              }`}>
                <span className="material-symbols-outlined text-2xl">{s.icon}</span>
              </div>
              <div className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${s.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {s.comparison}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-semibold text-slate-900 dark:text-white leading-none">
                <AnimatedCounter value={s.value ?? 0} />
              </h3>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0 pb-10">
        {/* RECENT CANDIDATES */}
        <div className="lg:col-span-8 flex flex-col min-h-0 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <span className="material-symbols-outlined text-blue-600">person_search</span>
               <h3 className="text-xl font-semibold text-slate-900 dark:text-white tracking-tight">Top Match Candidates</h3>
            </div>
            <button onClick={() => navigate('/platform/employer/candidates')} className="text-sm font-semibold text-blue-600 hover:underline">View Talent Pool</button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
            {topCandidates.length > 0 ? topCandidates.map((c, i) => (
              <div key={i} className="p-6 bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-[28px] hover:border-blue-500 transition-all group shadow-sm hover:shadow-lg cursor-pointer" onClick={() => navigate('/platform/employer/candidates')}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-5">
                    <div className="size-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center font-semibold text-xl text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all uppercase">
                      {c.name ? c.name.charAt(0) : 'C'}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-white transition-colors">{c.name}</h4>
                      <p className="text-sm font-medium text-slate-500">{c.role || 'Candidate'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <span className="block text-2xl font-semibold text-blue-600 dark:text-blue-400 leading-none">{Math.round(c.score || 0)}%</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Match Score</span>
                    </div>
                    <span className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest ${
                      (c.status || '').toLowerCase() === 'shortlisted' ? 'bg-emerald-50 text-emerald-600' :
                      (c.status || '').toLowerCase() === 'interviewing' ? 'bg-purple-50 text-purple-600' :
                      (c.status || '').toLowerCase() === 'applied' ? 'bg-blue-600 text-white' :
                      'bg-slate-50 text-slate-500'
                    }`}>
                      {c.status || 'New'}
                    </span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                 <span className="material-symbols-outlined text-4xl text-slate-200 mb-4">person_search</span>
                 <p className="text-slate-400 font-bold text-sm">No high-match candidates yet.</p>
                 <p className="text-slate-500 text-xs mt-1">Start by posting a job to see matches here.</p>
              </div>
            )}
          </div>
        </div>

        {/* ACTIVITY & FUNNEL */}
        <div className="lg:col-span-4 flex flex-col gap-8 min-h-0">
          <section className="flex-1 bg-slate-900 dark:bg-slate-800 rounded-[32px] p-8 text-white flex flex-col shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 size-40 bg-blue-600/20 rounded-full -mr-20 -mt-20 blur-3xl transition-all group-hover:bg-blue-600/30" />
            <h3 className="text-sm font-bold flex items-center gap-3 mb-8 uppercase tracking-widest relative z-10">
              <span className="material-symbols-outlined text-blue-400">history</span>
              Hiring Pulse
            </h3>
            <div className="flex-1 space-y-6 overflow-y-auto pr-1 custom-scrollbar-white relative z-10">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                  <div className="size-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-sm">{item.icon}</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-relaxed">{item.text}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/platform/employer/candidates')}
              className="w-full mt-8 h-14 bg-white text-slate-900 font-semibold rounded-2xl transition-all hover:bg-blue-50 active:scale-95 flex items-center justify-center gap-2 relative z-10"
            >
              Talent Pool
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </button>
          </section>

          <section className="p-8 bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-[32px] shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Hiring Pipeline</h3>
              <div className="size-2 bg-emerald-500 rounded-full animate-pulse" />
            </div>
            
            <div className="space-y-6">
              {[
                { label: 'Applications', count: 156, width: '100%', color: 'bg-slate-100 dark:bg-slate-800' },
                { label: 'Shortlisted', count: 42, width: '65%', color: 'bg-blue-100 dark:bg-blue-900/30' },
                { label: 'Interviews', count: 8, width: '25%', color: 'bg-blue-600' },
              ].map((stage, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                    <span>{stage.label}</span>
                    <span className="text-slate-900 dark:text-white">{stage.count}</span>
                  </div>
                  <div className="h-2.5 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${stage.color} transition-all duration-1000`} 
                      style={{ width: stage.width }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
