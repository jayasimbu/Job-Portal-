import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  Target, 
  TrendingUp, 
  ArrowUpRight,
  Calendar,
  Loader2
} from 'lucide-react';

import Card, { CardBody } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { fetchEmployerAnalytics } from '../services/employerService';
import { getCurrentUserId } from '../../../core/auth/session';

const MetricCard = ({ label, value, trend, icon: Icon }) => (
  <Card className="border-slate-200 shadow-sm">
    <CardBody className="p-5">
      <div className="flex justify-between items-start mb-4">
        <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-blue-600">
          <Icon size={20} />
        </div>
        <Badge variant={trend?.startsWith('+') ? 'success' : 'danger'} className="text-[9px] font-black">{trend || '0%'}</Badge>
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight mb-1">{label}</p>
      <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{value}</h4>
    </CardBody>
  </Card>
);

const ChartPlaceholder = ({ title, height = "h-64" }) => (
  <div className={`flex flex-col items-center justify-center bg-slate-100/50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 ${height}`}>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title} Visualization</p>
    <p className="text-[9px] text-slate-300 font-bold uppercase mt-1">Operational Data Feed Active</p>
  </div>
);

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const employerId = getCurrentUserId();

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchEmployerAnalytics(employerId);
        setData(res.analytics);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [employerId]);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 size={40} className="text-blue-600 animate-spin" />
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-tight">Syncing Recruitment Data...</p>
      </div>
    );
  }

  const metrics = {
    total_applicants: data?.total_applicants || 0,
    avg_ats_score: data?.avg_ats_score || 0,
    active_jobs: data?.active_jobs || 0,
    hiring_rate: data?.hiring_rate || 0,
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 pb-16 px-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-4">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
            Hiring Analytics
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Practical performance metrics for your recruitment pipeline.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="h-9 px-4 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-100 transition-colors">
            <Calendar size={14} />
            Last 30 Days
          </button>
        </div>
      </div>

      {/* TOP METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Applicants" value={metrics.total_applicants} trend="+0%" icon={Users} />
        <MetricCard label="Avg ATS Score" value={`${metrics.avg_ats_score}%`} trend="+0%" icon={Target} />
        <MetricCard label="Active Jobs" value={metrics.active_jobs} trend="+0" icon={BarChart3} />
        <MetricCard label="Hiring Rate" value={`${metrics.hiring_rate}%`} trend="+0%" icon={TrendingUp} />
      </div>

      {/* CHARTS SECTION */}
      <div className="w-full">
        {/* Applicants Over Time */}
        <Card className="border-slate-200 shadow-sm w-full">
          <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Applicants Over Time</h3>
            <ArrowUpRight size={14} className="text-slate-300" />
          </div>
          <CardBody className="p-5">
            <ChartPlaceholder title="Trend Line" />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

