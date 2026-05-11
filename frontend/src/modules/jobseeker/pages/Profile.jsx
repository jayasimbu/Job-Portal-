import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchJobSeekerProfile, upsertJobSeekerProfile, uploadResume } from '../services/jobseekerService';
import { getCurrentUserId } from '../../../core/auth/session';
import { useResume } from '../context/ResumeContext';
import { useToast } from '../../../core/context/ToastContext';

// Import Global UI Components
import Button from '../../../components/ui/Button';
import Card, { CardBody, CardHeader, CardFooter } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { Heading, Text } from '../../../components/ui/Typography';

// Import Jobseeker Specific Components
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
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4 sm:px-6">
      {/* PREMIUM HEADER */}
      <Card className="overflow-hidden border-none shadow-md">
        <div className="h-48 bg-slate-900 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/10" />
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>
        <CardBody className="px-10 pb-10 flex flex-col md:flex-row items-start md:items-end gap-8 -mt-16 relative z-10">
          <div className="relative size-40 rounded-[2.5rem] border-8 border-white shadow-xl overflow-hidden bg-white shrink-0">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`} alt="Avatar" className="size-full object-cover" />
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <Heading level={1} className="text-3xl font-bold">{profile?.name || 'User Profile'}</Heading>
              <Badge variant="success" className="px-3 py-1">Verified Expert</Badge>
            </div>
            <Text variant="lead" className="text-slate-600 font-semibold">{form.headline || 'Add a professional headline'}</Text>
            <div className="flex flex-wrap items-center gap-6 pt-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400 text-base">location_on</span>
                <Text variant="small" className="font-bold text-slate-500 uppercase tracking-wider">{profile?.location || 'Global Remote'}</Text>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400 text-base">work_history</span>
                <Text variant="small" className="font-bold text-slate-500 uppercase tracking-wider">{form.experience_years} Years Exp</Text>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={onSave} disabled={isSaving} className="px-8">
              {isSaving ? 'Syncing...' : 'Sync Profile'}
            </Button>
            <Button variant="secondary" className="px-8">
              Export CV
            </Button>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* SIDEBAR: METRICS */}
        <div className="lg:col-span-4 space-y-8">
          <Card>
            <CardHeader>
              <SectionHeader title="Performance Vitals" icon="monitoring" />
            </CardHeader>
            <CardBody className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <StatCard label="App Rank" value={88} suffix="%" />
                <StatCard label="Response Rate" value={94} suffix="%" color="text-emerald-600" />
              </div>
              <div className="space-y-6 pt-4 border-t border-slate-50">
                {performanceMetrics.map((m, i) => (
                  <ProgressBar key={i} label={m.category} value={m.score} />
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <SectionHeader title="Skill Identity" icon="verified" iconColor="text-emerald-600" bgColor="bg-emerald-50" />
            </CardHeader>
            <CardBody>
              <div className="flex flex-wrap gap-2">
                {form.skills.split(',').map((s, i) => s.trim() && (
                  <SkillChip key={i} label={s.trim()} variant="success" />
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* MAIN: SETTINGS TABS */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="h-full flex flex-col">
            <div className="flex border-b border-slate-100 bg-slate-50/30 px-6">
              {['Personal Settings', 'Resume Hub', 'System Preferences'].map(tab => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-5 text-xs font-bold uppercase tracking-widest transition-all relative ${
                    activeTab === tab ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-blue-600' : 'text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <CardBody className="p-10 flex-1">
              {activeTab === 'Personal Settings' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Text variant="small" className="font-bold uppercase tracking-widest text-slate-400 px-1">Headline</Text>
                      <input 
                        value={form.headline} 
                        onChange={(e) => setForm({...form, headline: e.target.value})} 
                        placeholder="e.g. Senior Full Stack Engineer"
                        className="w-full h-12 px-5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Text variant="small" className="font-bold uppercase tracking-widest text-slate-400 px-1">Industry Experience (Years)</Text>
                      <input 
                        type="number" 
                        value={form.experience_years} 
                        onChange={(e) => setForm({...form, experience_years: e.target.value})} 
                        className="w-full h-12 px-5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Text variant="small" className="font-bold uppercase tracking-widest text-slate-400 px-1">Professional Bio</Text>
                    <textarea 
                      rows={5} 
                      value={form.bio} 
                      onChange={(e) => setForm({...form, bio: e.target.value})} 
                      placeholder="Tell your professional story..."
                      className="w-full p-5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Text variant="small" className="font-bold uppercase tracking-widest text-slate-400 px-1">GitHub Profile</Text>
                      <input 
                        value={form.github_url} 
                        onChange={(e) => setForm({...form, github_url: e.target.value})} 
                        className="w-full h-12 px-5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Text variant="small" className="font-bold uppercase tracking-widest text-slate-400 px-1">Portfolio Website</Text>
                      <input 
                        value={form.portfolio_url} 
                        onChange={(e) => setForm({...form, portfolio_url: e.target.value})} 
                        className="w-full h-12 px-5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Resume Hub' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center justify-between">
                    <SectionHeader title="Active Document" icon="folder_shared" />
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept=".pdf" 
                      onChange={handleFileUpload} 
                    />
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      <span className="material-symbols-outlined mr-2 text-base">add</span>
                      {isUploading ? 'Uploading...' : 'Update Resume'}
                    </Button>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex items-center justify-between group hover:border-blue-300 transition-all">
                    <div className="flex items-center gap-5">
                      <div className="size-14 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 border border-slate-100">
                        <span className="material-symbols-outlined text-2xl">description</span>
                      </div>
                      <div>
                        <Text className="font-bold text-slate-900 leading-none">{profile?.resume_filename || 'Primary_Professional_CV.pdf'}</Text>
                        <Text variant="small" className="font-bold text-slate-400 uppercase tracking-widest mt-2">Last Updated: {profile?.resume_updated_at || 'Just Now'}</Text>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="px-3">
                        <span className="material-symbols-outlined text-base">visibility</span>
                      </Button>
                      <Button variant="outline" size="sm" className="px-3">
                        <span className="material-symbols-outlined text-base">download</span>
                      </Button>
                    </div>
                  </div>

                  <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-5">
                    <div className="size-12 bg-amber-500 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-amber-200">
                      <span className="material-symbols-outlined">security</span>
                    </div>
                    <div className="space-y-0.5">
                      <Text variant="small" className="font-bold text-amber-700 uppercase tracking-widest leading-none">Privacy Guard</Text>
                      <Text variant="small" className="font-semibold text-slate-600">Your documents are only visible to authorized recruiters during active applications.</Text>
                    </div>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
