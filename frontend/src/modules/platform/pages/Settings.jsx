import React, { useState } from 'react';
import { getCurrentUser } from '../../../core/auth/session';
import { useToast } from '../../../core/context/ToastContext';

const Settings = () => {
  const { showToast } = useToast();
  const user = getCurrentUser();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // profile | links | resume | preferences

  const [settings, setSettings] = useState({
    emailAlerts: true,
    atsInsights: true,
    weeklyReport: false,
    profileVisible: true,
    autoMatch: true
  });

  const [profileData, setProfileData] = useState({
    fullName: user?.full_name || 'Jayasimbu Jayamani',
    email: user?.email || 'jaya@example.com',
    bio: 'Senior Frontend Developer passionate about AI and clean architecture.',
    linkedin: 'linkedin.com/in/jayasimbu',
    github: 'github.com/jayasimbu',
    portfolio: 'jayasimbu.dev'
  });

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast('Settings Updated Successfully ✅');
    }, 800);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'person' },
    { id: 'links', label: 'Social Links', icon: 'link' },
    { id: 'resume', label: 'AI Resume Data', icon: 'description' },
    { id: 'preferences', label: 'Preferences', icon: 'settings_suggest' },
  ];

  return (
    <div className="w-full px-4 md:px-6 lg:px-10 xl:px-16 py-6 md:py-10 h-full flex flex-col overflow-y-auto duration-700 relative">
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-8">
      {/* HEADER */}
      <header className="flex-shrink-0 mb-6">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight uppercase">Settings & Profile</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage your identity, links, and platform intelligence.</p>
      </header>



      <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
        {/* Sidebar Tabs */}
        <aside className="w-full md:w-56 flex-shrink-0">
          <nav className="flex md:flex-col gap-1 bg-slate-50 dark:bg-slate-900 p-2 rounded-2xl border border-slate-300 dark:border-slate-700">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-3xl p-6 overflow-y-auto custom-scrollbar">
          {activeTab === 'profile' && (
            <div className="space-y-6 ">
               <div className="flex items-center gap-6 mb-8">
                  <div className="size-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-blue-500/20">
                    {profileData.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{profileData.fullName}</h3>
                    <p className="text-sm text-slate-500">{profileData.email}</p>
                    <button className="mt-2 text-[10px] font-black uppercase tracking-widest text-blue-600">Change Avatar</button>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                    <input 
                      type="text" 
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                      className="w-full h-11 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                    <input 
                      type="email" 
                      value={profileData.email}
                      disabled
                      className="w-full h-11 bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl px-4 text-sm font-bold text-slate-400 cursor-not-allowed" 
                    />
                  </div>
               </div>

               <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Professional Bio</label>
                  <textarea 
                    rows={4}
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
               </div>
            </div>
          )}

          {activeTab === 'links' && (
            <div className="space-y-6 ">
               <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">Social & Portfolio Links</h3>
               
               {[
                 { id: 'linkedin', label: 'LinkedIn URL', icon: 'link' },
                 { id: 'github', label: 'GitHub Profile', icon: 'code' },
                 { id: 'portfolio', label: 'Portfolio Website', icon: 'language' }
               ].map(link => (
                 <div key={link.id} className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{link.label}</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">{link.icon}</span>
                      <input 
                        type="text" 
                        value={profileData[link.id]}
                        onChange={(e) => setProfileData({...profileData, [link.id]: e.target.value})}
                        className="w-full h-11 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                      />
                    </div>
                 </div>
               ))}
            </div>
          )}

          {activeTab === 'resume' && (
            <div className="space-y-6 ">
               <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">AI Extracted Insights</h3>
                  <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase tracking-tighter">Synced with latest resume</span>
               </div>

               <div className="p-5 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Detected Skill Cloud</h4>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'Node.js', 'Python', 'AWS', 'Docker', 'Tailwind CSS', 'System Design'].map(skill => (
                      <span key={skill} className="px-3 py-1 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 shadow-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">ATS Optimization</h4>
                    <p className="text-2xl font-black text-blue-600">78%</p>
                  </div>
                  <div className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Market Relevance</h4>
                    <p className="text-2xl font-black text-emerald-600">High</p>
                  </div>
               </div>

               <div className="p-5 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-blue-600 text-lg">auto_awesome</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">AI Summary</span>
                  </div>
                  <p className="text-[13px] font-medium text-slate-700 dark:text-slate-300 leading-relaxed italic">
                    "Candidate shows strong frontend expertise with a pivot towards full-stack architecture. Suggested to quantify achievements in the current role to reach a 90%+ score."
                  </p>
               </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-8 ">
               <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">Platform Preferences</h3>
                  <div className="space-y-4">
                    {[
                      { key: 'emailAlerts', label: 'Email Notifications', desc: 'Get notified about new job matches.' },
                      { key: 'atsInsights', label: 'ATS Analysis Alerts', desc: 'AI improvement suggestions for resume.' },
                      { key: 'weeklyReport', label: 'Weekly Career Report', desc: 'Weekly activity and growth metrics.' },
                      { key: 'profileVisible', label: 'Talent Directory Visibility', desc: 'Let employers find your profile.' },
                      { key: 'autoMatch', label: 'Auto-Match Intelligence', desc: 'AI suggests you for high-score roles.' },
                    ].map((pref) => (
                      <div key={pref.key} className="flex items-center justify-between gap-4 py-1">
                        <div className="space-y-0.5">
                          <h4 className="text-[13px] font-bold text-slate-800 dark:text-slate-200">{pref.label}</h4>
                          <p className="text-[11px] font-medium text-slate-500">{pref.desc}</p>
                        </div>
                        <button 
                          onClick={() => handleToggle(pref.key)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ease-in-out focus:outline-none ${settings[pref.key] ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                        >
                          <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-slate-50 shadow ring-0 transition ease-in-out ${settings[pref.key] ? 'translate-x-4' : 'translate-x-0'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          )}
        </main>
      </div>

      {/* Save Button */}
      <div className="flex-shrink-0 flex justify-end pt-6">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-10 py-4 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-blue-700 shadow-[0_8px_20px_rgba(37,99,235,0.3)] transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
        >
          {saving ? 'Updating...' : 'Save All Changes'}
          {!saving && <span className="material-symbols-outlined text-sm">save</span>}
        </button>
      </div>
      </div>
    </div>
  );
};

export default Settings;



