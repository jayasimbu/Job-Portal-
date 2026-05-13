import React, { useState, useEffect } from 'react';
import { Send, MapPin, Search, CheckCircle2, Clock, XCircle, Briefcase, Zap } from 'lucide-react';
import Button from '../../../components/ui/Button';
import apiClient from '../../../core/api/apiClient';
import { getCurrentUserId } from '../../../core/auth/session';
import { useToast } from '../../../core/context/ToastContext';

export default function Applications() {
  const [filter, setFilter] = useState('ALL');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = getCurrentUserId();
  const { showToast } = useToast();

  const FILTER_TABS = ['ALL', 'APPLIED', 'SHORTLISTED', 'INTERVIEWING', 'REJECTED', 'OFFERED'];

  useEffect(() => {
    const fetchApplications = async () => {
      if (!userId) return;
      try {
        const res = await apiClient.get(`/jobseeker/applications/${userId}`);
        const apps = res.data?.applications || [];
        setApplications(apps);
      } catch (err) {
        console.error("Failed to load applications:", err);
        showToast("Failed to load applications", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [userId, showToast]);

  const filteredApps = filter === 'ALL' 
    ? applications 
    : applications.filter(app => (app.status || '').toUpperCase() === filter);

  const getStatusIcon = (status) => {
      const s = (status || '').toUpperCase();
      if (s === 'APPLIED') return <Clock size={13} className="text-blue-500" />;
      if (s === 'SHORTLISTED' || s === 'INTERVIEWING') return <Clock size={13} className="text-amber-500" />;
      if (s === 'OFFERED' || s === 'SELECTED') return <CheckCircle2 size={13} className="text-emerald-500" />;
      if (s === 'REJECTED') return <XCircle size={13} className="text-rose-500" />;
      return <Clock size={13} className="text-slate-500" />;
  };

  const getStatusColor = (status) => {
      const s = (status || '').toUpperCase();
      if (s === 'APPLIED') return 'text-blue-500';
      if (s === 'SHORTLISTED' || s === 'INTERVIEWING') return 'text-amber-500';
      if (s === 'OFFERED' || s === 'SELECTED') return 'text-emerald-500';
      if (s === 'REJECTED') return 'text-rose-500';
      return 'text-slate-500';
  };

  const formatDate = (dateString) => {
      if (!dateString) return 'RECENTLY';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
  };

  return (
    <div className="space-y-4 pt-2">
      {/* HEADER + FILTER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
           <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">Hiring Pipeline</h1>
           <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Track and manage your active applications in real-time.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl overflow-x-auto no-scrollbar">
            {FILTER_TABS.map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                  filter === status 
                  ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' 
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* APPLICATIONS LIST */}
      <div className="space-y-2 pt-2">
        {loading ? (
          <div className="py-20 text-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl">
             <div className="animate-spin size-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
             <p className="font-black uppercase tracking-widest text-slate-400 text-xs">Loading Pipeline...</p>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="py-20 text-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl">
             <Briefcase size={32} className="text-slate-300 mx-auto mb-4" />
             <p className="font-bold uppercase tracking-widest text-slate-400 text-xs">No {filter !== 'ALL' ? filter.toLowerCase() : ''} applications found</p>
          </div>
        ) : (
          filteredApps.map(app => (
            <div key={app.id} className="group bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 hover:border-blue-500/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              
              <div className="flex items-center gap-5 flex-1">
                <div className="size-12 shrink-0 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center font-black text-lg text-blue-600 transition-transform group-hover:scale-105 shadow-sm">
                  {(app.company && app.company[0]) || 'C'}
                </div>
                <div className="min-w-0">
                  <h3 className="text-[15px] font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-blue-600 transition-colors truncate">{app.role}</h3>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                    <span className="text-slate-700 dark:text-slate-300 font-bold">{app.company}</span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="flex items-center gap-1"><MapPin size={11} /> {app.location}</span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="flex items-center gap-1 text-blue-500"><Zap size={11} className="fill-blue-500"/> {Math.round(app.ats_match_score || 0)}% MATCH</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-8">
                <div className="flex items-center gap-2 min-w-[120px]">
                  {getStatusIcon(app.status)}
                  <div>
                    <span className={`text-[11px] font-black uppercase tracking-widest block ${getStatusColor(app.status)}`}>
                       {app.status || 'APPLIED'}
                    </span>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{formatDate(app.created_at)}</p>
                  </div>
                </div>

                <Button variant="secondary" onClick={() => window.location.href = `/platform/jobseeker/jobs/${app.job_id}`} className="h-9 px-6 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-sm">
                  View Job
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
