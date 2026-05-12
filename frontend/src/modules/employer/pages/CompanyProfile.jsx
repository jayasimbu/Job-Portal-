import React, { useState } from 'react';
import { upsertCompanyProfile } from '../services/employerService';
import { getCurrentUser, getCurrentUserId } from '../../../core/auth/session';
import { useToast } from '../../../core/context/ToastContext';
import { Building2, User, Settings, Save } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';

const CompanyProfile = () => {
  const userId = getCurrentUserId(1);
  const user = getCurrentUser();
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    // Company Info
    company_name: user?.full_name || '',
    company_type: '',
    domain: '',
    industry: '',
    website: '',
    linkedin: '',
    location: '',
    size: '11-50',
    description: '',
    // Recruiter Info
    hr_name: '',
    designation: '',
    email: user?.email || '',
    phone: '',
    // Hiring Preferences
    preferred_skills: '',
    job_categories: '',
    hiring_mode: 'Hybrid',
    hiring_locations: '',
    hiring_frequency: 'Continuous Hiring',
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSave = async () => {
    setSaving(true);
    try {
      await upsertCompanyProfile(userId, {
        company_name: form.company_name,
        website: form.website,
        description: `Industry: ${form.industry} | Size: ${form.size} | Desc: ${form.description}`,
      });
      showToast('Profile Saved ✅');
    } catch {
      showToast('Failed to save profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-600 outline-none transition-all";
  const labelCls = "text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block";
  const sectionCls = "p-8 bg-white border border-slate-200 rounded-2xl space-y-6 shadow-sm";

  return (
    <div className="max-w-[1000px] mx-auto space-y-8 pb-8">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900">Company Profile</h1>
          <p className="text-sm text-slate-500 font-medium">Manage your company hiring profile.</p>
        </div>
        <Badge variant="success" className="uppercase font-bold tracking-widest px-3 py-1">
          Verified Employer
        </Badge>
      </header>

      <div className="space-y-6">
        {/* Company Info */}
        <section className={sectionCls}>
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
             <Building2 size={20} className="text-blue-600" />
             <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Company Information</h2>
          </div>
          
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="size-24 bg-slate-100 border border-slate-200 rounded-2xl flex flex-col items-center justify-center shrink-0 text-slate-400 gap-1 cursor-pointer hover:bg-slate-50 transition-colors">
              <span className="material-symbols-outlined text-2xl">add_photo_alternate</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Upload Logo</span>
              <span className="text-[8px] font-bold text-slate-400">PNG or JPG</span>
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-600 outline-none transition-all resize-none"
                  placeholder="Describe your company, culture, and hiring focus..."
                />
              </div>
            </div>
          </div>
        </section>

        {/* Recruiter Info */}
        <section className={sectionCls}>
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
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
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
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
