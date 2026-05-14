import React, { useState } from 'react';
import { X, User, Mail, Phone, MapPin, Link as LinkIcon, GitBranch, Globe, FileText, Save } from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function EditProfileModal({ isOpen, onClose, initialData, onSave }) {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    role: '',
    location: '',
    phone: '',
    about: '',
    socialLinks: { github: '', linkedin: '', portfolio: '' }
  });
  
  const [skillsText, setSkillsText] = useState((initialData?.skills || []).join(', '));
  const [experience, setExperience] = useState(initialData?.experience || []);

  if (!isOpen) return null;

  const handleAddExperience = () => {
    setExperience([{ role: '', company: '', period: '', desc: '' }, ...experience]);
  };

  const handleRemoveExperience = (index) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  const handleExperienceChange = (index, field, value) => {
    const updated = [...experience];
    updated[index] = { ...updated[index], [field]: value };
    setExperience(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      skills: skillsText.split(',').map(s => s.trim()).filter(Boolean),
      experience: experience
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-slate-50 dark:bg-slate-950 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-300 dark:border-slate-700 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <User className="text-blue-600" size={24} />
            Edit Professional Profile
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
          {/* Section: Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Enter full name"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Professional Headline</label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="e.g. Senior Frontend Developer"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="e.g. Chennai, India"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>
          </div>

          {/* Section: About */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">About / Bio</label>
            <textarea 
              rows={4}
              value={formData.about}
              onChange={(e) => setFormData({...formData, about: e.target.value})}
              className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
              placeholder="Tell us about your professional journey..."
            />
          </div>

          {/* Section: Skills */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Skills (Comma separated)</label>
            <textarea 
              rows={2}
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
              placeholder="e.g. React, Node.js, Python"
            />
          </div>

          {/* Section: Experience */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
               <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Experience</label>
               <Button type="button" onClick={handleAddExperience} variant="ghost" className="h-6 text-[10px] px-2 py-0 border border-blue-500/20 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                 + Add Role
               </Button>
            </div>
            {experience.map((exp, index) => (
              <div key={index} className="p-4 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl space-y-3 relative">
                 <button type="button" onClick={() => handleRemoveExperience(index)} className="absolute top-3 right-3 text-rose-500 hover:text-rose-600 bg-rose-50 dark:bg-rose-900/20 p-1 rounded-md">
                    <X size={14} />
                 </button>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    <input 
                      type="text" 
                      value={exp.role || exp.name || ''} 
                      onChange={(e) => handleExperienceChange(index, 'role', e.target.value)}
                      placeholder="Role (e.g. Frontend Developer)"
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <input 
                      type="text" 
                      value={exp.company || ''} 
                      onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                      placeholder="Company"
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <input 
                      type="text" 
                      value={exp.period || exp.date || ''} 
                      onChange={(e) => handleExperienceChange(index, 'period', e.target.value)}
                      placeholder="Period (e.g. 2021 - Present)"
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none md:col-span-2"
                    />
                    <textarea 
                      value={exp.desc || exp.description || ''} 
                      onChange={(e) => handleExperienceChange(index, 'desc', e.target.value)}
                      placeholder="Description"
                      rows={2}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none md:col-span-2 resize-none"
                    />
                 </div>
              </div>
            ))}
          </div>

          {/* Section: Social Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">GitHub URL</label>
              <div className="relative">
                <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  value={formData.socialLinks.github}
                  onChange={(e) => setFormData({...formData, socialLinks: {...formData.socialLinks, github: e.target.value}})}
                  className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="github.com/username"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Portfolio URL</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  value={formData.socialLinks.portfolio}
                  onChange={(e) => setFormData({...formData, socialLinks: {...formData.socialLinks, portfolio: e.target.value}})}
                  className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="yourportfolio.com"
                />
              </div>
            </div>
          </div>
        </form>

        <div className="p-6 bg-slate-100 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose} type="button">Cancel</Button>
          <Button onClick={handleSubmit} className="gap-2 shadow-lg shadow-blue-500/20">
            <Save size={18} /> Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
