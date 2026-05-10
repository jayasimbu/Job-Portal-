import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UI } from '../../../constants/ui';

const steps = ['Role Details', 'Requirements', 'Bias Analysis', 'Review'];

export default function PostJob() {
  const navigate = useNavigate();
  const [currentStep] = useState(0);
  const [form, setForm] = useState({
    title: '',
    department: '',
    location: '',
    jobType: 'Full-time',
    salaryMin: '',
    salaryMax: '',
    salaryPeriod: 'Yearly',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-20">
      {/* Header Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-sm">add_circle</span>
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Job Creation</span>
           </div>
           <div className="h-px flex-1 bg-slate-100" />
           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Step {currentStep + 1} of {steps.length}</div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
           <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-3">Post a New Position</h1>
              <p className="text-slate-500 font-bold text-sm max-w-2xl">Create a high-impact job posting using our AI-driven optimization engine.</p>
           </div>
           <div className="flex gap-2">
              {steps.map((_, i) => (
                 <div key={i} className={`h-1 rounded-full transition-all duration-300 ${currentStep >= i ? 'w-8 bg-blue-600' : 'w-4 bg-slate-100'}`} />
              ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-10 items-start">
        {/* Main Form */}
        <div className={UI.CARD_BASE + " space-y-12"}>
          
          {/* Basic Info */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
               <span className="material-symbols-outlined text-blue-600">business_center</span>
               <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Basic Information</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Position Title</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 group-focus-within:text-blue-600 transition-colors">title</span>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 text-sm font-bold outline-none focus:border-blue-600 transition-all text-slate-900 placeholder:text-slate-300"
                    placeholder="e.g. Senior Machine Learning Engineer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Department</label>
                  <input
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-4 text-sm font-bold outline-none focus:border-blue-600 transition-all text-slate-900 placeholder:text-slate-300"
                    placeholder="e.g. Engineering"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Location</label>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-4 text-sm font-bold outline-none focus:border-blue-600 transition-all text-slate-900 placeholder:text-slate-300"
                    placeholder="e.g. San Francisco, CA"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Employment Details */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
               <span className="material-symbols-outlined text-blue-600">layers</span>
               <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Employment Details</h2>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Job Type</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setForm(p => ({ ...p, jobType: type }))}
                      className={`h-12 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        form.jobType === type 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20' 
                          : 'bg-white border-slate-100 text-slate-400 hover:border-blue-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Compensation Range (Annual)</label>
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-sm">$</span>
                    <input
                      name="salaryMin"
                      type="number"
                      value={form.salaryMin}
                      onChange={handleChange}
                      className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-10 pr-4 text-sm font-bold outline-none focus:border-blue-600 transition-all text-slate-900"
                      placeholder="Min"
                    />
                  </div>
                  <div className="h-px w-4 bg-slate-200" />
                  <div className="flex-1 relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-sm">$</span>
                    <input
                      name="salaryMax"
                      type="number"
                      value={form.salaryMax}
                      onChange={handleChange}
                      className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-10 pr-4 text-sm font-bold outline-none focus:border-blue-600 transition-all text-slate-900"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer Actions */}
          <div className="pt-10 border-t border-slate-50 flex items-center justify-between">
            <button 
              onClick={() => navigate('/platform/employer/dashboard')}
              className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => navigate('/platform/employer/bias-free', { state: { basicInfo: form } })}
              className={UI.BTN_PRIMARY}
            >
              Next: Requirements
              <span className="material-symbols-outlined text-sm ml-2">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
           <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl" />
              <div className="relative z-10 space-y-6">
                 <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                    <span className="material-symbols-outlined text-blue-500">auto_awesome</span>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI Assistant</h3>
                 </div>
                 <p className="text-xs text-slate-400 font-bold leading-relaxed">
                    Our AI models will use these basic details to automatically generate optimized job requirements and identify potential bias in the next steps.
                 </p>
                 <div className="space-y-4 pt-4">
                    {[
                       'Auto-generate requirements',
                       'Instant bias detection',
                       'Top 1% candidate matching'
                    ].map(feature => (
                       <div key={feature} className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-emerald-500 text-sm">check_circle</span>
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">{feature}</span>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           <div className={UI.CARD_BASE + " p-6 flex items-center gap-4"}>
              <div className="size-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                 <span className="material-symbols-outlined text-xl">lightbulb</span>
              </div>
              <div>
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pro Tip</p>
                 <p className="text-[10px] font-bold text-slate-700 leading-tight">Specific titles perform 40% better.</p>
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
}
