import React from 'react';
import { 
  BarChart3, 
  Users, 
  Target, 
  TrendingUp, 
  ArrowUpRight,
  Calendar
} from 'lucide-react';

import Card, { CardBody } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

const MetricCard = ({ label, value, trend, icon: Icon }) => (
  <Card className="border-slate-100 shadow-sm">
    <CardBody className="p-5">
      <div className="flex justify-between items-start mb-4">
        <div className="size-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-blue-600">
          <Icon size={20} />
        </div>
        <Badge variant={trend.startsWith('+') ? 'success' : 'danger'} className="text-[9px] font-black">{trend}</Badge>
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight mb-1">{label}</p>
      <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{value}</h4>
    </CardBody>
  </Card>
);

const ChartPlaceholder = ({ title, height = "h-64" }) => (
  <div className={`flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 ${height}`}>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title} Visualization</p>
    <p className="text-[9px] text-slate-300 font-bold uppercase mt-1">Operational Data Feed Active</p>
  </div>
);

export default function Analytics() {
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
          <button className="h-9 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-colors">
            <Calendar size={14} />
            Last 30 Days
          </button>
        </div>
      </div>

      {/* TOP METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Applicants" value="320" trend="+12.5%" icon={Users} />
        <MetricCard label="Avg ATS Score" value="78%" trend="+2.4%" icon={Target} />
        <MetricCard label="Active Jobs" value="12" trend="+1" icon={BarChart3} />
        <MetricCard label="Hiring Rate" value="18%" trend="-1.2%" icon={TrendingUp} />
      </div>

      {/* CHARTS SECTION */}
      <div className="w-full">
        {/* Applicants Over Time */}
        <Card className="border-slate-100 shadow-sm w-full">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
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
