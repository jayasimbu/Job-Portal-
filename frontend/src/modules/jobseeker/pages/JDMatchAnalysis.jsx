import React from 'react';
import { Sparkles, BrainCircuit, Rocket, ChevronRight, History, Zap, ShieldCheck } from 'lucide-react';
import ResumeUploadCard from '../components/jd-analysis/ResumeUploadCard';
import JDInputCard from '../components/jd-analysis/JDInputCard';
import MatchScoreCard from '../components/jd-analysis/MatchScoreCard';
import MatchedSkills from '../components/jd-analysis/MatchedSkills';
import MissingSkills from '../components/jd-analysis/MissingSkills';
import RecommendedSkills from '../components/jd-analysis/RecommendedSkills';
import RecommendedJobs from '../components/jd-analysis/RecommendedJobs';
import AnalysisSummary from '../components/jd-analysis/AnalysisSummary';
import { useResumeAnalysis } from '../hooks/useResumeAnalysis';
import { useJDMatch } from '../hooks/useJDMatch';
import Button from '../../../components/ui/Button';

const JDMatchAnalysis = () => {
  const { 
    resumeText, 
    resumeSkills, 
    atsScore, 
    isParsing, 
    resumeFile, 
    analyzeResume 
  } = useResumeAnalysis();

  const {
    matchResults,
    recommendedJobs,
    isAnalyzing,
    runMatchAnalysis,
    resetMatch
  } = useJDMatch();

  const handleJDAnalyze = (jdText) => {
    runMatchAnalysis(resumeText, jdText);
  };

  return (
    <div className="space-y-8 pt-2">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">Intelligence Engine</h1>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Resume vs JD Match Analysis System</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="h-10 px-5 rounded-xl border-slate-200 dark:border-slate-800 font-black text-[10px] uppercase tracking-widest shadow-sm">
            <History size={14} /> History
          </Button>
          <Button className="h-10 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/10">
            <Sparkles size={14} /> Upgrade Pro
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Control Center (4 Units) */}
        <div className="lg:col-span-4 space-y-6">
          <ResumeUploadCard 
            onUpload={analyzeResume}
            isParsing={isParsing}
            resumeFile={resumeFile}
            atsScore={atsScore}
          />
          
          <JDInputCard 
            onAnalyze={handleJDAnalyze}
            isAnalyzing={isAnalyzing}
            disabled={!resumeText || isParsing}
          />

          {!matchResults && (
            <div className="bg-slate-900 dark:bg-black border border-slate-800 rounded-[2rem] p-8 text-white relative overflow-hidden group shadow-xl">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                 <Rocket size={100} fill="white" />
              </div>
              <div className="relative z-10 space-y-4">
                 <h3 className="text-2xl font-black uppercase tracking-tighter leading-none">Ready for<br />Optimization?</h3>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Paste a JD to uncover hidden gaps in your profile ranking.</p>
                 <div className="flex items-center gap-2 text-blue-400 font-black text-[10px] uppercase tracking-widest cursor-pointer hover:gap-3 transition-all pt-2">
                    Documentation <ChevronRight size={14} />
                 </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Analysis Results (8 Units) */}
        <div className="lg:col-span-8">
          {matchResults ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Score & Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MatchScoreCard 
                  score={matchResults.matchPercentage} 
                  atsScore={atsScore}
                />
                <AnalysisSummary 
                  matchResults={matchResults}
                />
              </div>

              {/* Skills Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MatchedSkills skills={matchResults.matchedSkills} />
                <MissingSkills skills={matchResults.missingSkills} />
              </div>

              {/* Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RecommendedSkills matchedSkills={matchResults.matchedSkills} />
                <RecommendedJobs jobs={recommendedJobs} />
              </div>

              {/* Reset Action */}
              <div className="flex justify-center pt-10">
                <Button 
                  variant="secondary"
                  onClick={resetMatch}
                  className="h-12 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest border-slate-200 dark:border-slate-800"
                >
                  Initiate New Analysis
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[600px] flex flex-col items-center justify-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] border-dashed">
              <div className="size-20 rounded-[2rem] bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6">
                <BrainCircuit size={40} className="text-slate-200" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Awaiting Intelligence Input</h2>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] max-w-sm text-center leading-relaxed">
                Provide your resume and job description to generate a multi-dimensional match report.
              </p>
              
              <div className="mt-16 grid grid-cols-3 gap-12 w-full max-w-md">
                {[
                  { label: 'Parse Resume', icon: Zap },
                  { label: 'Analyze JD', icon: BrainCircuit },
                  { label: 'Match Matrix', icon: ShieldCheck }
                ].map((step, i) => (
                  <div key={i} className="flex flex-col items-center gap-3 opacity-20 group">
                    <step.icon size={24} className="text-slate-400" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">{step.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JDMatchAnalysis;
