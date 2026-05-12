import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, MapPin, Edit2, Code, ExternalLink, 
  Settings, Bell, Lock, Eye, Download, UploadCloud, Briefcase, GraduationCap,
  Shield, GitBranch, Globe, Link2, CheckCircle2, ChevronRight, Award, Zap
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import EditProfileModal from '../components/EditProfileModal';
import { getCurrentUserId } from '../../../core/auth/session';
import { fetchJobSeekerProfile } from '../services/jobseekerService';

export default function Profile() {
  const userId = getCurrentUserId();
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
    <div className="py-32 text-center">
       <div className="animate-spin size-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accessing Identity Vault...</p>
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
  const completion = 85;

  return (
    <div className="space-y-8 pt-2">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">Profile Matrix</h1>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Professional Identity & Credentials</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setIsEditModalOpen(true)}
            className="h-10 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/10"
          >
            <Edit2 size={14} /> Update Credentials
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLUMN 1: IDENTITY CARD (4 Units) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm">
            <div className="h-32 bg-slate-900 dark:bg-black relative overflow-hidden">
               <div className="absolute inset-0 opacity-10">
                  <div className="absolute -right-10 -top-10 size-40 bg-blue-600 rounded-full blur-3xl"></div>
                  <div className="absolute -left-10 -bottom-10 size-40 bg-indigo-600 rounded-full blur-3xl"></div>
               </div>
            </div>
            
            <div className="px-8 pb-10 -mt-16 flex flex-col items-center text-center relative z-10">
              <div className="relative group">
                <div className="size-32 rounded-[2rem] bg-white dark:bg-slate-800 p-1 shadow-2xl">
                  <div className="size-full rounded-[1.8rem] bg-slate-50 dark:bg-slate-900 text-blue-600 flex items-center justify-center text-5xl font-black border-2 border-slate-100 dark:border-slate-800">
                    {name.charAt(0)}
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 size-10 bg-emerald-500 text-white rounded-2xl border-4 border-white dark:border-slate-900 flex items-center justify-center shadow-xl" title="Verified Profile">
                   <Shield size={18} fill="white" />
                </div>
              </div>
              
              <div className="mt-6 space-y-2">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">{name}</h2>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{role}</p>
              </div>

              {/* Completion Tracker */}
              <div className="w-full mt-10 space-y-3">
                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                  <span className="text-slate-400">Credential Maturity</span>
                  <span className="text-emerald-500">{completion}% Optimized</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${completion}%` }}></div>
                </div>
              </div>

              {/* Quick Info Grid */}
              <div className="w-full grid grid-cols-1 gap-4 mt-10 pt-10 border-t border-slate-50 dark:border-slate-800">
                {[
                  { icon: MapPin, value: profile?.location || 'Chennai, India' },
                  { icon: Mail, value: profile?.email || 'user@linkup.ai' },
                  { icon: Phone, value: profile?.phone || '+91 98765 43210' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 text-[11px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                    <div className="size-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-700/50">
                      <item.icon size={16} className="text-slate-400" />
                    </div>
                    {item.value}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Social Nodes */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 shadow-sm space-y-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Network Nodes</h3>
            <div className="grid grid-cols-1 gap-3">
              {[
                { name: 'GitHub', icon: GitBranch, color: 'text-slate-900', bg: 'bg-slate-50' },
                { name: 'LinkedIn', icon: Link2, color: 'text-blue-600', bg: 'bg-blue-50' },
                { name: 'Portfolio', icon: Globe, color: 'text-emerald-500', bg: 'bg-emerald-50' }
              ].map(social => (
                <a key={social.name} href="#" className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-blue-500/20 transition-all group">
                  <div className="flex items-center gap-4">
                    <social.icon size={20} className={social.color} />
                    <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{social.name}</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-500" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMN 2: TECHNICAL PROFILE (8 Units) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Professional Narrative */}
          <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-10 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
               <div className="size-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                  <User size={16} />
               </div>
               <h3 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Professional Narrative</h3>
            </div>
            <p className="text-lg font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic">
              "{profile?.about || 'Experienced professional focused on architectural excellence and modern UI systems.'}"
            </p>
          </section>

          {/* Skill Matrix */}
          <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-10 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="size-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
                     <Code size={16} />
                  </div>
                  <h3 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Technical Expertise</h3>
               </div>
               <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                  <Award size={12} /> Expert Status
               </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {(profile?.skills || ['React', 'JavaScript', 'Tailwind CSS', 'Node.js', 'System Design', 'TypeScript']).map(skill => (
                <span key={skill} className="px-6 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-[11px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest hover:border-emerald-500/30 transition-all cursor-default">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Career Timeline */}
          <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-10 shadow-sm space-y-10">
            <div className="flex items-center gap-3">
               <div className="size-8 bg-purple-600 rounded-lg flex items-center justify-center text-white">
                  <Briefcase size={16} />
               </div>
               <h3 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Career Timeline</h3>
            </div>
            
            <div className="space-y-12 pl-8 border-l-2 border-slate-50 dark:border-slate-800 relative">
              {[
                { role: 'Senior Frontend Engineer', company: 'Tech Solutions Inc', period: '2023 - Present', icon: Zap },
                { role: 'Software Developer', company: 'Innovation Labs', period: '2021 - 2023', icon: Code }
              ].map((exp, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-[41px] top-1.5 size-5 rounded-full bg-white dark:bg-slate-900 border-4 border-blue-600 shadow-lg group-hover:scale-125 transition-transform" />
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                       <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{exp.role}</h4>
                       <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/40 rounded text-[9px] font-black text-blue-600 uppercase tracking-widest">{exp.period}</span>
                    </div>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">{exp.company}</p>
                    <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 mt-4 leading-relaxed max-w-2xl">
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
