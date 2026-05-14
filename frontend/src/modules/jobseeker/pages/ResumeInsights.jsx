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
        const profile = res?.data?.profile || res?.profile;
        if (profile) {
          setUserProfile(profile);
          setStats({
            atsScore: profile.ats_score || 0,
            currentScore: profile.ats_score || 0,
            pendingFixes: profile.missing_skills?.length || 0,
            versions: profile.uploadedResumes?.length || 1,
            potentialScore: Math.min(100, (profile.ats_score || 0) + (profile.missing_skills?.length || 0) * 5)
          });
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
    { id: 'suggestions', label: 'Suggestions', icon: 'edit_document' },
    { id: 'breakdown', label: 'Breakdown', icon: 'insert_chart' },
    { id: 'score-history', label: 'Score History', icon: 'history' }
  ];

  return (
    <JobSeekerShell active="resume">
      <div className="max-w-[1200px] mx-auto">
        {/* Top Header Row with Title and Upload Button */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          
          {/* Left: Title & Subtitle */}
          <div className="flex items-start gap-4">
            <button onClick={() => navigate(-1)} className="mt-1 text-slate-400 hover:text-blue-600 transition-colors shrink-0">
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-900 leading-tight">Resume Intelligence</h1>
              <p className="text-sm font-medium text-slate-500 mt-1">AI-driven ATS analysis and optimization suggestions</p>
            </div>
          </div>

          {/* Right: Upload Actions */}
          <div className="flex items-center gap-3">
             {toastMessage && (
              <div className="animate-in fade-in slide-in-from-right-4 bg-emerald-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 mr-2">
                 <span className="material-symbols-outlined text-[14px]">done_all</span>
                 {toastMessage}
              </div>
            )}
            <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-95">
              <span className="material-symbols-outlined text-[20px]">upload_file</span>
              Upload New
            </button>
          </div>
        </div>

        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="size-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined">analytics</span>
              </div>
              <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg tracking-wider">+5% Today</span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ATS Score</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{stats.atsScore}%</h3>
          </div>

          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="size-10 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined">lightbulb</span>
              </div>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Critical Fixes</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{stats.pendingFixes}</h3>
          </div>

          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="size-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined">history</span>
              </div>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Saved Versions</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{stats.versions}</h3>
          </div>

          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-sm ring-2 ring-blue-600/5 ring-offset-0">
            <div className="flex items-center justify-between mb-4">
              <div className="size-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                <span className="material-symbols-outlined">trending_up</span>
              </div>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Potential Score</p>
            <h3 className="text-3xl font-black text-blue-600 mt-1">{stats.potentialScore}%</h3>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl mb-8 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-slate-50 text-blue-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'ats' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Active Resume Card */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Resume</h3>
                    <span className="size-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  </div>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="size-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                      <span className="material-symbols-outlined text-[32px]">description</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-slate-900 truncate">
                        {activeRes ? activeRes.filename : 'No resume uploaded'}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Updated {activeRes ? new Date(activeRes.uploaded_at).toLocaleDateString() : '--'}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <button className="w-full py-3 bg-slate-100 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-black uppercase tracking-wider transition-colors">
                      Download PDF
                    </button>
                    <button 
                      onClick={handleDelete}
                      className="w-full py-3 text-rose-500 hover:bg-rose-50 rounded-xl text-xs font-black uppercase tracking-wider transition-colors"
                    >
                      Delete Version
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
                  <span className="material-symbols-outlined text-blue-400 text-3xl mb-4">auto_awesome</span>
                  <h4 className="text-lg font-black leading-tight mb-2">AI Optimization Active</h4>
                  <p className="text-xs text-blue-100 font-medium leading-relaxed opacity-90">
                    We've identified key improvements that could boost your score significantly. Apply them in the suggestions tab.
                  </p>
                </div>
              </div>

              {/* Main Analysis Results */}
              <div className="lg:col-span-2">
                <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8 shadow-sm h-full">
                  <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600">checklist</span>
                    Analysis Summary
                  </h3>
                  
                  <div className="space-y-8">
                    <div className="flex gap-4">
                      <div className="size-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined">check_circle</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900">Format Integrity</h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">Your resume structure is easily readable by standard ATS systems.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="size-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined">warning</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900">Missing Core Skills</h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">We noticed a lack of modern framework mentions like Next.js or GraphQL.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'suggestions' && (
            <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black text-slate-900">Smart Suggestions</h3>
                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl uppercase tracking-widest">AI Powered</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-slate-100 rounded-2xl border border-transparent hover:border-blue-200 transition-all cursor-pointer group">
                  <div className="flex items-start gap-4">
                    <div className="size-10 bg-slate-50 rounded-xl flex items-center justify-center shadow-sm text-blue-600 shrink-0">
                      <span className="material-symbols-outlined">add_task</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">Add Next.js to Skills</h4>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed mb-4">Highly requested for frontend roles.</p>
                      <button 
                        onClick={() => handleApplySuggestion('s1', 5)}
                        className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-all ${completedBadges.has('s1') ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                      >
                        {completedBadges.has('s1') ? 'Added' : 'Apply'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Fallback for other tabs */}
          {activeTab !== 'ats' && activeTab !== 'suggestions' && (
            <div className="bg-slate-50 rounded-3xl border border-slate-200 p-20 shadow-sm text-center">
              <div className="size-20 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-4xl">construction</span>
              </div>
              <h3 className="text-xl font-black text-slate-900">Under Construction</h3>
              <p className="text-slate-500 mt-2 max-w-sm mx-auto">Coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </JobSeekerShell>
  );
}
