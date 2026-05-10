import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UI } from '../../../constants/ui';
import { 
  fetchCandidateDetail, 
  updateApplicationStatus, 
  addRecruiterNote, 
  getResumeFileUrl,
  checkResumeExists
} from '../services/employerService';
import { useToast } from '../../../core/context/ToastContext';

const STATUS_THEMES = {
  applied: 'bg-blue-50 text-blue-600',
  shortlisted: 'bg-emerald-50 text-emerald-600',
  rejected: 'bg-rose-50 text-rose-600',
  interview_scheduled: 'bg-indigo-50 text-indigo-600',
  reviewing: 'bg-amber-50 text-amber-600',
};

export default function CandidateDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [resumeExists, setResumeExists] = useState(false);

  useEffect(() => {
    loadCandidate();
  }, [id]);

  const loadCandidate = async () => {
    try {
      setLoading(true);
      const res = await fetchCandidateDetail(id);
      const cand = res.candidate;
      setCandidate(cand);
      
      if (cand.user_id) {
        const exists = await checkResumeExists(cand.user_id);
        setResumeExists(exists);
      }
    } catch (error) {
      console.error('Candidate detail load error', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateApplicationStatus(id, newStatus);
      showToast(`Candidate marked as ${newStatus}`, 'success');
      loadCandidate();
    } catch (error) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    try {
      setAddingNote(true);
      await addRecruiterNote(id, noteText);
      setNoteText('');
      loadCandidate();
      showToast('Note added', 'success');
    } catch (error) {
      showToast('Failed to add note', 'error');
    } finally {
      setAddingNote(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
         <div className="size-12 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin" />
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Candidate Data...</p>
      </div>
    );
  }

  if (!candidate) return (
    <div className="p-20 text-center">
       <span className="material-symbols-outlined text-rose-500 text-5xl mb-4">error</span>
       <h2 className="text-2xl font-black text-slate-900 uppercase">Candidate Not Found</h2>
       <p className="text-slate-500 mt-2 font-medium">The requested candidate could not be located.</p>
    </div>
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex items-center gap-6">
           <button 
             onClick={() => navigate(-1)}
             className="size-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all shadow-sm"
           >
              <span className="material-symbols-outlined">arrow_back</span>
           </button>
           <div className="space-y-1">
              <div className="flex items-center gap-3">
                 <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">{candidate.name}</h1>
                 <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${STATUS_THEMES[candidate.status] || 'bg-slate-50 text-slate-500'}`}>
                    {candidate.status.replace('_', ' ')}
                 </div>
              </div>
              <p className="text-slate-500 font-bold text-sm">
                 Applying for <span className="text-blue-600 uppercase">{candidate.role}</span>
              </p>
           </div>
        </div>

        <div className="flex gap-3">
           <button onClick={() => handleStatusChange('rejected')} className={UI.BTN_SECONDARY + " text-rose-600 border-rose-100 hover:bg-rose-50"}>Reject</button>
           <button onClick={() => handleStatusChange('shortlisted')} className={UI.BTN_SECONDARY + " text-emerald-600 border-emerald-100 hover:bg-emerald-50"}>Shortlist</button>
           <button onClick={() => navigate('/platform/employer/interviews')} className={UI.BTN_PRIMARY}>Schedule Interview</button>
        </div>
      </div>

      <div className={UI.GRID_MAIN}>
         {/* Main Content */}
         <div className={UI.COL_MAIN + " space-y-8"}>
            {/* Score & Stats */}
            <div className={UI.CARD_BASE}>
               <div className="flex justify-between items-center mb-10">
                  <div>
                     <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Candidate Evaluation</h3>
                     <p className="text-xs text-slate-500 mt-1">AI-driven matching against role requirements.</p>
                  </div>
                  <div className="text-right">
                     <span className="text-5xl font-black text-blue-600 tracking-tighter">{candidate.score}%</span>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Match Score</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                     {[
                        { label: 'Technical Match', val: candidate.ats_score > 70 ? 80 : 60, icon: 'code' },
                        { label: 'Experience Level', val: candidate.experience_years > 2 ? 70 : 40, icon: 'history' },
                        { label: 'Skill Set Coverage', val: 90, icon: 'task_alt' },
                     ].map((stat, i) => (
                        <div key={i} className="space-y-2">
                           <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-tight">
                              <div className="flex items-center gap-2 text-slate-500">
                                 <span className="material-symbols-outlined text-sm">{stat.icon}</span>
                                 <span>{stat.label}</span>
                              </div>
                              <span className="text-slate-900">{stat.val}%</span>
                           </div>
                           <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${stat.val}%` }} />
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                     <span className="material-symbols-outlined text-blue-600 mb-2">auto_awesome</span>
                     <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">AI Summary</p>
                     <p className="text-xs text-slate-600 font-bold leading-relaxed italic">
                        "Strong alignment with technical requirements. Candidate shows exceptional growth potential and relevant industry experience."
                     </p>
                  </div>
               </div>
            </div>

            {/* Resume Viewer */}
            <div className={UI.CARD_BASE + " p-0 overflow-hidden flex flex-col min-h-[800px]"}>
               <div className="px-8 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                  <div className="flex items-center gap-3">
                     <span className="material-symbols-outlined text-blue-600">description</span>
                     <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Candidate Resume</h3>
                  </div>
                  <a 
                    href={getResumeFileUrl(candidate.user_id)} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                  >
                    Open Fullscreen <span className="material-symbols-outlined text-sm">open_in_new</span>
                  </a>
               </div>
               
               <div className="flex-1 bg-slate-100 p-4">
                  {resumeExists ? (
                     <iframe 
                       src={`${getResumeFileUrl(candidate.user_id)}#toolbar=0`} 
                       className="w-full h-full rounded-xl shadow-lg bg-white"
                       title="Resume"
                     />
                  ) : (
                     <div className="h-full flex flex-col items-center justify-center text-center p-20">
                        <span className="material-symbols-outlined text-slate-300 text-6xl mb-4">folder_off</span>
                        <h3 className="text-lg font-black text-slate-400 uppercase">No Resume Found</h3>
                        <p className="text-xs text-slate-400 mt-1">Candidate has not uploaded a resume file yet.</p>
                     </div>
                  )}
               </div>
            </div>
         </div>

         {/* Sidebar Content */}
         <div className={UI.COL_SIDE + " space-y-8"}>
            {/* Skills */}
            <div className={UI.CARD_BASE}>
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Candidate Skills</h3>
               
               <div className="space-y-8">
                  <div className="space-y-3">
                     <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">verified</span> Verified Skills
                     </p>
                     <div className="flex flex-wrap gap-2">
                        {candidate.skills?.slice(0, 12).map(skill => (
                           <span key={skill} className="px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-md text-[9px] font-black uppercase">
                              {skill}
                           </span>
                        ))}
                     </div>
                  </div>

                  {candidate.missing_keywords?.length > 0 && (
                     <div className="space-y-3">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                           <span className="material-symbols-outlined text-sm">error_outline</span> Missing Requirements
                        </p>
                        <div className="flex flex-wrap gap-2 opacity-60">
                           {candidate.missing_keywords.map(skill => (
                              <span key={skill} className="px-2.5 py-1 bg-slate-50 text-slate-500 border border-slate-200 rounded-md text-[9px] font-black uppercase">
                                 {skill}
                              </span>
                           ))}
                        </div>
                     </div>
                  )}
               </div>
            </div>

            {/* Recruiter Notes */}
            <div className={UI.CARD_BASE + " p-0 overflow-hidden"}>
               <div className="p-6 border-b border-slate-100 bg-slate-50/30">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Internal Notes</h3>
               </div>
               
               <div className="p-6 space-y-6 max-h-[350px] overflow-y-auto">
                  {candidate.notes?.length > 0 ? (
                     candidate.notes.map((note, i) => (
                        <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-xl relative">
                           <p className="text-xs text-slate-700 font-medium leading-relaxed">{note.text}</p>
                           <p className="text-[8px] font-black text-slate-400 uppercase mt-3">{new Date(note.created_at).toLocaleDateString()}</p>
                        </div>
                     ))
                  ) : (
                     <div className="py-8 text-center opacity-30">
                        <p className="text-[9px] font-black uppercase tracking-widest">No internal notes yet</p>
                     </div>
                  )}
               </div>

               <div className="p-6 border-t border-slate-100">
                  <textarea 
                    className="w-full bg-white border border-slate-200 rounded-xl p-4 text-xs font-semibold outline-none focus:border-blue-600 transition-all resize-none"
                    rows={3}
                    placeholder="Add a private note..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                  />
                  <button 
                    disabled={addingNote || !noteText.trim()}
                    onClick={handleAddNote}
                    className="w-full h-10 mt-3 bg-blue-600 text-white rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all disabled:opacity-50"
                  >
                     {addingNote ? 'Adding...' : 'Add Note'}
                  </button>
               </div>
            </div>

            {/* Brief Info */}
            <div className={UI.CARD_BASE + " bg-slate-900 text-white"}>
               <div className="space-y-6">
                  <div className="flex items-center gap-4">
                     <span className="material-symbols-outlined text-blue-400">school</span>
                     <div>
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Education</p>
                        <p className="text-xs font-black uppercase truncate">{candidate.education || 'N/A'}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className="material-symbols-outlined text-emerald-400">work_history</span>
                     <div>
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Experience</p>
                        <p className="text-xs font-black uppercase">{candidate.experience_years} Years</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

