import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Target, 
  TrendingUp, 
  MapPin,
  Briefcase,
  Building2,
  Users,
  Award,
  ChevronRight,
  Zap,
  Globe,
  Activity
} from 'lucide-react';
import apiClient from '../../../core/api/apiClient';
import { UI } from '../../../constants/ui';

const AIInsights = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    setLoading(true);
    apiClient.get(`/admin/analytics?days=${days}`)
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [days]);

  const topSkills = data?.top_skills || [];
  const topLocations = data?.top_locations || [];
  const topJobs = data?.top_job_titles || [];
  const pipeline = data?.application_pipeline || {};
  const activeCompanies = data?.active_companies || 0;
  const avgAts = data?.avg_ats_score || 0;
  const successRate = data?.success_rate || 0;
  const totalApps = Object.values(pipeline).reduce((a, b) => a + b, 0) || 0;

  const kpis = [
    { label: 'Network Entities', value: activeCompanies, icon: Building2, color: 'blue' },
    { label: 'ATS Match Precision', value: `${avgAts}%`, icon: Target, color: 'emerald' },
    { label: 'Deployment Success', value: `${successRate}%`, icon: Zap, color: 'violet' },
    { label: 'Funnel Throughput', value: totalApps, icon: Activity, color: 'amber' },
  ];

  if (loading) {
    return (
      <div className={`${UI.PAGE_CONTAINER} bg-[#f8fafc] dark:bg-[#0d141b] -mx-4 -mt-8 px-8 py-10 min-h-screen animate-pulse`}>
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/4 mb-12" />
        <div className="grid grid-cols-4 gap-6 mb-12">
          {[1,2,3,4].map(i => <div key={i} className="h-[130px] bg-slate-200 dark:bg-slate-800 rounded-[2rem]" />)}
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div className="h-[400px] bg-slate-200 dark:bg-slate-800 rounded-[2.5rem]" />
          <div className="h-[400px] bg-slate-200 dark:bg-slate-800 rounded-[2.5rem]" />
        </div>
      </div>
    );
  }

  return (
    <div className={`${UI.PAGE_CONTAINER} bg-[#f8fafc] dark:bg-[#0d141b] -mx-4 -mt-8 px-8 py-10 min-h-screen`}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
           <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Advanced Analytics Hub</span>
           </div>
           <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">AI Intelligence</h1>
           <p className="text-slate-500 font-medium mt-3 max-w-md">Real-time insights derived from neural processing of marketplace activities and skill demand vectors.</p>
        </div>
        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
           {[7, 30, 60, 90].map(v => (
             <button
               key={v}
               onClick={() => setDays(v)}
               className={`h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                 days === v 
                   ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg' 
                   : 'text-slate-400 hover:text-slate-600'
               }`}
             >
               {v}D
             </button>
           ))}
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {kpis.map((s) => (
          <div key={s.label} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between h-[130px] group">
            <div className="flex items-start justify-between">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
              <div className={`size-10 rounded-xl bg-${s.color}-50 dark:bg-${s.color}-500/10 flex items-center justify-center text-${s.color}-600 dark:text-${s.color}-400 group-hover:scale-110 transition-transform`}>
                <s.icon size={18} />
              </div>
            </div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white leading-none tabular-nums">{s.value}</h3>
          </div>
        ))}
      </div>

      {/* Analytics Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Skill Demand Vectors */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm group">
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                   <TrendingUp size={18} />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Skill Demand Matrix</h3>
             </div>
             <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                Export <ChevronRight size={14} />
             </button>
          </div>
          
          <div className="space-y-6">
            {topSkills.length === 0 ? (
              <div className="py-20 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">Awaiting skill ingestion...</div>
            ) : (
              topSkills.slice(0, 6).map((s, i) => {
                const maxCount = topSkills[0]?.count || 1;
                const pct = Math.round((s.count / maxCount) * 100);
                return (
                  <div key={i} className="group/item">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{s.skill}</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tabular-nums">{s.count} Requisitions</span>
                    </div>
                    <div className="w-full bg-slate-50 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(59,130,246,0.5)]" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Pipeline Throughput */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm group">
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400">
                   <BarChart3 size={18} />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Pipeline Conversion</h3>
             </div>
             <div className="px-3 py-1 bg-violet-50 dark:bg-violet-500/10 rounded-full text-[9px] font-black text-violet-600 uppercase tracking-widest">Live Flow</div>
          </div>
          
          <div className="space-y-6">
            {[
              { key: 'pending', label: 'Inbound Flow', color: 'bg-slate-400' },
              { key: 'reviewed', label: 'Vetted Nodes', color: 'bg-blue-400' },
              { key: 'shortlisted', label: 'Elite Tier', color: 'bg-amber-400' },
              { key: 'hired', label: 'Terminal State', color: 'bg-emerald-500' },
              { key: 'rejected', label: 'Archived', color: 'bg-rose-400' },
            ].map(({ key, label, color }) => {
              const count = pipeline[key] || 0;
              const pct = totalApps > 0 ? Math.round((count / totalApps) * 100) : 0;
              return (
                <div key={key}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{label}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tabular-nums">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-50 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className={`h-full ${color} rounded-full transition-all duration-1000 shadow-sm`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
             <div className="size-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Globe size={18} />
             </div>
             <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Geographic Density</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {topLocations.length === 0 ? (
              <div className="col-span-2 py-10 text-center text-slate-300">Scanning regions...</div>
            ) : (
              topLocations.map((loc, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-transparent hover:border-blue-100 dark:hover:border-blue-500/20 transition-all group/loc">
                  <div className="flex items-center gap-3">
                    <MapPin size={14} className="text-slate-300 group-hover/loc:text-blue-500 transition-colors" />
                    <span className="text-xs font-black text-slate-700 dark:text-slate-200 tracking-tight">{loc.location}</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 tabular-nums">{loc.count}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Predictive Market Needs */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
           <div className="flex items-center gap-3 mb-8">
             <div className="size-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Target size={18} />
             </div>
             <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Market Resonance</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {topJobs.length === 0 ? (
              <div className="py-10 text-center text-slate-300 w-full">Aggregating market roles...</div>
            ) : (
              topJobs.map((title, i) => (
                <span key={i} className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-widest hover:border-blue-500 transition-all cursor-default shadow-sm">
                  {title}
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
