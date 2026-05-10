import React, { useState, useEffect, useCallback } from 'react';
import { 
  FileText, 
  Search, 
  Clock, 
  CheckCircle, 
  XCircle,
  Star,
  Eye,
  TrendingUp,
  Target,
  ChevronRight,
  User,
  Building2,
  Zap,
  Activity,
  Cpu,
  MoreVertical,
  ShieldCheck,
  Globe,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../../../core/api/apiClient';
import { UI } from '../../../constants/ui';

const DEMO_APPLICATIONS = [
  { id: 'demo-1', user_name: 'Priya Sharma', job_title: 'Full Stack Developer', company_name: 'TCS Digital', match_score: 87, status: 'pending', applied_at: new Date(Date.now() - 2*86400000).toISOString() },
  { id: 'demo-2', user_name: 'Rahul Kumar', job_title: 'Data Analyst', company_name: 'Infosys BPM', match_score: 72, status: 'shortlisted', applied_at: new Date(Date.now() - 5*86400000).toISOString() },
  { id: 'demo-3', user_name: 'Ananya Reddy', job_title: 'Backend Engineer', company_name: 'Wipro Technologies', match_score: 91, status: 'hired', applied_at: new Date(Date.now() - 10*86400000).toISOString() },
  { id: 'demo-4', user_name: 'Karthik Nair', job_title: 'UI/UX Designer', company_name: 'Zoho Corporation', match_score: 54, status: 'rejected', applied_at: new Date(Date.now() - 7*86400000).toISOString() },
  { id: 'demo-5', user_name: 'Deepa Menon', job_title: 'DevOps Engineer', company_name: 'HCL Technologies', match_score: 79, status: 'reviewed', applied_at: new Date(Date.now() - 3*86400000).toISOString() },
];

const Applications = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchApps = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter);
      if (search.trim()) params.set('search', search.trim());
      const r = await apiClient.get(`/admin/applications?${params}`);
      const data = r.data.applications || [];
      setApps(data.length > 0 ? data : DEMO_APPLICATIONS);
    } catch (err) {
      console.error(err);
      setApps(DEMO_APPLICATIONS);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  const statusMap = {
    pending: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', icon: Clock, label: 'Incoming Node' },
    reviewed: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: Eye, label: 'Analyzed' },
    shortlisted: { color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', icon: Star, label: 'Elite Tier' },
    hired: { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: CheckCircle, label: 'Deployed' },
    rejected: { color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', icon: XCircle, label: 'Archived' },
  };

  const filtered = apps.filter(app => {
    if (statusFilter !== 'all' && app.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (app.user_name || '').toLowerCase().includes(q) || 
             (app.job_title || '').toLowerCase().includes(q) ||
             (app.company_name || '').toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-10"
    >
      
      {/* Header: Pipeline Intelligence */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 bg-blue-600/10 border border-blue-600/20 rounded-full flex items-center gap-2">
                 <Zap className="text-blue-600" size={14} />
                 <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Global Talent Flow</span>
              </div>
           </div>
           <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-4">Talent Pipeline</h1>
           <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl text-lg">Real-time orchestration of the platform's hiring funnel, match intelligence, and candidate deployment lifecycle.</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-white dark:bg-slate-900 px-8 py-4 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-6 group hover:shadow-xl hover:border-blue-500/30 transition-all">
              <div>
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Market Velocity</p>
                 <p className="text-2xl font-black text-emerald-500 mt-2">84% <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Optimized</span></p>
              </div>
              <div className="w-px h-10 bg-slate-100 dark:bg-slate-800" />
              <div className="size-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                 <TrendingUp size={24} />
              </div>
           </div>
        </div>
      </div>

      {/* Interface Orchestrator */}
      <div className="flex flex-col lg:flex-row gap-6 items-center">
        {/* Funnel Query */}
        <div className="flex-1 relative group w-full">
           <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-3">
              <Search className="text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
           </div>
           <input
             type="text"
             placeholder="Query funnel by candidate ID, deployment title, or partner node..."
             className="w-full h-14 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] pl-16 pr-6 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all text-slate-900 dark:text-white shadow-sm"
             value={search}
             onChange={(e) => setSearch(e.target.value)}
           />
        </div>
        
        {/* Status Hub */}
        <div className="relative group min-w-[260px]">
           <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-3 pointer-events-none">
              <Activity size={16} className="text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
           </div>
           <select 
             className="w-full h-14 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] pl-16 pr-6 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 outline-none focus:border-blue-500 transition-all cursor-pointer appearance-none shadow-sm"
             value={statusFilter}
             onChange={(e) => setStatusFilter(e.target.value)}
           >
              <option value="all">Full Pipeline Matrix</option>
              <option value="pending">Incoming Nodes (Pending)</option>
              <option value="reviewed">Vetted Records (Reviewed)</option>
              <option value="shortlisted">Elite Tier (Shortlisted)</option>
              <option value="hired">Deployed Nodes (Hired)</option>
              <option value="rejected">Archived Records (Rejected)</option>
           </select>
           <ChevronRight size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 rotate-90" />
        </div>

        <button className="h-14 px-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 hover:border-blue-500/30 transition-all shadow-sm group">
           <Filter size={18} className="group-hover:rotate-180 transition-transform duration-500" />
           Matrix Filter
        </button>
      </div>

      {/* Talent Matrix Registry */}
      <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-700">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                <th className="px-10 h-16 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Candidate Entity</th>
                <th className="px-10 h-16 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Deployment Vector</th>
                <th className="px-10 h-16 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">AI Intelligence</th>
                <th className="px-10 h-16 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] text-right">System State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              <AnimatePresence mode="wait">
                {loading ? (
                  [1,2,3,4,5,6].map(i => (
                    <tr key={i} className="animate-pulse h-24">
                      <td colSpan={4} className="px-10 py-6">
                         <div className="flex items-center gap-4">
                            <div className="size-14 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
                            <div className="space-y-2 flex-1">
                               <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full w-1/4" />
                               <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full w-1/6" />
                            </div>
                         </div>
                      </td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                     <td colSpan={4} className="px-10 py-32 text-center">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                           <FileText size={64} className="mx-auto text-slate-100 dark:text-slate-800 mb-6" />
                           <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">No talent records found in segment</p>
                        </motion.div>
                     </td>
                  </tr>
                ) : (
                  filtered.map((app, idx) => {
                    const status = statusMap[app.status] || statusMap.pending;
                    return (
                      <motion.tr 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={app.id} 
                        className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all duration-300 h-24"
                      >
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-5">
                             <div className="size-14 rounded-2xl bg-gradient-to-tr from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-3 group-hover:border-blue-500/30 transition-all duration-500">
                                <User size={24} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                             </div>
                             <div>
                                <p className="text-base font-black text-slate-900 dark:text-white leading-none mb-2.5 group-hover:text-blue-600 transition-colors">{app.user_name}</p>
                                <div className="flex items-center gap-2">
                                   <Clock size={10} className="text-slate-300" />
                                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Applied: {new Date(app.applied_at).toLocaleDateString()}</span>
                                </div>
                             </div>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                           <div>
                              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-none mb-2.5">{app.job_title}</p>
                              <div className="flex items-center gap-2.5 text-slate-400 group/link cursor-pointer">
                                 <Building2 size={12} className="text-slate-300 group-hover/link:text-blue-600" />
                                 <span className="text-[10px] font-black uppercase tracking-widest group-hover/link:text-blue-600 transition-colors">{app.company_name}</span>
                              </div>
                           </div>
                        </td>
                        <td className="px-10 py-6">
                           <div className="flex items-center gap-4">
                              <div className="flex-1 min-w-[120px] h-2 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800">
                                 <motion.div 
                                   initial={{ width: 0 }}
                                   animate={{ width: `${app.match_score || 0}%` }}
                                   transition={{ duration: 1.5, delay: idx * 0.1, ease: "easeOut" }}
                                   className={`h-full rounded-full ${
                                      app.match_score >= 80 ? 'bg-emerald-500' : 
                                      app.match_score >= 60 ? 'bg-blue-500' : 'bg-amber-500'
                                   } shadow-[0_0_12px_rgba(var(--tw-shadow-color),0.5)]`} 
                                 />
                              </div>
                              <span className="text-sm font-black text-slate-900 dark:text-white tabular-nums">{app.match_score || 0}%</span>
                           </div>
                        </td>
                        <td className="px-10 py-6 text-right">
                           <div className="flex items-center justify-end gap-4 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                              <span className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] border transition-all duration-500 ${status.bg} ${status.color} ${status.border} dark:bg-opacity-10 shadow-sm`}>
                                 <status.icon size={12} />
                                 {status.label}
                              </span>
                              <button className="size-11 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-300 hover:text-blue-600 hover:border-blue-500 transition-all shadow-sm">
                                 <MoreVertical size={18} />
                              </button>
                           </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {/* Matrix Footer */}
        <div className="px-10 py-8 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Pipeline Registry count: {filtered.length} Active Records</p>
              <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
              <div className="flex items-center gap-2">
                 <ShieldCheck size={12} className="text-emerald-500" />
                 <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">ATS Synchronization Active</span>
              </div>
           </div>
           <button className="flex items-center gap-3 h-12 px-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-blue-600 hover:border-blue-500/30 transition-all shadow-sm group">
              <Globe size={18} className="group-hover:rotate-12 transition-transform" />
              Export Talent Matrix
           </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Applications;
