import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchJobSeekerProfile, upsertJobSeekerProfile, uploadResume } from '../services/jobseekerService';
import { getCurrentUserId } from '../../../core/auth/session';
import { useResume } from '../context/ResumeContext';
import { useToast } from '../../../core/context/ToastContext';

// Import Design System
import { SectionHeader, ProgressBar, StatCard, SkillChip } from '../components/DesignSystem';

const Profile = () => {
  const userId = useMemo(() => getCurrentUserId(), []);
  const location = useLocation();
  const { showToast } = useToast();
  const { resumeData, updateResumeData } = useResume();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'Personal Settings');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    headline: '',
    skills: '',
    experience_years: 0,
    education_level: '',
    portfolio_url: '',
    github_url: '',
    bio: '',
  });

  const loadData = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await fetchJobSeekerProfile(userId);
      const prof = response?.profile;
      if (prof) {
        setProfile(prof);
        setForm({
          headline: prof.headline || '',
          skills: Array.isArray(prof.skills) ? prof.skills.join(', ') : '',
          experience_years: prof.experience_years || 0,
          education_level: prof.education_level || '',
          portfolio_url: prof.portfolio_url || '',
          github_url: prof.github_url || '',
          bio: prof.bio || '',
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  const onSave = async () => {
    try {
      setIsSaving(true);
      await upsertJobSeekerProfile(userId, {
        ...form,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        experience_years: Number(form.experience_years),
      });
      showToast('Profile updated successfully! ✅');
      loadData();
    } catch (err) {
      showToast('Failed to update profile ❌');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', userId);
      
      showToast('Processing resume... 📄');
      await uploadResume(formData);
      showToast('Resume synced successfully! ✅');
      loadData();
    } catch (err) {
      showToast('Upload failed ❌');
    } finally {
      setIsUploading(false);
    }
  };

  const performanceMetrics = [
    { category: 'Frontend', score: 85 },
    { category: 'Backend', score: 72 },
    { category: 'AI Architecture', score: 45 },
    { category: 'Cloud Infrastructure', score: 60 },
    { category: 'System Design', score: 90 },
  ];

  if (loading) return <div className="p-20 flex items-center justify-center font-black uppercase tracking-widest text-slate-400">Initializing Profile Context...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 px-4 sm:px-6">
      {/* PREMIUM HEADER */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="h-48 bg-slate-900 relative">
           <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent"></div>
           <span className="absolute bottom-0 right-0 material-symbols-outlined text-[15rem] text-white opacity-[0.03] rotate-12">fingerprint</span>
        </div>
        <div className="px-12 pb-12 flex flex-col md:flex-row items-start md:items-end gap-10 -mt-16 relative z-10">
          <div className="relative size-40 rounded-[3rem] border-8 border-white shadow-2xl overflow-hidden bg-white shrink-0">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`} alt="Avatar" className="size-full object-cover" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{profile?.name || 'User Profile'}</h1>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100">Verified Professional</span>
            </div>
            <p className="text-slate-500 font-bold uppercase tracking-[0.1em] text-sm">{form.headline || 'Professional Profile Ready'}</p>
            <div className="flex items-center gap-6 pt-2">
               <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  {profile?.location || 'Global Remote'}
               </div>
               <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span className="material-symbols-outlined text-sm">work_history</span>
                  {form.experience_years} Years Exp
               </div>
            </div>
          </div>
          <div className="flex gap-4 pb-2">
            <button 
              onClick={onSave}
              disabled={isSaving}
              className="px-10 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
            >
              {isSaving ? 'Saving...' : 'Sync Profile'}
            </button>
            <button className="px-10 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all active:scale-95">
              Export CV
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* SIDEBAR: METRICS */}
        <div className="lg:col-span-4 space-y-10">
           <section className="bg-white border border-slate-200 rounded-[2.5rem] p-10 space-y-10 shadow-sm">
              <SectionHeader title="Professional Vitality" icon="monitoring" />
              <div className="grid grid-cols-2 gap-8">
                 <StatCard label="App Score" value={88} suffix="%" />
                 <StatCard label="Response" value={94} suffix="%" color="text-emerald-600" />
              </div>
              <div className="space-y-8 pt-4">
                 {performanceMetrics.map((m, i) => (
                    <ProgressBar key={i} label={m.category} value={m.score} />
                 ))}
              </div>
           </section>

           <section className="bg-white border border-slate-200 rounded-[2.5rem] p-10 space-y-10 shadow-sm">
              <SectionHeader title="Skill Identity" icon="label" iconColor="text-emerald-600" bgColor="bg-emerald-50" />
              <div className="flex flex-wrap gap-2">
                 {form.skills.split(',').map((s, i) => s.trim() && (
                    <SkillChip key={i} label={s.trim()} variant="success" />
                 ))}
              </div>
           </section>
        </div>

        {/* MAIN: SETTINGS TABS */}
        <div className="lg:col-span-8 space-y-10">
           <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm flex flex-col h-full">
              <div className="flex border-b border-slate-100 px-8">
                {['Personal Settings', 'Resume Hub', 'System Preferences'].map(tab => (
                  <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)}
                    className={`px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${
                      activeTab === tab ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-blue-600' : 'text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-12 flex-1">
                 {activeTab === 'Personal Settings' && (
                   <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Professional Headline</label>
                            <input 
                              value={form.headline} 
                              onChange={(e) => setForm({...form, headline: e.target.value})} 
                              placeholder="e.g. Senior Full Stack Engineer"
                              className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all" 
                            />
                         </div>
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Years of Industry Experience</label>
                            <input 
                              type="number" 
                              value={form.experience_years} 
                              onChange={(e) => setForm({...form, experience_years: e.target.value})} 
                              className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all" 
                            />
                         </div>
                      </div>
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Professional Narrative (Bio)</label>
                         <textarea 
                           rows={6} 
                           value={form.bio} 
                           onChange={(e) => setForm({...form, bio: e.target.value})} 
                           placeholder="Tell your professional story..."
                           className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all resize-none"
                         />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Github Identity URL</label>
                            <input 
                              value={form.github_url} 
                              onChange={(e) => setForm({...form, github_url: e.target.value})} 
                              className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all" 
                            />
                         </div>
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Digital Portfolio</label>
                            <input 
                              value={form.portfolio_url} 
                              onChange={(e) => setForm({...form, portfolio_url: e.target.value})} 
                              className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all" 
                            />
                         </div>
                      </div>
                   </div>
                 )}

                 {activeTab === 'Resume Hub' && (
                   <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="flex items-center justify-between">
                         <SectionHeader title="Active Documents" icon="folder_shared" />
                         <input 
                           type="file" 
                           ref={fileInputRef} 
                           className="hidden" 
                           accept=".pdf" 
                           onChange={handleFileUpload} 
                         />
                         <button 
                           onClick={() => fileInputRef.current?.click()}
                           disabled={isUploading}
                           className="text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] hover:underline disabled:opacity-50"
                         >
                           {isUploading ? 'Syncing...' : '+ Upload New Version'}
                         </button>
                      </div>

                      <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-8 flex items-center justify-between group hover:border-blue-200 transition-all">
                         <div className="flex items-center gap-6">
                            <div className="size-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600 border border-slate-100">
                               <span className="material-symbols-outlined text-3xl">description</span>
                            </div>
                            <div>
                               <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{profile?.resume_filename || 'Primary_Professional_CV.pdf'}</p>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Last Synced: {profile?.resume_updated_at || 'Just Now'}</p>
                            </div>
                         </div>
                         <div className="flex gap-4">
                            <button className="size-10 rounded-xl bg-white border border-slate-100 text-slate-400 flex items-center justify-center hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm">
                               <span className="material-symbols-outlined text-xl">visibility</span>
                            </button>
                            <button className="size-10 rounded-xl bg-white border border-slate-100 text-slate-400 flex items-center justify-center hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm">
                               <span className="material-symbols-outlined text-xl">cloud_download</span>
                            </button>
                         </div>
                      </div>

                      <div className="p-8 bg-rose-50 border border-rose-100 rounded-[2rem] flex items-center gap-6">
                         <div className="size-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-rose-200">
                            <span className="material-symbols-outlined">security_update_warning</span>
                         </div>
                         <div className="space-y-1">
                            <h4 className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Privacy Insight</h4>
                            <p className="text-xs font-bold text-slate-600">Your resume is only visible to recruiters when you explicitly apply for a role.</p>
                         </div>
                      </div>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
