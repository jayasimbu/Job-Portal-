import React, { useState } from 'react';
import { Search, FileSearch, Sparkles, BrainCircuit, AlertTriangle, CheckCircle2 } from 'lucide-react';

const JDMatcher = ({ onMatch }) => {
  const [jdText, setJdText] = useState('');
  const [matching, setMatching] = useState(false);
  const [result, setResult] = useState(null);

  const handleMatch = async () => {
    if (!jdText.trim()) return;
    setMatching(true);
    // Real matching logic would call an API
    setTimeout(() => {
      setResult({
        score: 62,
        missing: ['REST APIs', 'Testing (Jest)', 'System Design'],
        matched: ['React', 'JavaScript', 'Tailwind CSS']
      });
      setMatching(false);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-[12px] p-8 shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-slate-100 flex flex-col gap-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">ATS Match</h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Cross-reference your profile with any job description</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-all">
            <Search size={14} />
            Select Saved Job
          </button>
          <button 
            onClick={() => { setJdText(''); setResult(null); }}
            className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-400"
          >
            <FileSearch size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Area */}
        <div className="space-y-4">
          <textarea 
            placeholder="Paste Job Description (JD) here to calculate instant match score..."
            className="w-full h-64 bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none resize-none placeholder:text-slate-400 scrollbar-hide"
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
          />
          <button 
            onClick={handleMatch}
            disabled={matching || !jdText.trim()}
            className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
              matching || !jdText.trim() 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20'
            }`}
          >
            {matching ? (
              <>
                <div className="size-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Analyzing Match...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Calculate Match Score
              </>
            )}
          </button>
        </div>

        {/* Results Area */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
          {!result && !matching && (
            <div className="text-center space-y-4 opacity-50">
              <BrainCircuit size={48} className="mx-auto text-slate-300" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Result Display Pending Analysis</p>
            </div>
          )}

          {matching && (
            <div className="space-y-6 w-full animate-pulse">
               <div className="size-32 rounded-full bg-slate-200 mx-auto"></div>
               <div className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-5/6"></div>
               </div>
            </div>
          )}

          {result && (
            <div className="w-full space-y-8 animate-in zoom-in duration-500">
               <div className="text-center">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">ATS Match</h4>
                  <div className="text-6xl font-black text-blue-600 tabular-nums tracking-tighter">{result.score}<span className="text-2xl text-blue-300">%</span></div>
               </div>

               <div className="space-y-6">
                  <div>
                    <h5 className="flex items-center gap-2 text-[10px] font-black text-rose-500 uppercase tracking-widest mb-3">
                       <AlertTriangle size={12} />
                       Missing Capabilities
                    </h5>
                    <div className="flex flex-wrap gap-2">
                       {result.missing.map((s, i) => (
                         <span key={i} className="px-3 py-1 bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase border border-rose-500/10 rounded-lg">{s}</span>
                       ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3">
                       <CheckCircle2 size={12} />
                       Matched Skills
                    </h5>
                    <div className="flex flex-wrap gap-2">
                       {result.matched.map((s, i) => (
                         <span key={i} className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase border border-emerald-500/10 rounded-lg">{s}</span>
                       ))}
                    </div>
                  </div>
               </div>
            </div>
          )}
          
          <div className="absolute top-0 right-0 p-4">
             <Sparkles size={100} className="text-blue-500/5 -mr-10 -mt-10" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JDMatcher;
