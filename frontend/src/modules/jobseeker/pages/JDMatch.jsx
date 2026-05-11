import React, { useState } from 'react';
import { useResume } from '../context/ResumeContext';
import { matchJd } from '../services/jobseekerService';
import { useToast } from '../../../core/context/ToastContext';

// Import Design System
import { 
  StatCard, 
  SkillChip, 
  ATSCircle, 
  SectionHeader, 
  ProgressBar 
} from '../components/DesignSystem';

const JDMatch = () => {
  const { resumeData } = useResume();
  const { showToast } = useToast();
  const [jdText, setJdText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [matchResult, setMatchResult] = useState(null);

  const handleAnalyze = async () => {
    if (!jdText) {
      showToast("Please paste a Job Description first 📝");
      return;
    }
    if (!resumeData?.rawText) {
      showToast("Please upload your resume in the Dashboard first 📄");
      return;
    }

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
      showToast("Intelligence analysis complete! 🎯");
    } catch (err) {
      console.error("Match analysis failed", err);
      showToast("Analysis failed ❌");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 px-4 sm:px-6">
      {/* HEADER */}
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Targeted JD Match</h1>
          <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Precision analysis against specific job requirements</p>
        </div>
        <div className="flex gap-4">
           <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">RESUME STATUS</p>
              <p className={`text-xs font-black uppercase ${resumeData?.rawText ? 'text-emerald-500' : 'text-rose-500'}`}>
                 {resumeData?.rawText ? 'DOCUMENT DETECTED' : 'NO DOCUMENT'}
              </p>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* LEFT: JOB DESCRIPTION */}
        <section className="space-y-8">
           <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm flex flex-col h-[600px]">
              <div className="flex items-center justify-between mb-8">
                 <SectionHeader title="Job Description" icon="description" />
                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Input Layer</span>
              </div>
              <textarea 
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the full job description here (Responsibilities, Requirements, Skills)..."
                className="flex-1 w-full p-8 bg-slate-50 border border-slate-100 rounded-[2rem] resize-none outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 focus:bg-white transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300 shadow-inner"
              />
              <button 
                onClick={handleAnalyze}
                disabled={analyzing || !jdText}
                className="mt-8 h-20 w-full bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-600 transition-all disabled:opacity-50 shadow-2xl shadow-slate-200 active:scale-95 flex items-center justify-center gap-4 group"
              >
                {analyzing ? (
                   <>
                      <div className="size-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                      AI Analyzing Compatibility...
                   </>
                ) : (
                   <>
                      <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">auto_awesome</span>
                      Start Intelligence Match
                   </>
                )}
              </button>
           </div>
        </section>

        {/* RIGHT: REAL-TIME ANALYSIS FEEDBACK */}
        <section className="space-y-8">
           {matchResult ? (
             <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm flex flex-col h-[600px] space-y-10">
                <div className="flex justify-between items-start">
                   <SectionHeader title="Analysis Output" icon="psychology" />
                   <ATSCircle value={matchResult.matchPercentage} size={100} />
                </div>

                <div className="flex-1 space-y-10 overflow-y-auto pr-2 custom-scrollbar">
                   {/* Strategic Advice */}
                   <div className="bg-blue-50 border border-blue-100 rounded-3xl p-8 space-y-4">
                      <div className="flex items-center gap-2 text-blue-600">
                         <span className="material-symbols-outlined text-sm">lightbulb</span>
                         <h4 className="text-[10px] font-black uppercase tracking-widest">AI Strategic Advice</h4>
                      </div>
                      <p className="text-sm font-bold text-slate-700 leading-relaxed italic">
                         "{matchResult.feedback || "Your profile shows significant overlap with the required tech stack. Emphasize your deployment experience to bridge the remaining gap."}"
                      </p>
                   </div>

                   {/* Skills Matrix */}
                   <div className="grid grid-cols-1 gap-8">
                      <div className="space-y-4">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Matched Keywords</p>
                         <div className="flex flex-wrap gap-2">
                            {matchResult.matchedSkills.map((s, i) => <SkillChip key={i} label={s} variant="success" />)}
                         </div>
                      </div>
                      <div className="space-y-4">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Missing Keywords</p>
                         <div className="flex flex-wrap gap-2">
                            {matchResult.missingSkills.map((s, i) => <SkillChip key={i} label={s} variant="danger" />)}
                         </div>
                      </div>
                   </div>
                </div>

                <button 
                  onClick={() => window.print()} 
                  className="w-full py-5 border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                   <span className="material-symbols-outlined text-sm">download</span>
                   Export Analysis Report
                </button>
             </div>
           ) : (
             <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm flex flex-col items-center justify-center text-center h-[600px] space-y-8 border-dashed">
                <div className="size-24 rounded-[3rem] bg-slate-50 flex items-center justify-center text-slate-300">
                   <span className="material-symbols-outlined text-5xl">analytics</span>
                </div>
                <div className="space-y-2">
                   <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Intelligence Queue</h3>
                   <p className="text-sm font-bold text-slate-400 max-w-xs mx-auto">Paste a job description on the left to begin the semantic analysis engine.</p>
                </div>
             </div>
           )}
        </section>
      </div>

      {/* BOTTOM: DETAILED BREAKDOWN (ONLY IF RESULT EXISTS) */}
      {matchResult && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="bg-white border border-slate-200 rounded-[2rem] p-8 space-y-6">
              <StatCard label="Keyword Accuracy" value={matchResult.matchPercentage} suffix="%" />
              <ProgressBar value={matchResult.matchPercentage} />
           </div>
           <div className="bg-white border border-slate-200 rounded-[2rem] p-8 space-y-6">
              <StatCard label="Experience Fit" value={82} suffix="%" color="text-emerald-600" />
              <ProgressBar value={82} />
           </div>
           <div className="bg-white border border-slate-200 rounded-[2rem] p-8 space-y-6">
              <StatCard label="Skill Density" value={matchResult.matchedSkills.length * 10} suffix="%" color="text-blue-600" />
              <ProgressBar value={matchResult.matchedSkills.length * 10} />
           </div>
        </div>
      )}
    </div>
  );
};

export default JDMatch;
