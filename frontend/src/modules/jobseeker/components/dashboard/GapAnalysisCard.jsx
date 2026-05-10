import React from 'react';
import { AlertCircle, ChevronRight } from 'lucide-react';

const GapAnalysisCard = ({ gaps, onGapClick }) => {
  return (
    <div className="bg-white rounded-[12px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-slate-100 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6">
        <AlertCircle size={18} className="text-amber-500" />
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Intelligence Gap Analysis</h3>
      </div>
      
      <div className="space-y-3 flex-1">
        {gaps && gaps.length > 0 ? (
          gaps.map((gap, i) => (
            <button 
              key={i}
              onClick={() => onGapClick(gap)}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-transparent hover:border-amber-200 hover:bg-amber-50 transition-all group text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-rose-500 font-black">❗</span>
                <span className="text-xs font-bold text-slate-700 group-hover:text-amber-700 transition-colors">{gap.message || gap}</span>
              </div>
              <ChevronRight size={14} className="text-slate-300 group-hover:text-amber-500 transition-transform group-hover:translate-x-1" />
            </button>
          ))
        ) : (
          <div className="text-center py-10">
            <span className="text-3xl">🎯</span>
            <p className="text-xs font-bold text-slate-400 uppercase mt-4">No critical gaps identified</p>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Impact Priority: High</span>
        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Refine Profile</span>
      </div>
    </div>
  );
};

export default GapAnalysisCard;
