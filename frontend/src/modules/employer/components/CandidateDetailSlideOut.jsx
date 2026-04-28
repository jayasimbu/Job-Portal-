import React, { useState, useEffect } from 'react';
import { getResumeFileUrl, checkResumeExists } from '../services/employerService';

const CandidateDetailSlideOut = ({ candidate, onClose, onAction, processingIds }) => {
  const [toastMessage, setToastMessage] = useState(null);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduleData, setScheduleData] = useState({ date: '', time: '', location: 'Zoom' });
  const [hasResume, setHasResume] = useState(false);

  useEffect(() => {
    if (candidate?.id) {
      checkResumeExists(candidate.id).then(setHasResume);
    }
  }, [candidate]);

  if (!candidate) return null;

  const handleAction = async (status, extraData = null) => {
    setToastMessage({ text: '⏳ Updating candidate status...', type: 'loading' });
    try {
      await onAction(candidate.id, status, extraData);
      const displayStatus = status === 'shortlisted' ? 'shortlisted' : status === 'rejected' ? 'rejected' : 'scheduled';
      setToastMessage({ text: `✔ Candidate ${displayStatus}`, type: 'success' });
      setTimeout(() => {
        setToastMessage(null);
        if (status !== 'email_sent') onClose();
      }, 1500);
    } catch (e) {
      setToastMessage({ text: '❌ Failed to update status', type: 'error' });
      setTimeout(() => setToastMessage(null), 2000);
    }
  };

  const handleSendEmail = () => {
    setToastMessage({ text: '📧 Opening professional email draft...', type: 'info' });
    setTimeout(() => {
      const subject = encodeURIComponent(`Interview Invitation: ${candidate.name}`);
      const body = encodeURIComponent(`Hi ${candidate.name},\n\nWe were impressed by your profile and would like to invite you for an interview...`);
      window.open(`mailto:${candidate.email}?subject=${subject}&body=${body}`);
      setToastMessage(null);
    }, 1500);
  };

  const submitSchedule = () => {
    if (!scheduleData.date || !scheduleData.time) {
      setToastMessage({ text: '❗ Please select date and time', type: 'error' });
      setTimeout(() => setToastMessage(null), 2000);
      return;
    }

    const selectedDate = new Date(`${scheduleData.date}T${scheduleData.time}`);
    if (selectedDate < new Date()) {
      setToastMessage({ text: '❗ Cannot schedule in the past', type: 'error' });
      setTimeout(() => setToastMessage(null), 2000);
      return;
    }

    handleAction('interviewing', scheduleData);
    setShowScheduleForm(false);
  };

  const isProcessing = processingIds?.has(candidate.id);

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-300" 
        onClick={onClose}
      />
      <div 
        className="fixed top-0 right-0 h-full w-full max-w-[600px] bg-white dark:bg-slate-900 shadow-2xl z-[110] transform transition-transform duration-300 translate-x-0 border-l border-slate-200 dark:border-slate-800 flex flex-col"
      >
        {/* Toast */}
        {toastMessage && (
          <div className={`absolute top-6 left-1/2 -translate-x-1/2 z-[120] px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 text-sm font-bold animate-in fade-in slide-in-from-top-4 ${
            toastMessage.type === 'error' ? 'bg-red-900 text-white' : 
            toastMessage.type === 'success' ? 'bg-emerald-900 text-white' : 
            'bg-slate-900 text-white'
          }`}>
            <span className="material-symbols-outlined text-[18px]">
              {toastMessage.type === 'error' ? 'error' : 
               toastMessage.type === 'success' ? 'check_circle' : 
               toastMessage.type === 'loading' ? 'sync' : 'info'}
            </span>
            {toastMessage.text}
          </div>
        )}

        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center font-black text-2xl uppercase border border-purple-200 dark:border-purple-800/50">
              {candidate.name?.charAt(0) || 'C'}
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{candidate.name || 'Candidate Name'}</h2>
              <p className="text-slate-500 font-bold">{candidate.email || 'candidate@example.com'}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] uppercase font-black tracking-widest bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md">
                  {candidate.status || 'applied'}
                </span>
                <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-md">
                  Applied 2 days ago
                </span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="size-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          
          {/* Match Score & Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1 bg-purple-50 dark:bg-purple-900/10 rounded-2xl p-4 border border-purple-100 dark:border-purple-900/30 flex flex-col items-center justify-center text-center">
              <div className="relative size-20 mb-2">
                <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                  <path className="text-purple-200 dark:text-purple-900/50" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                  <path className="text-purple-600 dark:text-purple-400" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${candidate.score || 85}, 100`} strokeLinecap="round" strokeWidth="4" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-black text-purple-700 dark:text-purple-300">{candidate.score || 85}</span>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-600/80">ATS Score</span>
            </div>
            
            <div className="col-span-2 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/50">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">psychology</span> AI Summary
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Candidate shows strong alignment with core requirements, specifically in frontend technologies. Extensive experience noted in relevant stack, though backend proficiency appears slightly below optimal target. Recommended for technical screening.
              </p>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl p-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">AI Recommendation:</h4>
                <div className="flex flex-col gap-1.5 mb-2">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px] text-green-600">check</span> Strong frontend fit
                  </div>
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px] text-amber-500">warning</span> Missing backend depth
                  </div>
                </div>
                <div className="text-xs font-black text-blue-700 dark:text-blue-300 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">arrow_right_alt</span> Recommended: Shortlist
                </div>
              </div>
            </div>
          </div>

          {/* Skills Analysis */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">Skill Match Analysis</h3>
            
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Matched Skills</p>
              <div className="flex flex-wrap gap-2">
                {candidate.matched_skills?.length ? candidate.matched_skills.map((s, i) => (
                  <span key={i} className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <span className="material-symbols-outlined text-[12px] align-middle mr-1">check</span>{s}
                  </span>
                )) : (
                  <span className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-lg border border-emerald-200 dark:border-emerald-800">React</span>
                )}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Missing Skills</p>
              <div className="flex flex-wrap gap-2">
                {candidate.missing_skills?.length ? candidate.missing_skills.map((s, i) => (
                  <span key={i} className="px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs font-bold rounded-lg border border-red-200 dark:border-red-800">
                    <span className="material-symbols-outlined text-[12px] align-middle mr-1">close</span>{s}
                  </span>
                )) : (
                  <span className="px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs font-bold rounded-lg border border-red-200 dark:border-red-800">GraphQL</span>
                )}
              </div>
            </div>
          </div>

          {/* Resume Preview Box */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2 flex justify-between items-center">
              Resume Preview
              <button className="text-purple-600 hover:text-purple-700 flex items-center gap-1 text-[10px] cursor-pointer">
                <span className="material-symbols-outlined text-[14px]">download</span> Download
              </button>
            </h3>
            
            <div className="w-full h-[400px] bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-6 text-center shadow-inner overflow-hidden relative group">
              {hasResume ? (
                 <iframe 
                   src={`${getResumeFileUrl(candidate.id)}#toolbar=0&navpanes=0`} 
                   className="w-full h-full rounded-xl border-none" 
                   title="Resume Preview" 
                 />
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/50 dark:to-slate-900/50 pointer-events-none" />
                  <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4 group-hover:scale-110 transition-transform">description</span>
                  <p className="text-sm font-bold text-slate-500">No Resume File Detected</p>
                  <p className="text-xs text-slate-400 mt-2">The candidate might not have uploaded a PDF yet.</p>
                  <button className="mt-4 px-6 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-purple-500 transition-colors z-10">
                    Request Resume
                  </button>
                </>
              )}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex-shrink-0 p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col gap-4">
          
          {showScheduleForm && (
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-purple-200 dark:border-purple-900/30 shadow-xl animate-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-black uppercase tracking-widest text-purple-600">Schedule Interview</h4>
                <button onClick={() => setShowScheduleForm(false)} className="material-symbols-outlined text-slate-400 hover:text-slate-600 text-sm">close</button>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input 
                  type="date" 
                  value={scheduleData.date} 
                  onChange={(e) => setScheduleData({...scheduleData, date: e.target.value})}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs font-bold" 
                />
                <input 
                  type="time" 
                  value={scheduleData.time} 
                  onChange={(e) => setScheduleData({...scheduleData, time: e.target.value})}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs font-bold" 
                />
              </div>
              <input 
                type="text" 
                placeholder="Location (e.g. Zoom, Office)" 
                value={scheduleData.location} 
                onChange={(e) => setScheduleData({...scheduleData, location: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs font-bold mb-3" 
              />
              <button 
                onClick={submitSchedule}
                className="w-full py-2 bg-purple-600 text-white text-xs font-black uppercase tracking-widest rounded-lg"
              >
                Confirm Interview
              </button>
            </div>
          )}

          <div className="flex gap-3">
            <button 
              disabled={isProcessing}
              onClick={() => handleAction('shortlisted')}
              className="flex-1 h-12 bg-purple-600 hover:bg-purple-700 text-white font-black text-[11px] uppercase tracking-widest rounded-xl shadow-lg shadow-purple-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">thumb_up</span> Shortlist
            </button>
            <button 
              disabled={isProcessing}
              onClick={() => setShowScheduleForm(true)}
              className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] uppercase tracking-widest rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">event</span> Schedule
            </button>
            <button 
              disabled={isProcessing}
              onClick={handleSendEmail}
              className="h-12 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] uppercase tracking-widest rounded-xl transition-all active:scale-95 flex items-center justify-center"
              title="Send Email"
            >
              <span className="material-symbols-outlined text-sm">mail</span>
            </button>
            <button 
              disabled={isProcessing}
              onClick={() => handleAction('rejected')}
              className="h-12 px-5 bg-white dark:bg-slate-800 text-red-600 border border-slate-200 dark:border-slate-700 hover:border-red-500 font-black text-[11px] uppercase tracking-widest rounded-xl transition-all active:scale-95 flex items-center justify-center disabled:opacity-50"
              title="Reject"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CandidateDetailSlideOut;
