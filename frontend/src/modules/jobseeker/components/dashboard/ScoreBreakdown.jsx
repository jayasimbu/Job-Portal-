import React from 'react';

const ScoreItem = ({ label, percentage, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
      <span className="text-slate-500">{label}</span>
      <span className={`${percentage < 40 ? 'text-rose-500' : 'text-slate-900'}`}>{percentage}%</span>
    </div>
    <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
      <div 
        className={`h-full transition-all ${color}`} 
        style={{ width: `${percentage}%` }}
      />
    </div>
  </div>
);

const ScoreBreakdown = ({ breakdown }) => {
  const data = [
    { label: 'Format', value: breakdown?.format || 70, color: 'bg-blue-500' },
    { label: 'Skills', value: breakdown?.skills || 100, color: 'bg-emerald-500' },
    { label: 'Experience', value: breakdown?.experience || 0, color: 'bg-rose-500' },
    { label: 'Projects', value: breakdown?.projects || 40, color: 'bg-amber-500' },
    { label: 'Education', value: breakdown?.education || 0, color: 'bg-indigo-500' },
  ];

  return (
    <div className="bg-slate-50 rounded-[12px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-slate-200">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Intelligence Breakdown</h3>
        <div className="flex items-center gap-2">
           <span className="size-2 bg-emerald-500 rounded-full "></span>
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Insights</span>
        </div>
      </div>
      
      <div className="space-y-6">
        {data.map((item, i) => (
          <ScoreItem key={i} label={item.label} percentage={item.value} color={item.color} />
        ))}
      </div>

      <div className="mt-8 p-4 bg-slate-100 rounded-xl border border-slate-200">
         <p className="text-[11px] font-bold text-slate-500 leading-relaxed italic">
            "Your profile excels in <span className="text-emerald-600 font-black">Skills Recognition</span> but requires immediate updates in <span className="text-rose-600 font-black">Experience Validation</span> to increase marketability."
         </p>
      </div>
    </div>
  );
};

export default ScoreBreakdown;



