import React from 'react';
import { Upload, ExternalLink, Sparkles } from 'lucide-react';

const HeroScoreCard = ({ score, insight, onUpload, onViewJobs }) => {
  const getStatusColor = (s) => {
    if (s < 50) return 'text-rose-500';
    if (s <= 75) return 'text-amber-500';
    return 'text-emerald-500';
  };

  const getBgColor = (s) => {
    if (s < 50) return 'bg-rose-500/10';
    if (s <= 75) return 'bg-amber-500/10';
    return 'bg-emerald-500/10';
  };

  return (
    <div className="bg-slate-50 rounded-[12px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-slate-200 relative overflow-hidden group">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        <div className="flex items-center gap-6">
          <div className={`size-32 rounded-full border-[8px] border-slate-50 flex items-center justify-center relative ${getBgColor(score)} transition-all group-hover:scale-105`}>
            <span className={`text-5xl font-black tabular-nums ${getStatusColor(score)}`}>{score}</span>
            <div className="absolute -top-2 -right-2 p-1.5 bg-blue-600 rounded-lg text-white shadow-lg animate-bounce">
              <Sparkles size={16} />
            </div>
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">ATS Intelligence Score</h2>
            <p className="text-xl font-black text-slate-900 mt-2 leading-tight">
              {insight || "“Ready for mid-level frontend roles”"}
            </p>
            <div className="flex items-center gap-2 mt-4">
              <span className={`size-2 rounded-full  ${getStatusColor(score).replace('text-', 'bg-')}`}></span>
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Analysis Synchronized</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button 
            onClick={onUpload}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-black uppercase tracking-widest text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-all active:scale-95 shadow-sm"
          >
            <Upload size={16} />
            Replace Resume
          </button>
          <button 
            onClick={onViewJobs}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-500/20"
          >
            <ExternalLink size={16} />
            View Matching Jobs
          </button>
        </div>
      </div>
      
      {/* Aesthetic Background Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 size-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  );
};

export default HeroScoreCard;



