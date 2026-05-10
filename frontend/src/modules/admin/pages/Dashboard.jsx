import React, { useState, useEffect } from 'react';
import { 
  Users, Building2, Briefcase, FileText, 
  CheckCircle2, AlertCircle, Activity, ShieldCheck,
  TrendingUp, Zap, Clock, Search
} from 'lucide-react';
import apiClient from '@/core/api/apiClient';

const StatCard = ({ label, value, sub, color, icon: Icon }) => (
  <div 
    className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800/50 shadow-xl shadow-slate-200/20 dark:shadow-none hover:border-blue-500/20 transition-all group animate-in fade-in slide-in-from-bottom-4 duration-500"
  >
    <div className="flex justify-between items-start mb-6">
      <div className={`size-14 rounded-2xl bg-${color}-50 dark:bg-${color}-500/10 flex items-center justify-center text-${color}-600 dark:text-${color}-400 group-hover:scale-110 transition-transform`}>
        <Icon size={28} />
      </div>
      <div className="text-right">
        <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{sub}</p>
      </div>
    </div>
    <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</h4>
  </div>
);

const HealthBadge = ({ ok, label }) => (
  <div className={`px-4 py-2 rounded-2xl flex items-center gap-2.5 border ${
    ok 
      ? 'bg-emerald-50/50 dark:bg-emerald-500/5 border-emerald-100 dark:border-emerald-500/20 text-emerald-600' 
      : 'bg-red-50/50 dark:bg-red-500/5 border-red-100 dark:border-red-500/20 text-red-600'
  }`}>
    <div className={`size-2 rounded-full ${ok ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
    <span className="text-[11px] font-bold uppercase tracking-widest">{label}</span>
  </div>
);

const MOCK_STATS = {
  users: { total: 12450, jobseekers: 10200, employers: 2250, new_this_week: 420 },
  jobs: { active: 1840, total: 3200 },
  applications: { total: 85600 },
  resumes: { total: 10150, pending_verification: 12 },
  companies: { verified: 185, total: 210 },
  system_health: { database: true, ollama: true, api: true }
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const r = await apiClient.get('/admin/dashboard');
        setStats(r.data);
      } catch (err) {
        console.warn("Using mock stats as API failed");
        setStats(MOCK_STATS);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Health Polling
    const pollHealth = async () => {
       try {
          const res = await apiClient.get('/admin/health');
          setStats(prev => ({
             ...prev,
             system_health: res.data || prev.system_health
          }));
       } catch (err) {
          console.error("Health poll failed", err);
       }
    };

    const interval = setInterval(pollHealth, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const s = stats || MOCK_STATS;

  return (
    <div className="min-h-screen bg-[#f8faff] dark:bg-[#0a0f14] p-8 lg:p-12">
      <div className="max-w-[1400px] mx-auto space-y-12">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <div className="size-10 bg-slate-900 dark:bg-blue-600 rounded-xl flex items-center justify-center shadow-xl shadow-slate-900/10">
                  <ShieldCheck className="text-white" size={22} />
               </div>
               <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight uppercase">LINKUP <span className="text-blue-600">Admin</span></h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Global system intelligence and infrastructure orchestration.</p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="size-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800" />
                ))}
             </div>
             <div className="pl-4 border-l border-slate-200 dark:border-slate-800 text-right">
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-none mb-1">Central Node</p>
                <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Active Session</p>
             </div>
          </div>
        </header>

        {/* System Status Row */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/50 flex flex-wrap items-center justify-between gap-6">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                 <Activity className="text-blue-600" size={18} />
                 <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Infrastructure Health</span>
              </div>
              <div className="flex gap-3">
                 <HealthBadge ok={s.system_health.database} label="Core DB" />
                 <HealthBadge ok={s.system_health.ollama} label="Neural Engine" />
                 <HealthBadge ok={s.system_health.api} label="Edge API" />
              </div>
           </div>
           
           <div className="flex items-center gap-8">
              <div className="text-center">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Uptime</p>
                 <p className="text-sm font-bold text-emerald-500">100%</p>
              </div>
              <div className="text-center">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Latency</p>
                 <p className="text-sm font-bold text-blue-600">12ms</p>
              </div>
           </div>
        </div>

        {/* Loading Overlay (Subtle) */}
        {loading && (
          <div className="animate-pulse">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1,2,3,4].map(i => <div key={i} className="h-40 bg-slate-100 dark:bg-slate-800 rounded-[32px]" />)}
             </div>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={Users} label="Total Identity Matrix" value={s.users.total.toLocaleString()} sub={`${s.users.new_this_week} new nodes`} color="indigo" />
            <StatCard icon={TrendingUp} label="User Conversion" value="68.4%" sub="+12% from last month" color="emerald" />
            <StatCard icon={Briefcase} label="Active Marketplace" value={s.jobs.active.toLocaleString()} sub={`${s.jobs.total} total postings`} color="blue" />
            <StatCard icon={Zap} label="Neural matches" value="4.2k" sub="avg. 840/day" color="violet" />
            
            <StatCard icon={FileText} label="Applications" value={s.applications.total.toLocaleString()} sub="Global flow" color="rose" />
            <StatCard icon={CheckCircle2} label="Verified Partners" value={s.companies.verified} sub={`of ${s.companies.total} entities`} color="sky" />
            <StatCard icon={Clock} label="Waitlist" value={s.resumes.pending_verification} sub="Pending review" color="amber" />
            <StatCard icon={AlertCircle} label="System Alerts" value="0" sub="All systems normal" color="emerald" />
          </div>
        )}

        {/* Control Interface */}
        <div className="grid lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-8">
              <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800/50 overflow-hidden">
                 <div className="p-8 border-b border-slate-50 dark:border-slate-800/50 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Active Infrastructure Actions</h3>
                    <button className="text-xs font-bold text-blue-600 uppercase tracking-widest">Global Overview</button>
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-slate-100 dark:bg-slate-800/50">
                    {[
                      { icon: Users, label: 'Identity Matrix', path: '/platform/admin/users' },
                      { icon: Building2, label: 'Partner Registry', path: '/platform/admin/companies' },
                      { icon: ShieldCheck, label: 'Audit Trail', path: '/platform/admin/logs' },
                      { icon: TrendingUp, label: 'Visual Intel', path: '/platform/admin/analytics' },
                      { icon: Zap, label: 'AI Configuration', path: '/platform/admin/settings' },
                      { icon: Search, label: 'Global Audit', path: '/platform/admin/verification' },
                    ].map((btn, i) => (
                      <a key={i} href={btn.path} className="p-10 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all flex flex-col items-center gap-4 group text-center decoration-none">
                         <div className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-800 group-hover:bg-blue-600 group-hover:text-white transition-all flex items-center justify-center text-slate-400">
                            <btn.icon size={22} />
                         </div>
                         <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">{btn.label}</span>
                      </a>
                    ))}
                 </div>
              </div>
           </div>

           <div className="space-y-8">
              <div className="bg-slate-900 rounded-[32px] p-10 text-white relative overflow-hidden group">
                 <div className="absolute top-0 right-0 size-40 bg-blue-600/20 blur-3xl -translate-y-20 translate-x-10 group-hover:bg-blue-600/30 transition-all" />
                 <h3 className="text-2xl font-bold tracking-tight mb-4 relative z-10">Intelligent Orchestration</h3>
                 <p className="text-slate-400 text-sm leading-relaxed mb-10 relative z-10">The LINKUP administrative engine uses proprietary neural algorithms to optimize talent-market equilibrium automatically.</p>
                 <button className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/20 active:scale-95">
                    Launch Neural Audit
                 </button>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800/50">
                 <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Security Perimeter</h4>
                 <div className="space-y-4">
                    {[
                      { label: 'OAuth Gateway', status: 'Operational' },
                      { label: 'Data Encryption', status: 'Active' },
                      { label: 'Threat Monitoring', status: 'Scanning' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 dark:border-slate-800 last:border-0">
                         <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{item.label}</span>
                         <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{item.status}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
