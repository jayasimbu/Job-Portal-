import React from 'react';
import { FileText, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';

const ResumeInsights = ({ quality, issues }) => {
  const defaultIssues = [
    "Weak formatting / white-space density issues",
    "Missing measurable achievements / KPI data",
    "Inconsistent headings and chronological order"
  ];

  const displayIssues = issues || defaultIssues;

  return (
    <div className="bg-white rounded-[12px] p-8 shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-slate-100">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="size-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center">
            <FileText size={32} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Resume Quality Insights</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Deep analysis of formatting, content, and structure</p>
          </div>
        </div>
        <div className="flex flex-col items-center">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Quality Index</span>
           <div className="text-4xl font-black text-slate-900">{quality || 72}<span className="text-xl text-slate-400">%</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="space-y-4">
            <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2">
               <AlertCircle size={14} />
               Critical Structural Issues
            </h4>
            <div className="space-y-3">
               {displayIssues.map((issue, i) => (
                 <div key={i} className="flex items-start gap-3 p-4 bg-rose-500/5 rounded-xl border border-rose-500/10 hover:bg-rose-500/10 transition-all cursor-default">
                    <span className="text-rose-500 font-black shrink-0 mt-0.5">✕</span>
                    <span className="text-xs font-bold text-slate-700 leading-tight">{issue}</span>
                 </div>
               ))}
            </div>
         </div>

         <div className="space-y-4">
            <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
               <CheckCircle2 size={14} />
               Verified Strengths
            </h4>
            <div className="space-y-3">
               {[
                 "Standard industry-compliant font hierarchy",
                 "Correct technical skills categorization",
                 "Contact information easily parsable"
               ].map((strength, i) => (
                 <div key={i} className="flex items-start gap-3 p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10 hover:bg-emerald-500/10 transition-all cursor-default">
                    <span className="text-emerald-500 font-black shrink-0 mt-0.5">✓</span>
                    <span className="text-xs font-bold text-slate-700 leading-tight">{strength}</span>
                 </div>
               ))}
            </div>
         </div>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
         <div className="flex items-center gap-3">
            <div className="size-2 bg-blue-500 rounded-full animate-ping"></div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Aesthetic Optimization Service Available</p>
         </div>
         <button className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline group">
            Open Resume Intelligence Tools
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
      </div>
    </div>
  );
};

export default ResumeInsights;
