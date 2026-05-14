import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, MapPin, Edit2, Code, 
  Shield, GitBranch, Globe, Link2, ChevronRight, Award, Zap, Sparkles,
  Briefcase, Target, FileText, Eye, Camera, Loader, Trash2
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import EditProfileModal from '../components/EditProfileModal';
import { getCurrentUserId } from '../../../core/auth/session';
import { fetchJobSeekerProfile } from '../services/jobseekerService';
import { useResume } from '../context/ResumeContext';
import appConfig from '../../../core/config/appConfig';
import apiClient from '../../../core/api/apiClient';

export default function Profile() {
  const userId = getCurrentUserId();
  const { resumeData } = useResume();
  const [profile, setProfile] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const avatarInputRef = React.useRef(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        if (userId) {
          const res = await fetchJobSeekerProfile(userId);
          setProfile(res?.data?.profile || res?.profile || null);
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [userId]);

  const handleSaveProfile = (updatedData) => {
    setProfile(prev => ({ ...prev, ...updatedData }));
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsAvatarUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', String(userId));

      const resp = await apiClient.post('/jobseeker/profile/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const data = resp.data;
      const newAvatarUrl = data.avatar_url || data.data?.avatar_url;
      
      if (newAvatarUrl) {
        setProfile(prev => ({ ...prev, avatar_url: newAvatarUrl }));
        
        // Update local session user object
        const currentUser = JSON.parse(localStorage.getItem(appConfig.auth.userStorageKey) || '{}');
        const updatedUser = { ...currentUser, avatar_url: newAvatarUrl };
        localStorage.setItem(appConfig.auth.userStorageKey, JSON.stringify(updatedUser));
        
        // Refresh page to sync all components
        window.location.reload();
      }
    } catch (err) {
      console.error("Avatar upload error:", err);
    } finally {
      setIsAvatarUploading(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  const handleAvatarDelete = async () => {
    if (!window.confirm("Remove profile picture?")) return;
    try {
      setIsAvatarUploading(true);
      await apiClient.delete(`/jobseeker/profile/delete-image?user_id=${userId}`);
      
      setProfile(prev => ({ ...prev, avatar_url: null }));
      
      // Update local session user object
      const currentUser = JSON.parse(localStorage.getItem(appConfig.auth.userStorageKey) || '{}');
      const updatedUser = { ...currentUser, avatar_url: null };
      localStorage.setItem(appConfig.auth.userStorageKey, JSON.stringify(updatedUser));
      
      // Refresh page to sync all components
      window.location.reload();
    } catch (err) {
      console.error("Avatar delete error:", err);
    } finally {
      setIsAvatarUploading(false);
    }
  };

  if (loading) return (
    <div className="py-20 text-center">
       <div className="animate-spin size-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3"></div>
       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loading profile...</p>
    </div>
  );

  const userSession = (() => {
    try {
      return JSON.parse(localStorage.getItem('currentUser') || '{}');
    } catch {
      return {};
    }
  })();

  const name = profile?.full_name || profile?.name || userSession?.full_name || 'Professional User';
  const role = profile?.role || 'Professional Developer';
  const atsScore = profile?.ats_score ?? resumeData?.optimizationScore ?? 0;
  
  const parsedProjects = profile?.uploadedResumes?.[0]?.parsed_data?.projects || resumeData?.parsedData?.projects || [];
  const parsedSkills = profile?.skills || resumeData?.parsedData?.skills || [];
  
  const email = profile?.email || userSession?.email || 'Not specified';
  const phone = profile?.phone || 'Not specified';
  const location = profile?.location || 'Not specified';
  const about = profile?.about || profile?.hr_summary || 'Experienced professional focused on building high-performance applications and modern UI systems.';
  const visibility = profile?.is_active !== false ? 'Active' : 'Hidden';
  
  const fieldsToCheck = [
    profile?.full_name || profile?.name || userSession?.full_name,
    profile?.role,
    profile?.location,
    profile?.phone,
    profile?.about,
    parsedSkills.length > 0 ? true : null,
    parsedProjects.length > 0 ? true : null
  ];
  const filledFields = fieldsToCheck.filter(Boolean).length;
  const completion = Math.round((filledFields / fieldsToCheck.length) * 100) || 0;
  
  const skillsList = parsedSkills.length > 0 ? parsedSkills : ['React', 'JavaScript', 'Tailwind CSS', 'Node.js', 'System Design', 'TypeScript'];
  const experienceList = profile?.experience || (parsedProjects.length > 0 
    ? parsedProjects 
    : [
        { role: 'Senior Frontend Engineer', company: 'Tech Solutions Inc', period: '2023 - Present', desc: 'Leading architectural design and implementing high-performance UI systems for enterprise-scale platforms.' },
        { role: 'Software Developer', company: 'Innovation Labs', period: '2021 - 2023', desc: 'Developed core frontend infrastructure and user features.' }
      ]);

  return (
    <div className="space-y-5 pt-2">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">Profile</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Your professional details</p>
        </div>
        <Button 
          onClick={() => setIsEditModalOpen(true)}
          className="h-9 px-5 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/10"
        >
          <Edit2 size={13} /> Edit Profile
        </Button>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'ATS Score', value: `${atsScore}%`, icon: Target, color: atsScore >= 70 ? 'text-emerald-600' : atsScore >= 40 ? 'text-amber-600' : 'text-rose-500' },
          { label: 'Profile Completion', value: `${completion}%`, icon: FileText, color: 'text-blue-600' },
          { label: 'Skills', value: skillsList.length, icon: Code, color: 'text-purple-600' },
          { label: 'Visibility', value: visibility, icon: Eye, color: 'text-emerald-600' }
        ].map((m, idx) => (
          <div key={idx} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex items-center gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <div className={`size-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center ${m.color}`}>
              <m.icon size={16} />
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">{m.label}</p>
              <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{m.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* UNIFIED PREMIUM CONTENT AREA */}
      <div className="space-y-6">
        
        {/* SECTION 1: PREMIUM HEADER CARD (Unified Identity & Links) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl shadow-blue-500/5">
          <div className="h-16 bg-slate-900 dark:bg-black relative overflow-hidden">
             <div className="absolute inset-0 opacity-20">
                <div className="absolute -right-20 -top-20 size-80 bg-blue-600 rounded-full blur-[100px]"></div>
                <div className="absolute -left-20 -bottom-20 size-80 bg-indigo-600 rounded-full blur-[100px]"></div>
             </div>
             {/* Dynamic background pattern */}
             <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          </div>
          
          <div className="px-8 pb-8">
            <div className="relative flex flex-col md:flex-row md:items-end justify-between -mt-12 gap-6">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
                <div className="relative group">
                  <input 
                    type="file" 
                    ref={avatarInputRef} 
                    onChange={handleAvatarUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  <div className="size-32 rounded-3xl bg-white dark:bg-slate-800 p-1 shadow-2xl transition-transform duration-500 group-hover:scale-105 relative overflow-hidden">
                    {profile?.avatar_url ? (
                      <img 
                        src={`${appConfig.api.baseUrl.replace('/api', '')}${profile.avatar_url}`} 
                        alt="Avatar" 
                        className="size-full rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="size-full rounded-2xl bg-blue-50 dark:bg-slate-900 text-blue-600 flex items-center justify-center text-4xl font-black border-2 border-slate-100 dark:border-slate-700">
                        {name.charAt(0)}
                      </div>
                    )}
                    
                    {profile?.avatar_url && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleAvatarDelete(); }}
                        className="absolute top-2 right-2 size-7 bg-rose-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-20 hover:scale-110 active:scale-95 transition-all"
                        title="Delete Profile Picture"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                    
                    {/* Overlay on hover */}
                    <button 
                      onClick={() => avatarInputRef.current?.click()}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 rounded-2xl"
                    >
                      {isAvatarUploading ? <Loader size={20} className="animate-spin" /> : <Camera size={20} />}
                      <span className="text-[8px] font-bold uppercase tracking-widest">Change</span>
                    </button>
                  </div>
                  <div className="absolute -bottom-2 -right-2 size-10 bg-emerald-500 text-white rounded-2xl border-4 border-white dark:border-slate-900 flex items-center justify-center shadow-lg animate-bounce-subtle" title="Verified Expert">
                     <Shield size={20} fill="white" />
                  </div>
                </div>
                
                <div className="space-y-1 pb-2">
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">{name}</h2>
                    <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/40 rounded-lg text-[9px] font-black text-blue-600 uppercase tracking-widest border border-blue-100 dark:border-blue-800">Verified</span>
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">{role}</p>
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3">
                    {[
                      { icon: MapPin, value: location },
                      { icon: Mail, value: email },
                      { icon: Phone, value: phone }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                        <item.icon size={12} className="text-blue-500" />
                        <span>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pb-2">
                {[
                  { name: 'GitHub', icon: GitBranch, color: 'hover:text-slate-900 dark:hover:text-white' },
                  { name: 'LinkedIn', icon: Link2, color: 'hover:text-blue-600' },
                  { name: 'Portfolio', icon: Globe, color: 'hover:text-emerald-500' }
                ].map(social => (
                  <a key={social.name} href="#" className={`size-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 transition-all ${social.color} hover:bg-white dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-700 shadow-sm`}>
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* Profile Progress integrated into header */}
            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
               <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  <div className="md:col-span-8 space-y-3">
                    <div className="flex items-center gap-2">
                       <div className="size-6 bg-blue-600/10 text-blue-600 rounded-lg flex items-center justify-center">
                          <User size={12} />
                       </div>
                       <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">About Me</h3>
                    </div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                      {about}
                    </p>
                  </div>
                  <div className="md:col-span-4 bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                    <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-[0.3em] mb-2">
                      <span className="text-slate-400">Profile Readiness</span>
                      <span className="text-emerald-500">{completion}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(16,185,129,0.4)]" style={{ width: `${completion}%` }}></div>
                    </div>
                    <p className="text-[9px] font-medium text-slate-400 mt-3 leading-relaxed">
                      Complete your profile to unlock premium job matching and priority verification.
                    </p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: SKILLS (Full Width Grid) */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-3">
                <div className="size-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
                   <Code size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Core Expertise</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Technologies & Tools</p>
                </div>
             </div>
             <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-full text-[10px] font-black text-emerald-600 uppercase tracking-widest border border-emerald-100 dark:border-emerald-800">{skillsList.length} SKILLS</span>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {skillsList.map(skill => (
              <div key={skill} className="group relative">
                <div className="absolute inset-0 bg-emerald-500/20 blur-lg rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative px-5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest group-hover:border-emerald-500 group-hover:text-emerald-500 transition-all cursor-default">
                  {skill}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: PROJECT SHOWCASE (New Section with Images) */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-3">
                <div className="size-10 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center">
                   <Award size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Featured Projects</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Showcase of work</p>
                </div>
             </div>
             <Button variant="ghost" className="text-[9px] font-black uppercase tracking-widest text-indigo-600">View All</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {[
               { title: 'AI Matching Engine', category: 'Backend / AI', icon: Zap, tags: ['Python', 'FastAPI', 'Ollama'] },
               { title: 'Zen UI Kit', category: 'Design System', icon: Sparkles, tags: ['React', 'Tailwind', 'Figma'] }
             ].map((project, i) => (
               <div key={i} className="group relative bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 hover:border-indigo-500/50 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                     <div className="size-12 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center">
                        <project.icon size={24} />
                     </div>
                     <div className="flex gap-1.5">
                        {project.tags.map(t => <span key={t} className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-[8px] font-black text-slate-500 uppercase tracking-widest">{t}</span>)}
                     </div>
                  </div>
                  <div>
                     <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm mb-1">{project.title}</h4>
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{project.category}</p>
                  </div>
                  <div className="absolute bottom-6 right-6 size-8 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-400 group-hover:text-indigo-500 group-hover:shadow-lg transition-all opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0">
                     <ChevronRight size={16} />
                  </div>
               </div>
             ))}
          </div>
        </section>

        {/* SECTION 4: PROFESSIONAL EXPERIENCE (Unified Timeline) */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-10">
             <div className="size-10 bg-purple-600/10 text-purple-600 rounded-xl flex items-center justify-center">
                <Briefcase size={20} />
             </div>
             <div>
               <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Professional Roadmap</h3>
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Experience & Roles</p>
             </div>
          </div>
          
          <div className="space-y-0">
            {experienceList.map((exp, idx) => (
              <div key={idx} className={`relative pb-10 last:pb-0 ${idx !== experienceList.length - 1 ? 'border-l-2 border-slate-100 dark:border-slate-800 ml-5 pl-10' : 'ml-5 pl-10'}`}>
                <div className="absolute -left-[11px] top-0 size-5 rounded-full bg-white dark:bg-slate-900 border-4 border-purple-500 shadow-lg shadow-purple-500/20"></div>
                
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50 hover:border-purple-500/30 transition-all group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                     <div>
                        <h4 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none mb-2">{exp.role || exp.name || 'Project Role'}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em]">{exp.company || 'Independent / Portfolio'}</span>
                          <span className="size-1 bg-slate-300 dark:bg-slate-600 rounded-full"></span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{exp.period || exp.date || 'Recent'}</span>
                        </div>
                     </div>
                  </div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-4xl whitespace-pre-wrap">
                    {exp.desc || exp.description || 'Developed key features and optimized system performance.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {isEditModalOpen && (
        <EditProfileModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)}
          initialData={{
            name: name,
            role: role,
            location: profile?.location || '',
            phone: profile?.phone || '',
            about: profile?.about || '',
            skills: skillsList || [],
            experience: experienceList || [],
            socialLinks: profile?.socialLinks || { github: '', linkedin: '', portfolio: '' }
          }}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  );
}
