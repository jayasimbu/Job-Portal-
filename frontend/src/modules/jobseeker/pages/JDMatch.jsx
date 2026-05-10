import React, { useState } from 'react';
import { useResume } from '../context/ResumeContext';
import { matchJd } from '../services/jobseekerService';

const JDMatch = () => {
  const { resumeData } = useResume();
  const [jdText, setJdText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [matchResult, setMatchResult] = useState(null);

  const handleAnalyze = async () => {
    if (!jdText || !resumeData?.rawText) return;
    setAnalyzing(true);
    try {
      const result = await matchJd({
        resume_text: resumeData.rawText,
        job_description: jdText
      });
      
      setMatchResult({
        matchPercentage: Math.round(result.ats_score || result.final_score || 0),
        matchedSkills: result.matched_keywords || [],
        missingSkills: result.missing_keywords || [],
        feedback: result.llm_enhanced_feedback
      });
    } catch (err) {
      console.error("Match analysis failed", err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex-shrink-0 space-y-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Semantic Compatibility</h1>
          <p className="text-sm text-slate-500">Compare your profile against a specific Job Description.</p>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        {/* Input Column */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col">
           <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Target Role Description</h3>
           <textarea 
             value={jdText}
             onChange={(e) => setJdText(e.target.value)}
             placeholder="Paste the Job Description here..."
             className="flex-1 w-full p-4 bg-slate-50 border border-slate-100 rounded-xl resize-none outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-medium text-slate-700"
           />
           <button 
             onClick={handleAnalyze}
             disabled={analyzing || !jdText || !resumeData?.rawText}
             className="mt-4 h-11 w-full bg-[#111827] text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-all disabled:opacity-50 shadow-md"
           >
             {analyzing ? 'Analyzing Match...' : 'Calculate Compatibility'}
           </button>
           {!resumeData?.rawText && (
             <p className="text-[9px] font-black text-rose-500 text-center mt-3 uppercase tracking-widest">Please upload a resume first.</p>
           )}
        </div>

        {/* Results Column */}
        <div className="flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar pb-10">
           {matchResult ? (
             <>
               <div className="p-8 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center justify-between">
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Compatibility Score</p>
                     <h2 className="text-5xl font-black text-blue-600 leading-none">{matchResult.matchPercentage}%</h2>
                  </div>
                  <div className="size-16 rounded-full border-[4px] border-blue-600 flex items-center justify-center">
                     <span className="material-symbols-outlined text-2xl text-blue-600">auto_fix_high</span>
                  </div>
               </div>

               {matchResult.feedback && (
                 <div className="p-6 bg-blue-50 border border-blue-100 rounded-xl shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2">AI Strategy Feedback</p>
                    <p className="text-sm font-medium text-blue-900 leading-relaxed italic">"{matchResult.feedback}"</p>
                 </div>
               )}

               <div className="p-8 bg-white border border-slate-200 rounded-xl shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-4">Matched Requirements</p>
                  <div className="flex flex-wrap gap-2">
                     {matchResult.matchedSkills.length > 0 ? matchResult.matchedSkills.map((skill, idx) => (
                        <span key={idx} className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase tracking-widest rounded-lg border border-emerald-100">
                           <span className="material-symbols-outlined text-[10px]">check</span>
                           {skill}
                        </span>
                     )) : <p className="text-xs font-bold text-slate-400">No major keyword matches detected.</p>}
                  </div>
               </div>

               <div className="p-8 bg-white border border-slate-200 rounded-xl shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-4">Missing Requirements</p>
                  <div className="flex flex-wrap gap-2">
                     {matchResult.missingSkills.length > 0 ? matchResult.missingSkills.map((skill, idx) => (
                        <span key={idx} className="flex items-center gap-1 px-3 py-1.5 bg-rose-50 text-rose-700 text-[9px] font-black uppercase tracking-widest rounded-lg border border-rose-100">
                           <span className="material-symbols-outlined text-[10px]">close</span>
                           {skill}
                        </span>
                     )) : <p className="text-xs font-bold text-slate-400">All keywords from JD are present in your profile! 🎉</p>}
                  </div>
               </div>
             </>
           ) : (
             <div className="flex-1 bg-slate-50 border border-slate-100 border-dashed rounded-xl flex flex-col items-center justify-center text-center p-8">
                <span className="material-symbols-outlined text-4xl text-slate-300 mb-4">document_scanner</span>
                <p className="text-sm font-bold text-slate-500">Paste a job description to see your compatibility score.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default JDMatch;
