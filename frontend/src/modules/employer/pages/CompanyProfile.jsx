import React, { useState, useEffect, useRef } from 'react';
import { upsertCompanyProfile, fetchCompanyProfile, uploadCompanyLogo } from '../services/employerService';
import { getCurrentUser, getCurrentUserId } from '../../../core/auth/session';
import { useToast } from '../../../core/context/ToastContext';
import { Building2, User, Settings, Save, Upload, Loader2, Link as LinkIcon, MapPin, Globe, X, Trash2 } from 'lucide-react';

import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import appConfig from '../../../core/config/appConfig';

const CompanyProfile = () => {
  const user = getCurrentUser();
  const userId = user?.id;
  const { showToast } = useToast();
  const fileInputRef = useRef(null);
  
  const [loading, setLoading] = useState(!userId);

  const [saving, setSaving] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);

  const [form, setForm] = useState({
    company_name: user?.full_name || '',
    company_type: '',
    domain: '',
    industry: '',
    website: '',
    linkedin: '',
    location: '',
    size: '11-50',
    description: '',
    logo_url: '',
    hr_name: '',
    designation: '',
    email: user?.email || '',
    phone: '',
    preferred_skills: '',
    job_categories: '',
    hiring_mode: 'Hybrid',
    hiring_locations: '',
    hiring_frequency: 'Continuous Hiring',
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchCompanyProfile(userId);
        if (data && data.profile) {
          setForm(prev => ({ ...prev, ...data.profile }));
          if (data.profile.logo_url) {
            const baseUrl = appConfig.api.baseUrl.replace('/api', '');
            setLogoPreview(`${baseUrl}${data.profile.logo_url}?t=${Date.now()}`);
          }
        }

      } catch (err) {
        console.log("No profile found yet, using defaults");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [userId]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveLogo = async (e) => {
    e.stopPropagation();
    setLogoUploading(true);
    try {
      await upsertCompanyProfile(userId, { ...form, logo_url: "" });
      setForm(prev => ({ ...prev, logo_url: "" }));
      setLogoPreview(null);
      showToast('Logo Removed 🗑️');
      window.dispatchEvent(new Event('logoUpdated'));
    } catch (err) {
      showToast('Failed to remove logo', 'error');
    } finally {
      setLogoUploading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result);
    reader.readAsDataURL(file);

    // Upload
    setLogoUploading(true);
    try {
      const res = await uploadCompanyLogo(userId, file);
      setForm(prev => ({ ...prev, logo_url: res.logo_url }));
      showToast('Logo Updated ✨');
      window.dispatchEvent(new Event('logoUpdated'));
    } catch (err) {
      showToast('Failed to upload logo', 'error');
    } finally {
      setLogoUploading(false);
    }
  };


  const onSave = async () => {
    setSaving(true);
    try {
      await upsertCompanyProfile(userId, form);
      showToast('Profile Saved Successfully ✅');
    } catch {
      showToast('Failed to save profile', 'error');
    } finally {
      setSaving(false);
    }
  };


  const inputCls = "w-full h-12 bg-slate-100 border border-slate-300 rounded-xl px-4 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-600 outline-none transition-all";
  const labelCls = "text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block";
  const sectionCls = "p-8 bg-slate-50 border border-slate-300 rounded-2xl space-y-6 shadow-sm";

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 size={40} className="text-blue-600 animate-spin" />
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto space-y-8 pb-16">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange} 
      />

      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Company Profile</h1>
          <p className="text-sm text-slate-500 font-medium">Manage your company hiring identity and details.</p>
        </div>
        <Badge variant="success" className="uppercase font-black tracking-widest px-4 py-1.5 rounded-xl border-none bg-emerald-50 text-emerald-600">
          Verified Employer
        </Badge>
      </header>

      <div className="space-y-6">
        {/* Company Info */}
        <section className={sectionCls}>
          <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-700 pb-4">
             <Building2 size={20} className="text-blue-600" />
             <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Company Information</h2>
          </div>
          
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div 
              onClick={handleLogoClick}
              className="group relative size-32 bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl flex flex-col items-center justify-center shrink-0 text-slate-400 gap-1 cursor-pointer hover:border-blue-500 hover:bg-blue-50/30 transition-all overflow-hidden"
            >
              {logoPreview ? (
                <>
                  <img src={logoPreview} alt="Logo" className="size-full object-cover p-2 rounded-3xl" />
                  <button 
                    onClick={handleRemoveLogo}
                    className="absolute top-2 right-2 size-8 bg-rose-500 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-rose-500/20 hover:bg-rose-600 z-10"
                  >
                    <Trash2 size={14} />
                  </button>
                </>
              ) : (
                <>
                  <Upload size={24} className="group-hover:-translate-y-1 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Upload Logo</span>
                  <span className="text-[8px] font-bold text-slate-400">PNG or JPG</span>
                </>
              )}
              
              {logoUploading && (
                <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center">
                  <Loader2 size={20} className="text-blue-600 animate-spin" />
                </div>
              )}


              <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors pointer-events-none" />
            </div>

            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>Company Name</label>
                <input name="company_name" value={form.company_name} onChange={handleChange} className={inputCls} placeholder="e.g. Acme Corp" />
              </div>
              <div>
                <label className={labelCls}>Company Type</label>
                <select name="company_type" value={form.company_type} onChange={handleChange} className={inputCls}>
                   <option value="">Select Type</option>
                   <option value="Startup">Startup</option>
                   <option value="Product Company">Product Company</option>
                   <option value="Service Company">Service Company</option>
                   <option value="Agency">Agency</option>
                   <option value="Enterprise">Enterprise</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Company Domain</label>
                <select name="domain" value={form.domain} onChange={handleChange} className={inputCls}>
                   <option value="">Select Domain</option>
                   <option value="IT Services">IT Services</option>
                   <option value="Software">Software</option>
                   <option value="Finance">Finance</option>
                   <option value="Healthcare">Healthcare</option>
                   <option value="Education">Education</option>
                   <option value="Marketing">Marketing</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Company Size</label>
                <select name="size" value={form.size} onChange={handleChange} className={inputCls}>
                   <option value="1-10">1-10 employees</option>
                   <option value="11-50">11-50 employees</option>
                   <option value="51-200">51-200 employees</option>
                   <option value="201-500">201-500 employees</option>
                   <option value="500+">500+ employees</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Headquarters Location</label>
                <input name="location" value={form.location} onChange={handleChange} className={inputCls} placeholder="e.g. Bangalore, India" />
              </div>
              <div>
                <label className={labelCls}>Company Website</label>
                <input name="website" value={form.website} onChange={handleChange} className={inputCls} placeholder="https://" />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>LinkedIn (Optional)</label>
                <input name="linkedin" value={form.linkedin} onChange={handleChange} className={inputCls} placeholder="https://linkedin.com/company/..." />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>Company Overview</label>
                <textarea 
                  name="description" 
                  value={form.description} 
                  onChange={handleChange} 
                  rows={3} 
                  className="w-full bg-slate-100 border border-slate-300 rounded-xl p-4 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-600 outline-none transition-all resize-none"
                  placeholder="Describe your company, culture, and hiring focus..."
                />
              </div>
            </div>
          </div>
        </section>

        {/* Recruiter Info */}
        <section className={sectionCls}>
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
             <User size={20} className="text-blue-600" />
             <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Recruiter Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelCls}>Full Name</label>
              <input name="hr_name" value={form.hr_name} onChange={handleChange} className={inputCls} placeholder="HR / Recruiter Name" />
            </div>
            <div>
              <label className={labelCls}>Designation</label>
              <input name="designation" value={form.designation} onChange={handleChange} className={inputCls} placeholder="e.g. Talent Acquisition Lead" />
            </div>
            <div>
              <label className={labelCls}>Work Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} className={inputCls} placeholder="name@company.com" />
            </div>
            <div>
              <label className={labelCls}>Direct Phone (Optional)</label>
              <input name="phone" value={form.phone} onChange={handleChange} className={inputCls} placeholder="+1 234 567 890" />
            </div>
          </div>
        </section>

        {/* Hiring Preferences */}
        <section className={sectionCls}>
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
             <Settings size={20} className="text-blue-600" />
             <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Hiring Preferences</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelCls}>Preferred Work Mode</label>
              <select name="hiring_mode" value={form.hiring_mode} onChange={handleChange} className={inputCls}>
                 <option value="Remote">Remote</option>
                 <option value="Hybrid">Hybrid</option>
                 <option value="Onsite">Onsite</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Hiring Locations</label>
              <select name="hiring_locations" value={form.hiring_locations} onChange={handleChange} className={inputCls}>
                 <option value="India">India</option>
                 <option value="Chennai">Chennai</option>
                 <option value="Bangalore">Bangalore</option>
                 <option value="Remote">Remote</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Hiring Frequency</label>
              <select name="hiring_frequency" value={form.hiring_frequency} onChange={handleChange} className={inputCls}>
                 <option value="Occasional">Occasional</option>
                 <option value="Monthly">Monthly</option>
                 <option value="Continuous Hiring">Continuous Hiring</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Primary Job Categories</label>
              <input name="job_categories" value={form.job_categories} onChange={handleChange} className={inputCls} placeholder="e.g. Engineering, Sales" />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Tech Stack / Core Skills (Comma separated)</label>
              <input name="preferred_skills" value={form.preferred_skills} onChange={handleChange} className={inputCls} placeholder="e.g. React, Python, AWS, Figma" />
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-4">
          <Button 
            onClick={onSave} 
            disabled={saving}
            className="h-12 px-10 text-sm font-bold tracking-wide"
          >
            {saving ? 'Saving...' : 'Save Profile'}
            {!saving && <Save size={16} className="ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
