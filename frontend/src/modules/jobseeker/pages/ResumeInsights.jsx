import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import JobSeekerShell from '../components/JobSeekerShell';
import { getCurrentUser, getCurrentUserId } from '../../../core/auth/session';
import { fetchJobSeekerProfile } from '../services/jobseekerService';

export default function ResumeInsights() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ats');
  const [userProfile, setUserProfile] = useState(getCurrentUser());
  const [toastMessage, setToastMessage] = useState(null);
  const [completedBadges, setCompletedBadges] = useState(new Set());
  const [stats, setStats] = useState({
    atsScore: 82,
    currentScore: 82,
    pendingFixes: 3,
    versions: 2,
    potentialScore: 95
  });
  const userId = getCurrentUserId(1);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetchJobSeekerProfile(userId);
        if (res?.profile) {
          setUserProfile(res.profile);
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };
    loadProfile();
  }, [userId]);

  const activeResId = userProfile?.activeResumeId;
  const resumes = userProfile?.uploadedResumes || [];
  const activeRes = resumes.find(r => r.id === activeResId) || (resumes.length ? resumes[0] : null);

  const handleDelete = () => {
    if (!activeRes) return;
    const updatedResumes = resumes.filter(r => r.id !== activeRes.id);
    const updatedProfile = { 
      ...userProfile, 
      uploadedResumes: updatedResumes,
      activeResumeId: updatedResumes.length > 0 ? updatedResumes[0].id : null
    };
    setUserProfile(updatedProfile);
    
    // Update local storage to persist the deletion across the frontend
    const sessionUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    localStorage.setItem('currentUser', JSON.stringify({...sessionUser, ...updatedProfile}));
  };

  const handleApplySuggestion = (id, scoreIncrease) => {
    if (completedBadges.has(id)) return;
    
    setCompletedBadges(new Set([...completedBadges, id]));
    setStats(prev => ({
      ...prev,
      atsScore: Math.min(100, prev.atsScore + scoreIncrease),
      currentScore: Math.min(100, prev.currentScore + scoreIncrease),
      pendingFixes: Math.max(0, prev.pendingFixes - 1)
    }));
    
    setToastMessage("✔ Skill added");
    setTimeout(() => setToastMessage(null), 2000);
  };

  const tabs = [
    { id: 'ats', label: 'ATS Score', icon: 'analytics' },
    { id: 'analysis', label: 'Details', icon: 'description' },
    { id: 'suggestions', label: 'Suggestions', icon: 'edit_document' },
    { id: 'breakdown', label: 'Breakdown', icon: 'insert_chart' },
    { id: 'score-history', label: 'Score History', icon: 'history' }
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-200">
      <JobSeekerShell active="resume" />
      
      <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 max-w-[1200px] mx-auto w-full">
        {/* Top Header Row with Title and Upload Button */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
          
          {/* Left: Title & Subtitle */}
          <div className="flex items-start gap-3">
            <button onClick={() => navigate(-1)} className="mt-0.5 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shrink-0">
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">Resume Insights & AI Match Reasoning</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">AI-powered score breakdown and improvement tips</p>
            </div>
          </div>

          {/* Right: Uploaded Resume Manager */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-2.5 px-3 rounded-xl shadow-sm flex-1 sm:w-[280px]">
              <span className="material-symbols-outlined text-[20px] text-blue-500">picture_as_pdf</span>
              <div className="flex-1 truncate">
                {activeRes ? (
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{activeRes.filename || 'Uploaded_Resume.pdf'}</span>
                    <span className="text-[9px] uppercase font-bold text-slate-400 mt-0.5 tracking-wider">Processed & Parsed</span>
                  </div>
                ) : (
                  <span className="text-xs font-medium text-slate-500">No Resume Uploaded</span>
                )}
              </div>
              {activeRes && (
                <button 
                  onClick={handleDelete}
                  className="size-7 rounded-md bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-500 flex items-center justify-center transition-colors focus:outline-none shrink-0"
                  title="Delete Resume"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                </button>
              )}
            </div>
            <button 
              onClick={() => navigate('/jobseeker/upload-resume')}
              className="flex items-center justify-center gap-2 px-5 py-2.5 w-full sm:w-fit rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 shrink-0 whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[16px]">upload_file</span>
              Upload New Version
            </button>
          </div>
        </div>

        {/* Score Summary Hero Bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center">
            <div className="relative size-12 mb-1">
              <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                <path className="text-slate-100 dark:text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                <path className="text-blue-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${stats.atsScore}, 100`} strokeLinecap="round" strokeWidth="3" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-base font-black">{stats.atsScore}</span>
              </div>
            </div>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">ATS Score</p>
            <span className="mt-1 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase">Great</span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center">
            <div className="text-lg font-black text-slate-900 dark:text-white mb-1">{stats.currentScore}%</div>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">Current Score</p>
            <span className="mt-1 text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase">↑ {stats.currentScore}% ATS</span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center">
            <div className="text-lg font-black text-amber-500 mb-1">{stats.pendingFixes}</div>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">Pending Fixes</p>
            <span className="mt-1 text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold uppercase">{stats.pendingFixes} High Priority</span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center">
            <div className="text-lg font-black text-slate-900 dark:text-white mb-1">{stats.versions}</div>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">Resume Versions</p>
            <span className="mt-1 text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase">V{stats.versions} Active</span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center">
            <div className="text-lg font-black text-emerald-500 mb-1">{stats.potentialScore}</div>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">Potential Score</p>
            <span className="mt-1 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase">+{stats.potentialScore - stats.atsScore} pts boost</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 bg-white dark:bg-slate-900 rounded-2xl p-1.5 border border-slate-200 dark:border-slate-800 shadow-sm mb-4 overflow-x-auto scro">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400'
              }`}
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="mt-4">
          
          {/* ATS SCORE TAB */}
          {activeTab === 'ats' && (
            <div className="space-y-8 ">
              
              {/* Normal ATS Section */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">description</span>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">📄 Resume Format Analysis</h2>
                    <p className="text-xs text-slate-500">Auto-scored from your resume alone — no job description needed</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm relative overflow-hidden text-center">
                      <h2 className="text-lg font-bold mb-4">Overall Format Score</h2>
                      <div className="relative size-48 mx-auto mb-4">
                        <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                          <path className="text-slate-100 dark:text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                          <path className="text-slate-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="88, 100" strokeLinecap="round" strokeWidth="3" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-5xl font-black tracking-tighter">88</span>
                          <span className="text-slate-400 text-sm">out of 100</span>
                        </div>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-sm">Your resume structure is highly optimized for applicant tracking systems.</p>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm h-full">
                      <h2 className="text-lg font-bold mb-1">Skills Detected in Resume</h2>
                      <p className="text-sm text-slate-500 mb-4">All keywords found in your resume by the AI parser.</p>
                      <div className="flex flex-wrap gap-2 mb-6">
                         <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-xs font-semibold border border-slate-200 dark:border-slate-700">React</span>
                         <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-xs font-semibold border border-slate-200 dark:border-slate-700">Node.js</span>
                         <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-xs font-semibold border border-slate-200 dark:border-slate-700">Python</span>
                      </div>

                      <h3 className="font-bold text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-emerald-500 text-base">check_circle</span>
                        Format Strengths
                      </h3>
                      <div className="flex flex-col gap-2 mb-4">
                        <div className="text-sm flex items-start gap-2 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 p-2 rounded-lg"><span className="material-symbols-outlined text-[16px]">check</span> Clear headings and easily parsable sections.</div>
                        <div className="text-sm flex items-start gap-2 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 p-2 rounded-lg"><span className="material-symbols-outlined text-[16px]">check</span> Standard font sizes and bullet points used.</div>
                      </div>

                      <h3 className="font-bold text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-amber-500 text-base">warning</span>
                        Format Improvements
                      </h3>
                      <div className="flex flex-col gap-2">
                         <div className="text-sm flex items-start gap-2 bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 p-2 rounded-lg"><span className="material-symbols-outlined text-[16px]">warning</span> Consider adding a summary section for better ATS density.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* JD-Targeted Section */}
              <div>
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <hr className="w-full border-slate-200 dark:border-slate-700" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-slate-50 dark:bg-slate-950 px-4 py-1 text-xs font-semibold text-slate-400 uppercase tracking-widest rounded-full border border-slate-200 dark:border-slate-700">
                      🎯 JD-Targeted Analysis Below
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="size-8 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">work_history</span>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">🎯 JD-Targeted Analysis</h2>
                    <p className="text-xs text-slate-500">Paste a job description to get a tailored ATS match score and skill gap</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-6 mb-4 text-center">
                  <span className="material-symbols-outlined text-blue-400 text-5xl mb-2 block">analytics</span>
                  <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-1">JD Analyzer</h3>
                  <p className="text-sm text-slate-500 mb-4">Analysis is performed against the active resume and the provided job description.</p>
                  <div className="max-w-lg mx-auto flex flex-col gap-3">
                    <textarea rows="4" placeholder="Paste the job description here..." className="w-full text-sm border border-slate-300 dark:border-slate-600 rounded-xl p-3 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-400 outline-none resize-none"></textarea>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition-colors flex items-center gap-2 justify-center">
                      <span className="material-symbols-outlined text-lg">auto_awesome</span>
                      Run Analysis
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* SUGGESTIONS TAB */}
          {activeTab === 'suggestions' && (
            <div className="space-y-6 ">
              {toastMessage && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[120] bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 text-sm font-bold ">
                  <span className="material-symbols-outlined text-emerald-400">check_circle</span>
                  {toastMessage}
                </div>
              )}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white leading-tight">AI Gamified Suggestions</h2>
                    <p className="text-sm text-slate-500 font-bold">Complete these tasks to increase your ATS score instantly.</p>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <span className="text-sm font-bold text-slate-400">Target Score: <span className="text-emerald-500 font-black">95+</span></span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Badge 1 */}
                <div 
                  onClick={() => handleApplySuggestion('b1', 10)}
                  className={`relative overflow-hidden bg-white dark:bg-slate-900 border-2 ${completedBadges.has('b1') ? 'border-emerald-400 opacity-50' : 'border-slate-200 dark:border-slate-800 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-500/10'} rounded-3xl p-5 transition-all cursor-pointer group`}
                >
                  <div className="absolute top-0 right-0 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-black text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-bl-2xl">
                    +10% Score
                  </div>
                  <div className="flex items-start gap-4 mt-2">
                    <div className="size-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-2xl">{completedBadges.has('b1') ? 'check' : 'code'}</span>
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 dark:text-white text-base leading-tight mb-1">Add Missing Frameworks</h3>
                      <p className="text-xs text-slate-500 mb-3">Include React and Node.js in your skills section. The AI detected them in your experience but not in your skills list.</p>
                      <button className={`text-xs font-black px-4 py-2 rounded-xl transition-colors shadow-md ${completedBadges.has('b1') ? 'bg-emerald-600 text-white shadow-emerald-500/20' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'}`}>
                        {completedBadges.has('b1') ? 'Applied' : 'Fix Now'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Badge 2 */}
                <div 
                  onClick={() => handleApplySuggestion('b2', 5)}
                  className={`relative overflow-hidden bg-white dark:bg-slate-900 border-2 ${completedBadges.has('b2') ? 'border-emerald-400 opacity-50' : 'border-slate-200 dark:border-slate-800 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-500/10'} rounded-3xl p-5 transition-all cursor-pointer group`}
                >
                  <div className="absolute top-0 right-0 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-black text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-bl-2xl">
                    +5% Score
                  </div>
                  <div className="flex items-start gap-4 mt-2">
                    <div className="size-12 rounded-2xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-2xl">{completedBadges.has('b2') ? 'check' : 'edit_document'}</span>
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 dark:text-white text-base leading-tight mb-1">Quantify Achievements</h3>
                      <p className="text-xs text-slate-500 mb-3">Add metrics to your recent role. Example: "Improved performance by X%" instead of just "Improved performance".</p>
                      <button className={`text-xs font-black px-4 py-2 rounded-xl transition-colors shadow-md ${completedBadges.has('b2') ? 'bg-emerald-600 text-white shadow-emerald-500/20' : 'bg-purple-600 text-white hover:bg-purple-700 shadow-purple-500/20'}`}>
                        {completedBadges.has('b2') ? 'Applied' : 'Rewrite Bullets'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Badge 3 */}
                <div 
                  onClick={() => handleApplySuggestion('b3', 3)}
                  className={`relative overflow-hidden bg-white dark:bg-slate-900 border-2 ${completedBadges.has('b3') ? 'border-emerald-400 opacity-50' : 'border-slate-200 dark:border-slate-800 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-500/10'} rounded-3xl p-5 transition-all cursor-pointer group`}
                >
                  <div className="absolute top-0 right-0 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-black text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-bl-2xl">
                    +3% Score
                  </div>
                  <div className="flex items-start gap-4 mt-2">
                    <div className="size-12 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-2xl">{completedBadges.has('b3') ? 'check' : 'short_text'}</span>
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 dark:text-white text-base leading-tight mb-1">Strengthen Summary</h3>
                      <p className="text-xs text-slate-500 mb-3">Your professional summary is too brief. Expand it to 3-4 lines highlighting your core competencies.</p>
                      <button className={`text-xs font-black px-4 py-2 rounded-xl transition-colors shadow-md ${completedBadges.has('b3') ? 'bg-emerald-600 text-white shadow-emerald-500/20' : 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/20'}`}>
                        {completedBadges.has('b3') ? 'Applied' : 'Use AI Writer'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for other tabs (Content is simplified for static representation) */}
          {activeTab !== 'ats' && activeTab !== 'suggestions' && (
             <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm text-center py-20 ">
                <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-6xl mb-4">construction</span>
                <h3 className="text-xl font-bold text-slate-600 dark:text-slate-300">Feature Available Soon</h3>
                <p className="text-slate-500 mt-2">The {tabs.find(t=>t.id===activeTab)?.label} section is currently under development.</p>
             </div>
          )}
          
        </div>
      </main>
    </div>
  );
}
