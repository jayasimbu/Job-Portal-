import React, { useEffect, useMemo, useState } from 'react';
import { fetchJobSeekerProfile, upsertJobSeekerProfile, fetchJobSeekerCertificates, uploadCertificate } from '../services/jobseekerService';
import { getCurrentUserId } from '../../../core/auth/session';
import { useResume } from '../context/ResumeContext';

const Profile = () => {
  const userId = useMemo(() => getCurrentUserId(1), []);
  const { resumeData } = useResume();
  const [form, setForm] = useState({
    headline: '',
    skills: '',
    experience_years: 0,
    education_level: '',
    portfolio_url: '',
    github_url: '',
  });
  const [status, setStatus] = useState('');
  const [certificates, setCertificates] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const topCertificate = useMemo(() => {
    if (!certificates || certificates.length === 0) return null;
    return certificates.reduce((prev, current) => 
      (prev.confidence_score > current.confidence_score) ? prev : current
    );
  }, [certificates]);

  const loadData = async () => {
    try {
      const response = await fetchJobSeekerProfile(userId);
      const profile = response?.profile;
      
      try {
        const certsRes = await fetchJobSeekerCertificates();
        if (certsRes?.certificates) setCertificates(certsRes.certificates);
      } catch (err) {
        console.error("No certs found");
      }

      if (!profile) return;
      
      setForm({
        headline: profile.headline || '',
        skills: Array.isArray(profile.skills) ? profile.skills.join(', ') : '',
        experience_years: profile.experience_years || 0,
        education_level: profile.education_level || '',
        portfolio_url: profile.portfolio_url || '',
        github_url: profile.github_url || '',
      });
    } catch {
      setStatus('Unable to load profile now.');
    }
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  const onChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const autofillFromResume = () => {
    if (!resumeData) {
      setStatus('Please upload a resume in the Dashboard first.');
      return;
    }
    setForm(prev => ({
      ...prev,
      skills: resumeData.parsedData?.skills?.join(', ') || prev.skills,
      experience_years: resumeData.parsedData?.experienceYears || prev.experience_years,
    }));
    setStatus('Fields populated from resume analysis. Review and save!');
  };

  const onSave = async () => {
    try {
      setStatus('');
      await upsertJobSeekerProfile(userId, {
        headline: form.headline,
        skills: form.skills
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        experience_years: Number(form.experience_years) || 0,
        education_level: form.education_level,
        portfolio_url: form.portfolio_url,
        github_url: form.github_url,
      });
      setStatus('Profile saved successfully.');
    } catch {
      setStatus('Failed to save profile.');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    setUploadError('');
    try {
      if (file.size > 5 * 1024 * 1024) throw new Error("File exceeds 5MB limit");
      const ext = file.name.split('.').pop().toLowerCase();
      if (!['pdf', 'jpg', 'jpeg', 'png'].includes(ext)) throw new Error("Only PDF, JPG, PNG allowed");
      
      await uploadCertificate(file);
      await loadData();
    } catch (err) {
      setUploadError(err.response?.data?.message || err.message || "Failed to upload certificate");
    } finally {
      setUploading(false);
      e.target.value = null; // reset
    }
  };

  const readinessScore = resumeData?.optimizationScore || 45;

  return (
    <div className="h-full flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex-shrink-0 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Profile Optimization</h1>
          <p className="text-sm text-slate-500">Keep your profile complete to improve AI ranking and recommendations.</p>
        </div>
        <button 
          onClick={autofillFromResume}
          className="h-11 px-6 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2 shadow-sm"
        >
          <span className="material-symbols-outlined text-sm">magic_button</span>
          Fill from Resume
        </button>
      </header>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-10">
          
          {/* Main Form */}
          <section className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-8 space-y-8 shadow-sm">
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Personal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-1">Headline</label>
                  <input placeholder="e.g. Senior Frontend Engineer" className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-700 outline-none focus:border-blue-600 focus:bg-white transition-all" value={form.headline} onChange={(e) => onChange('headline', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-1">Skills (Comma Separated)</label>
                  <input placeholder="React, Node.js, etc." className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-700 outline-none focus:border-blue-600 focus:bg-white transition-all" value={form.skills} onChange={(e) => onChange('skills', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-1">Experience (Years)</label>
                  <input type="number" className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-700 outline-none focus:border-blue-600 focus:bg-white transition-all" value={form.experience_years} onChange={(e) => onChange('experience_years', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-1">Education Level</label>
                  <input placeholder="e.g. Bachelor's in CS" className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-700 outline-none focus:border-blue-600 focus:bg-white transition-all" value={form.education_level} onChange={(e) => onChange('education_level', e.target.value)} />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Links & Portfolio</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-1">GitHub URL</label>
                  <input placeholder="github.com/username" className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-700 outline-none focus:border-blue-600 focus:bg-white transition-all" value={form.github_url} onChange={(e) => onChange('github_url', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-1">Portfolio URL</label>
                  <input placeholder="yourportfolio.com" className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-700 outline-none focus:border-blue-600 focus:bg-white transition-all" value={form.portfolio_url} onChange={(e) => onChange('portfolio_url', e.target.value)} />
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button className="h-12 px-10 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95" onClick={onSave}>
                Update Profile
              </button>
              {status && <span className={`text-[10px] font-black uppercase tracking-widest ${status.includes('Failed') || status.includes('Dashboard') ? 'text-red-500' : 'text-emerald-500'}`}>{status}</span>}
            </div>
          </section>

          {/* AI Insights Card */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-[#111827] rounded-2xl p-8 text-white space-y-6 shadow-xl">
               <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-blue-400">auto_fix_high</span>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">AI Readiness Score</h3>
               </div>
               
               <div className="space-y-2">
                  <div className="flex justify-between items-end">
                     <span className="text-4xl font-black">{readinessScore}%</span>
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Target: 85%+</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${readinessScore}%` }} />
                  </div>
               </div>

               <div className="space-y-4 pt-4 border-t border-white/5">
                  <p className="text-xs font-bold text-slate-300">Detected Strengths</p>
                  <div className="flex flex-wrap gap-2">
                     {(resumeData?.parsedData?.skills || ['React', 'Node.js']).slice(0, 5).map(s => (
                       <span key={s} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-300">{s}</span>
                     ))}
                  </div>
               </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Verification Center</h3>
               <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <span className="material-symbols-outlined text-emerald-600">verified_user</span>
                  <div>
                     <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">Identity Verified</p>
                     <p className="text-[8px] font-bold text-emerald-500 mt-1 uppercase">Boosts application ranking</p>
                  </div>
               </div>
            </div>
          </aside>

          {/* Certificates Section */}
          <section className="lg:col-span-12 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm mt-2">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase mb-1">Professional Certifications</h3>
                <p className="text-xs font-bold text-slate-500">AI evaluated certificates can boost your ranking score up to 20 points.</p>
              </div>
              <label className="h-11 px-6 bg-[#111827] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm">
                {uploading ? 'Processing AI...' : '+ Upload Certificate'}
                <input type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileUpload} disabled={uploading} />
              </label>
            </div>

            {certificates.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                <span className="material-symbols-outlined text-4xl text-slate-300 mb-3">workspace_premium</span>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No certifications verified yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {certificates.map(cert => (
                  <div key={cert.id} className="p-5 bg-white border border-slate-200 rounded-xl hover:border-blue-500 transition-all shadow-sm flex flex-col justify-between h-full">
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-start">
                        <div className="size-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                           <span className="material-symbols-outlined">workspace_premium</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                           <span className={`size-2 rounded-full ${cert.verification_status === 'verified' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                           <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{cert.verification_status}</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-tight mb-1">{cert.certificate_name}</h4>
                        <p className="text-[10px] font-bold text-slate-500 uppercase">{cert.issuer}</p>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                       <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">AI Confidence: {cert.confidence_score}%</span>
                       <a href={cert.file_url} target="_blank" rel="noreferrer" className="size-8 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-all flex items-center justify-center">
                          <span className="material-symbols-outlined text-sm">visibility</span>
                       </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
