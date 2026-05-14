import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Building2, UserCircle, Save, CheckCircle2, X, Loader2 } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { createJobPosting } from '../services/employerService';
import { getCurrentUserId } from '../../../core/auth/session';

export default function PostJob() {
  const navigate = useNavigate();
  const employerId = getCurrentUserId();
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [form, setForm] = useState({
    // Basic Info
    title: '',
    department: '',
    category: '',
    location: '',
    // Job Details
    experienceLevel: 'Entry Level (0-2 years)',
    salary: '',
    employmentType: 'Full Time',
    workMode: 'Onsite',
    shiftTiming: 'Day Shift',
    bondPeriod: '0 Months',
    applicationDeadline: '',
    genderPreference: 'Any',
    jobDescription: '',
    // Candidate Preferences
    education: '',
    languages: '',
    preferredCriteria: '',
    skillsRequired: [],
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!form.skillsRequired.includes(skillInput.trim())) {
        setForm(prev => ({
          ...prev,
          skillsRequired: [...prev.skillsRequired, skillInput.trim()]
        }));
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setForm(prev => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter(s => s !== skillToRemove)
    }));
  };

  const mapExperienceToMin = (level) => {
    if (level.includes('0-2')) return 0;
    if (level.includes('3-5')) return 3;
    if (level.includes('5-8')) return 5;
    if (level.includes('8+')) return 8;
    return 0;
  };

  const mapExperienceToShort = (level) => {
    if (level.includes('Entry')) return 'Entry';
    if (level.includes('Mid')) return 'Mid';
    if (level.includes('Senior')) return 'Senior';
    if (level.includes('Expert')) return 'Senior';
    return 'Entry';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employerId) return;

    setLoading(true);
    setError(null);

    try {
      // Map frontend form to Backend JobPayload
      const payload = {
        employer_id: parseInt(employerId),
        title: form.title,
        description: form.jobDescription,
        required_skills: form.skillsRequired,
        experience_level: mapExperienceToShort(form.experienceLevel),
        min_experience: mapExperienceToMin(form.experienceLevel),
        salary: form.salary,
        education_required: form.education,
        location: form.location,
        job_type: form.employmentType
      };

      await createJobPosting(payload);
      navigate('/platform/employer/dashboard');
    } catch (err) {
      console.error('Failed to post job:', err);
      setError('Failed to publish job posting. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full h-11 bg-slate-100 border border-slate-300 rounded-lg px-3 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-600 outline-none transition-all";
  const labelCls = "text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 block";
  const sectionCls = "p-6 bg-slate-50 border border-slate-300 rounded-xl space-y-5 shadow-sm";

  return (
    <div className="max-w-[1000px] mx-auto space-y-6 pb-20">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">Post a Job</h1>
        <p className="text-sm text-slate-500 font-medium">Create a structured job posting to enable high-accuracy AI matching.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <section className={sectionCls}>
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
             <Briefcase size={18} className="text-blue-600" />
             <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Basic Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className={labelCls}>Job Title *</label>
              <input required name="title" value={form.title} onChange={handleChange} className={inputCls} placeholder="e.g. Senior React Developer" />
            </div>
            
            <div>
              <label className={labelCls}>Department</label>
              <input name="department" value={form.department} onChange={handleChange} className={inputCls} placeholder="e.g. Engineering" />
            </div>

            <div>
              <label className={labelCls}>Job Category *</label>
              <select required name="category" value={form.category} onChange={handleChange} className={inputCls}>
                 <option value="">Select Category</option>
                 <option value="Frontend">Frontend</option>
                 <option value="Backend">Backend</option>
                 <option value="Fullstack">Fullstack</option>
                 <option value="UI/UX">UI/UX</option>
                 <option value="AI/ML">AI/ML</option>
                 <option value="DevOps">DevOps</option>
                 <option value="Testing">Testing / QA</option>
                 <option value="Mobile">Mobile Development</option>
                 <option value="Data Science">Data Science</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className={labelCls}>Location</label>
              <input name="location" value={form.location} onChange={handleChange} className={inputCls} placeholder="e.g. New York, NY" />
            </div>
          </div>
        </section>

        {/* Job Details */}
        <section className={sectionCls}>
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
             <Building2 size={18} className="text-blue-600" />
             <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Job Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className={labelCls}>Employment Type</label>
              <select name="employmentType" value={form.employmentType} onChange={handleChange} className={inputCls}>
                 <option value="Full Time">Full Time</option>
                 <option value="Part Time">Part Time</option>
                 <option value="Contract">Contract</option>
                 <option value="Internship">Internship</option>
              </select>
            </div>
            
            <div>
              <label className={labelCls}>Work Mode</label>
              <select name="workMode" value={form.workMode} onChange={handleChange} className={inputCls}>
                 <option value="Remote">Remote</option>
                 <option value="Hybrid">Hybrid</option>
                 <option value="Onsite">Onsite</option>
              </select>
            </div>

            <div>
              <label className={labelCls}>Shift Timing</label>
              <select name="shiftTiming" value={form.shiftTiming} onChange={handleChange} className={inputCls}>
                 <option value="Day Shift">Day Shift</option>
                 <option value="Night Shift">Night Shift</option>
                 <option value="Flexible">Flexible</option>
                 <option value="Rotational">Rotational</option>
              </select>
            </div>

            <div>
              <label className={labelCls}>Experience Required</label>
              <select name="experienceLevel" value={form.experienceLevel} onChange={handleChange} className={inputCls}>
                 <option value="Entry Level (0-2 years)">Entry Level (0-2 years)</option>
                 <option value="Mid Level (3-5 years)">Mid Level (3-5 years)</option>
                 <option value="Senior Level (5-8 years)">Senior Level (5-8 years)</option>
                 <option value="Expert (8+ years)">Expert (8+ years)</option>
              </select>
            </div>

            <div>
              <label className={labelCls}>Salary Range</label>
              <input name="salary" value={form.salary} onChange={handleChange} className={inputCls} placeholder="e.g. $80,000 - $120,000" />
            </div>

            <div>
              <label className={labelCls}>Bond Period</label>
              <select name="bondPeriod" value={form.bondPeriod} onChange={handleChange} className={inputCls}>
                 <option value="0 Months">None (0 Months)</option>
                 <option value="6 Months">6 Months</option>
                 <option value="1 Year">1 Year</option>
                 <option value="2 Years">2 Years</option>
              </select>
            </div>

            <div>
              <label className={labelCls}>Gender Preference</label>
              <select name="genderPreference" value={form.genderPreference} onChange={handleChange} className={inputCls}>
                 <option value="Any">Any</option>
                 <option value="Male">Male</option>
                 <option value="Female">Female</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className={labelCls}>Application Deadline</label>
              <input name="applicationDeadline" type="date" value={form.applicationDeadline} onChange={handleChange} className={inputCls} />
            </div>

            <div className="md:col-span-3">
              <label className={labelCls}>Detailed Job Description *</label>
              <textarea 
                required
                name="jobDescription" 
                value={form.jobDescription} 
                onChange={handleChange} 
                rows={8} 
                className="w-full bg-slate-100 border border-slate-300 rounded-lg p-3 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-600 outline-none transition-all resize-y"
                placeholder="Provide a comprehensive job description, including responsibilities, day-to-day tasks, and team structure..."
              />
            </div>
          </div>
        </section>

        {/* Candidate Preferences */}
        <section className={sectionCls}>
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
             <UserCircle size={18} className="text-blue-600" />
             <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Candidate Preferences</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className={labelCls}>Required Skills (Press Enter to add)</label>
              <div className="space-y-3">
                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={addSkill}
                  className={inputCls}
                  placeholder="e.g. React, Node.js, Python"
                />
                <div className="flex flex-wrap gap-2">
                  {form.skillsRequired.map(skill => (
                    <div key={skill} className="flex items-center gap-1.5 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-300">
                      <span className="text-[11px] font-bold">{skill}</span>
                      <button type="button" onClick={() => removeSkill(skill)} className="hover:text-rose-600 transition-colors">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {form.skillsRequired.length === 0 && (
                    <span className="text-[11px] text-slate-400 italic">No skills added. Add required skills to enable ATS matching.</span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className={labelCls}>Minimum Education</label>
              <input name="education" value={form.education} onChange={handleChange} className={inputCls} placeholder="e.g. Bachelor's Degree in CS" />
            </div>

            <div>
              <label className={labelCls}>Required Languages</label>
              <input name="languages" value={form.languages} onChange={handleChange} className={inputCls} placeholder="e.g. English, Spanish" />
            </div>

            <div className="md:col-span-2">
              <label className={labelCls}>Preferred Candidate Criteria (Optional)</label>
              <textarea 
                name="preferredCriteria" 
                value={form.preferredCriteria} 
                onChange={handleChange} 
                rows={3} 
                className="w-full bg-slate-100 border border-slate-300 rounded-lg p-3 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-600 outline-none transition-all resize-none"
                placeholder="Any additional preferences (e.g. Local candidates preferred, immediate joiners only)..."
              />
            </div>
          </div>
        </section>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center gap-3">
             <X size={18} />
             <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={() => navigate('/platform/employer/dashboard')} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="px-8" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <CheckCircle2 size={16} className="mr-2" />
                Publish Job Post
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
