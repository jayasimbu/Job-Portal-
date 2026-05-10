import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const ActionPanel = ({ actions, onImproveProfile }) => {
  const defaultActions = [
    "Add 2 high-impact projects",
    "Add internship / experience details",
    "Improve education granularity"
  ];

  const displayActions = actions || defaultActions;

  return (
    <div className="bg-white rounded-[12px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-slate-100 flex flex-col h-full">
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-6">Optimization Path</h3>
      
      <div className="space-y-4 flex-1">
        {displayActions.map((action, i) => (
          <div key={i} className="flex items-start gap-3 group">
            <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-700 leading-tight group-hover:text-blue-600 transition-colors">{action}</span>
          </div>
        ))}
      </div>

      <button 
        onClick={onImproveProfile}
        className="mt-8 w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-900/10 hover:shadow-blue-500/20 group"
      >
        Improve Profile
        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

export default ActionPanel;
