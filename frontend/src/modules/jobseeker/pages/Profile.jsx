import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, MapPin, Edit2, Code, 
  Shield, GitBranch, Globe, Link2, ChevronRight, Award, Zap,
  Briefcase, Target, FileText, Eye
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import EditProfileModal from '../components/EditProfileModal';
import { getCurrentUserId } from '../../../core/auth/session';
import { fetchJobSeekerProfile } from '../services/jobseekerService';
import { useResume } from '../context/ResumeContext';

export default function Profile() {
  const userId = getCurrentUserId();
  const { resumeData } = useResume();
  const [profile, setProfile] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        if (userId) {
          const res = await fetchJobSeekerProfile(userId);
          setProfile(res?.profile || null);
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
  const completion = 85;

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
          { label: 'Skills', value: (profile?.skills || []).length, icon: Code, color: 'text-purple-600' },
          { label: 'Visibility', value: 'Active', icon: Eye, color: 'text-emerald-600' }
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* COLUMN 1: IDENTITY CARD (4 Units) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
            <div className="h-20 bg-slate-900 dark:bg-black relative overflow-hidden">
               <div className="absolute inset-0 opacity-10">
                  <div className="absolute -right-10 -top-10 size-32 bg-blue-600 rounded-full blur-3xl"></div>
                  <div className="absolute -left-10 -bottom-10 size-32 bg-indigo-600 rounded-full blur-3xl"></div>
               </div>
            </div>
            
            <div className="px-6 pb-6 -mt-10 flex flex-col items-center text-center relative z-10">
              <div className="relative">
                <div className="size-20 rounded-2xl bg-slate-50 dark:bg-slate-800 p-0.5 shadow-xl">
                  <div className="size-full rounded-[14px] bg-slate-100 dark:bg-slate-900 text-blue-600 flex items-center justify-center text-3xl font-black border-2 border-slate-200 dark:border-slate-700">
                    {name.charAt(0)}
                  </div>
                </div>
                <div className="absolute -bottom-1.5 -right-1.5 size-7 bg-emerald-500 text-white rounded-xl border-3 border-white dark:border-slate-800 flex items-center justify-center shadow-lg" title="Verified">
                   <Shield size={14} fill="white" />
                </div>
              </div>
              
              <div className="mt-4 space-y-1">
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">{name}</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{role}</p>
              </div>

              {/* Completion Bar */}
              <div className="w-full mt-6 space-y-2">
                <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest">
                  <span className="text-slate-400">Profile Completion</span>
                  <span className="text-emerald-500">{completion}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${completion}%` }}></div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="w-full grid grid-cols-1 gap-3 mt-6 pt-5 border-t border-slate-50 dark:border-slate-700">
                {[
                  { icon: MapPin, value: profile?.location || 'Chennai, India' },
                  { icon: Mail, value: profile?.email || userSession?.email || 'user@linkup.ai' },
                  { icon: Phone, value: profile?.phone || '+91 98765 43210' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-[11px] font-bold text-slate-600 dark:text-slate-400 tracking-wide">
                    <div className="size-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700/50">
                      <item.icon size={14} className="text-slate-400" />
                    </div>
                    <span className="truncate">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Links</h3>
            <div className="grid grid-cols-1 gap-2">
              {[
                { name: 'GitHub', icon: GitBranch, color: 'text-slate-900' },
                { name: 'LinkedIn', icon: Link2, color: 'text-blue-600' },
                { name: 'Portfolio', icon: Globe, color: 'text-emerald-500' }
              ].map(social => (
                <a key={social.name} href="#" className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-transparent hover:border-blue-500/20 transition-all group">
                  <div className="flex items-center gap-3">
                    <social.icon size={16} className={social.color} />
                    <span className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-widest">{social.name}</span>
                  </div>
                  <ChevronRight size={12} className="text-slate-300 group-hover:text-blue-500" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMN 2: DETAILS (8 Units) */}
        <div className="lg:col-span-8 space-y-4">
          {/* About */}
          <section className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
               <div className="size-7 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                  <User size={14} />
               </div>
               <h3 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">About</h3>
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
              {profile?.about || 'Experienced professional focused on building high-performance applications and modern UI systems.'}
            </p>
          </section>

          {/* Skills */}
          <section className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <div className="size-7 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
                     <Code size={14} />
                  </div>
                  <h3 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Skills</h3>
               </div>
               {(profile?.skills || []).length > 5 && (
                 <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded uppercase tracking-widest">{(profile?.skills || []).length} Skills</span>
               )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {(profile?.skills || ['React', 'JavaScript', 'Tailwind CSS', 'Node.js', 'System Design', 'TypeScript']).map(skill => (
                <span key={skill} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest hover:border-emerald-500/30 transition-all cursor-default">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Experience */}
          <section className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2">
               <div className="size-7 bg-purple-600 rounded-lg flex items-center justify-center text-white">
                  <Briefcase size={14} />
               </div>
               <h3 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Experience</h3>
            </div>
            
            <div className="space-y-6 pl-6 border-l-2 border-slate-200 dark:border-slate-700 relative">
              {[
                { role: 'Senior Frontend Engineer', company: 'Tech Solutions Inc', period: '2023 - Present' },
                { role: 'Software Developer', company: 'Innovation Labs', period: '2021 - 2023' }
              ].map((exp, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-[29px] top-1 size-4 rounded-full bg-slate-50 dark:bg-slate-900 border-[3px] border-blue-600 shadow-md group-hover:scale-125 transition-transform" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                       <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{exp.role}</h4>
                       <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/40 rounded text-[9px] font-bold text-blue-600 uppercase tracking-widest">{exp.period}</span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{exp.company}</p>
                    <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400 mt-2 leading-relaxed max-w-2xl">
                      Leading architectural design and implementing high-performance UI systems for enterprise-scale platforms.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Edit Profile Modal */}
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
            socialLinks: profile?.socialLinks || { github: '', linkedin: '', portfolio: '' }
          }}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  );
}
