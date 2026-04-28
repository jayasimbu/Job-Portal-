import React, { useState } from 'react';
import { upsertCompanyProfile } from '../services/employerService';
import { getCurrentUser, getCurrentUserId } from '../../../core/auth/session';
import { useToast } from '../../../core/context/ToastContext';

const CompanyProfile = () => {
  const userId = getCurrentUserId(1);
  const user = getCurrentUser();
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    company_name: user?.full_name || 'CloudScale Systems',
    website: 'https://cloudscale.com',
    industry: 'SaaS',
    size: '200-500',
    description: 'We build cloud productivity tools for distributed teams.',
  });

  const onSave = async () => {
    setSaving(true);
    try {
      await upsertCompanyProfile(userId, {
        company_name: form.company_name,
        website: form.website,
        description: `${form.description} | Industry: ${form.industry} | Size: ${form.size}`,
      });
      showToast('Company Profile Updated ✅');
    } catch {
      showToast('Failed to save profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-sm font-bold focus:ring-2 focus:ring-purple-500 outline-none transition-all";

  return (
    <div className="h-full flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER */}
      <header className="flex-shrink-0 mb-6">
        <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Company Settings</h1>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Manage your brand identity and hiring profile.</p>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pb-4 min-h-0">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Company Avatar + Name */}
          <div className="flex items-center gap-6 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
            <div className="size-20 bg-purple-600 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-purple-500/20">
              {form.company_name.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{form.company_name}</h3>
              <p className="text-sm text-slate-500">{form.industry} · {form.size} employees</p>
              <button className="mt-2 text-[10px] font-black uppercase tracking-widest text-purple-600">Change Logo</button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Company Name</label>
                <input className={inputCls} value={form.company_name} onChange={(e) => setForm((p) => ({ ...p, company_name: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Website</label>
                <input className={inputCls} value={form.website} onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Industry</label>
                <input className={inputCls} value={form.industry} onChange={(e) => setForm((p) => ({ ...p, industry: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Company Size</label>
                <input className={inputCls} value={form.size} onChange={(e) => setForm((p) => ({ ...p, size: e.target.value }))} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">About Company</label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-purple-500 outline-none resize-none"
              />
            </div>
          </div>

          {/* Save */}
          <div className="flex justify-end">
            <button
              onClick={onSave}
              disabled={saving}
              className="px-10 py-4 bg-purple-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-purple-700 shadow-[0_8px_20px_rgba(147,51,234,0.3)] transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
            >
              {saving ? 'Saving...' : 'Save Company Profile'}
              {!saving && <span className="material-symbols-outlined text-sm">save</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
