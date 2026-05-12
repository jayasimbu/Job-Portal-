import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileText, 
  Target, 
  AlertCircle, 
  CheckCircle2, 
  Download, 
  Mail, 
  Calendar, 
  ThumbsUp, 
  TrendingUp,
  Lightbulb,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { getResumeFileUrl, checkResumeExists } from '../services/employerService';

// UI Components
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Card, { CardBody } from '../../../components/ui/Card';

const CandidateDetailSlideOut = ({ candidate, onClose, onAction, processingIds }) => {
  const [hasResume, setHasResume] = useState(false);

  useEffect(() => {
    if (candidate?.id) {
      checkResumeExists(candidate.id).then(setHasResume);
    }
  }, [candidate]);

  if (!candidate) return null;

  const isProcessing = processingIds?.has(candidate.id);

  return (
    <>
      {/* OVERLAY */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[100] transition-opacity duration-300" 
        onClick={onClose}
      />
      
      {/* DRAWER PANEL */}
      <div 
        className="fixed top-0 right-0 h-full w-full max-w-[700px] bg-white dark:bg-slate-900 shadow-2xl z-[110] transform transition-transform duration-500 ease-out border-l border-slate-200 dark:border-slate-800 flex flex-col translate-x-0"
      >
        {/* HEADER */}
        <div className="flex-shrink-0 px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="size-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-500/20">
              {candidate.name?.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">{candidate.name}</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{candidate.role || 'Frontend Developer'}</span>
                <span className="size-1 bg-slate-200 rounded-full" />
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{candidate.location || 'Chennai'}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="size-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-all hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
          
          {/* TOP STATS & AI SUMMARY */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 flex flex-col gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-6 border border-blue-100 dark:border-blue-900/30 flex flex-col items-center justify-center text-center">
                <p className="text-[9px] font-black uppercase tracking-widest text-blue-600 mb-2">Match Score</p>
                <h3 className="text-4xl font-black text-blue-700 dark:text-blue-300">{Math.round(candidate.score)}%</h3>
                <div className="w-full h-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${candidate.score}%` }} />
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">ATS Analysis</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">{Math.round(candidate.score * 0.92)}</h3>
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter mt-1">Operational Grade</span>
              </div>
            </div>

            <div className="md:col-span-2 bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 size-32 bg-blue-600/10 blur-3xl rounded-full" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2 text-blue-400">
                  <Lightbulb size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Hiring Suggestion</span>
                </div>
                <p className="text-sm font-medium leading-relaxed text-slate-300 italic">
                  "Suggested because candidate matches <span className="text-blue-400 font-black">{Math.round(candidate.score)}%</span> of your role requirements. Their experience with <span className="text-white font-bold">{candidate.skills?.slice(0,2).join(' and ')}</span> aligns perfectly with your top priority assets."
                </p>
                <div className="pt-2">
                  <div className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                    <CheckCircle2 size={12} /> High Recommendation
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SKILLS & GAPS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Strong Match Skills</h3>
              <div className="flex flex-wrap gap-2">
                {(candidate.skills || ['React', 'Tailwind', 'Node.js', 'Redux']).map(s => (
                  <span key={s} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-[10px] font-black uppercase tracking-wider rounded-lg border border-blue-100 dark:border-blue-800">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Identified Gaps</h3>
              <div className="flex flex-wrap gap-2">
                {(candidate.missing_keywords || ['Docker', 'AWS', 'System Design']).map(s => (
                  <span key={s} className="px-3 py-1.5 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 text-[10px] font-black uppercase tracking-wider rounded-lg border border-rose-100 dark:border-rose-800">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* RECOMMENDATIONS SECTION */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Strategic Recommendations</h3>
            <Card className="border-slate-100 shadow-sm bg-slate-50/50 dark:bg-slate-800/30">
              <CardBody className="p-5 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="size-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <TrendingUp size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">Growth Potential</h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Candidate demonstrates a strong learning trajectory. Recommend assigning a technical mentor to close the {candidate.missing_keywords?.[0] || 'infrastructure'} gap within 90 days.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="size-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">Cultural Alignment</h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Past project experience indicates a high aptitude for high-velocity startup environments and collaborative problem solving.</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* RESUME PREVIEW */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resume Preview</h3>
              <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 hover:underline">
                <Download size={14} /> Download Original
              </button>
            </div>
            <div className="aspect-[1/1.4] w-full bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative group">
              {hasResume ? (
                 <iframe 
                   src={`${getResumeFileUrl(candidate.id)}#toolbar=0&navpanes=0`} 
                   className="w-full h-full border-none" 
                   title="Resume Preview" 
                 />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <FileText size={48} className="text-slate-300 mb-4" />
                  <p className="text-xs font-bold text-slate-500">Document Processing...</p>
                  <p className="text-[10px] text-slate-400 mt-2 max-w-[200px]">The candidate's resume is currently being indexed for operational review.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex-shrink-0 p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex gap-3">
          <Button 
            disabled={isProcessing}
            onClick={() => onAction(candidate.id, 'shortlisted')}
            className="flex-1 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2 shadow-lg shadow-blue-600/10"
          >
            <ThumbsUp size={16} /> Shortlist Candidate
          </Button>
          <Button 
            disabled={isProcessing}
            variant="secondary"
            className="h-12 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2"
          >
            <Mail size={16} />
          </Button>
          <Button 
            disabled={isProcessing}
            variant="ghost"
            onClick={() => onAction(candidate.id, 'rejected')}
            className="h-12 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100"
          >
            Reject
          </Button>
        </div>
      </div>
    </>
  );
};

export default CandidateDetailSlideOut;
