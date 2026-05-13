import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Building2, 
  UserCircle, 
  Save, 
  CheckCircle2, 
  X,
  Target,
  Sparkles,
  Zap,
  DollarSign,
  MapPin,
  Clock,
  Plus
} from 'lucide-react';
import { useToast } from '../../../core/context/ToastContext';
import apiClient from '../../../core/api/apiClient';

// Shared Components
import PageHeader from '../../../components/shared/PageHeader';
import SectionTitle from '../../../components/shared/SectionTitle';
import SkillBadge from '../../../components/shared/SkillBadge';
import Button from '../../../components/ui/Button';

export default function PostJob() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [skillInput, setSkillInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [form, setForm] = useState({
    title: '',
    department: '',
    category: 'Engineering',
    location: '',
    experienceLevel: 'Entry Level (0-2 years)',
    salary: '',
    employmentType: 'Full Time',
    workMode: 'Onsite',
    shiftTiming: 'Day Shift',
    bondPeriod: '0 Months',
    deadline: '',
    description: '',
    education: '',
    requiredSkills: [],
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!form.requiredSkills.includes(skillInput.trim())) {
        setForm(prev => ({
          ...prev,
          requiredSkills: [...prev.requiredSkills, skillInput.trim()]
        }));
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setForm(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(s => s !== skillToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.requiredSkills.length === 0) {
      showToast("Please add at least one required skill for AI matching.", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      // In a real production scenario, we'd call the API here.
      // For the demo, we simulate success.
      showToast("Job Posting Published Successfully! AI is now ranking candidates.");
      navigate('/platform/employer/dashboard');
    } catch (err) {
      showToast("Failed to publish job.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = "w-full h-12 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl px-4 body-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all";
  const labelCls = "text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1";

  return (
    <div className="space-y-8 pt-4 pb-20 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader 
        title="Post New Opportunity" 
        subtitle="Create a structured job posting to enable precision AI matching."
        breadcrumbs={["Platform", "Employer", "Post Job"]}
      />

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Intent */}
        <div className="card-premium p-8 space-y-6">
          <SectionTitle 
            title="Core Information" 
            description="Define the fundamental aspects of the role."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className={labelCls}>Professional Job Title *</label>
              <div className="relative">
                 <Briefcase size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                 <input required name="title" value={form.title} onChange={handleChange} className={`${inputCls} pl-11`} placeholder="e.g. Senior AI Systems Engineer" />
              </div>
            </div>
            
            <div>
              <label className={labelCls}>Job Category</label>
              <select name="category" value={form.category} onChange={handleChange} className={inputCls}>
                 <option>Engineering</option>
                 <option>Product</option>
                 <option>Design</option>
                 <option>Marketing</option>
                 <option>Sales</option>
                 <option>Operations</option>
              </select>
            </div>

            <div>
              <label className={labelCls}>Location / Work Mode</label>
              <div className="relative">
                 <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                 <input name="location" value={form.location} onChange={handleChange} className={`${inputCls} pl-11`} placeholder="e.g. Remote or Chennai, India" />
              </div>
            </div>
          </div>
        </div>

        {/* Technical Requirements */}
        <div className="card-premium p-8 space-y-6 border-l-4 border-l-primary">
          <SectionTitle 
            title="AI Matching Keywords" 
            description="These skills directly influence candidate ranking accuracy."
          />
          
          <div className="space-y-4">
            <label className={labelCls}>Required Skills (Press Enter to add)</label>
            <div className="relative">
               <Target size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
               <input
                 value={skillInput}
                 onChange={(e) => setSkillInput(e.target.value)}
                 onKeyDown={addSkill}
                 className={`${inputCls} pl-11`}
                 placeholder="Add skills like React, Python, AWS..."
               />
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {form.requiredSkills.map(skill => (
                <div key={skill} className="flex items-center gap-1.5 bg-primary/5 text-primary px-3 py-1.5 rounded-xl border border-primary/10 transition-all hover:scale-105">
                  <span className="text-[11px] font-black uppercase tracking-wider">{skill}</span>
                  <button type="button" onClick={() => removeSkill(skill)} className="hover:text-danger transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ))}
              {form.requiredSkills.length === 0 && (
                <div className="flex items-center gap-2 p-4 bg-gray-50 dark:bg-gray-900 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl w-full">
                   <Sparkles className="text-gray-300" size={16} />
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">No skills added yet. AI matching is disabled.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Extended Details */}
        <div className="card-premium p-8 space-y-6">
          <SectionTitle 
            title="Offer & Constraints" 
            description="Specify compensation, experience, and deadlines."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={labelCls}>Compensation</label>
              <div className="relative">
                 <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                 <input name="salary" value={form.salary} onChange={handleChange} className={`${inputCls} pl-11`} placeholder="e.g. ₹12L - ₹18L" />
              </div>
            </div>

            <div>
              <label className={labelCls}>Experience Level</label>
              <select name="experienceLevel" value={form.experienceLevel} onChange={handleChange} className={inputCls}>
                 <option>Entry (0-2 years)</option>
                 <option>Mid (3-5 years)</option>
                 <option>Senior (5-8 years)</option>
                 <option>Expert (8+ years)</option>
              </select>
            </div>

            <div>
              <label className={labelCls}>Deadline</label>
              <input name="deadline" type="date" value={form.deadline} onChange={handleChange} className={inputCls} />
            </div>
          </div>

          <div className="space-y-4 pt-4">
             <label className={labelCls}>Job Description & Mission *</label>
             <textarea 
               required
               name="description" 
               value={form.description} 
               onChange={handleChange} 
               rows={8} 
               className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 body-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
               placeholder="Detail the role responsibilities, mission, and day-to-day impact..."
             />
          </div>
        </div>

        {/* Final Submission */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
             <CheckCircle2 size={16} className="text-emerald-500" />
             Draft autosaved
          </div>
          <div className="flex gap-4">
             <Button type="button" variant="ghost" onClick={() => navigate(-1)} className="rounded-xl px-8">
               Discard
             </Button>
             <Button 
               type="submit" 
               disabled={isSubmitting}
               className="px-12 rounded-2xl h-12 shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
             >
               {isSubmitting ? 'Publishing...' : 'Publish Job Posting'}
             </Button>
          </div>
        </div>

      </form>
    </div>
  );
}
