import React from 'react';
import { Target, Zap, Activity } from 'lucide-react';

const MetricCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-slate-50 rounded-[12px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-slate-200 flex items-center justify-between group hover:border-blue-200 transition-all">
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{title}</p>
      <h3 className="text-2xl font-black text-slate-900 mt-2 tracking-tight group-hover:text-blue-600 transition-colors">{value}</h3>
    </div>
    <div className={`p-3 rounded-xl ${color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
      <Icon size={20} className={color.replace('bg-', 'text-')} />
    </div>
  </div>
);

const MetricsRow = ({ aiScore, matchRate, marketFit }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MetricCard title="AI Career Score" value={aiScore || 93} icon={Zap} color="bg-blue-500" />
      <MetricCard title="Match Rate" value={`${matchRate || 88}%`} icon={Target} color="bg-emerald-500" />
      <MetricCard title="Market Fit" value={marketFit || "High"} icon={Activity} color="bg-amber-500" />
    </div>
  );
};

export default MetricsRow;



