import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const steps = ['Basic Info', 'Requirements', 'AI Bias Check', 'Publish'];

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
    <div className="h-full flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pb-4">
        <div className="flex flex-col w-full max-w-[1024px] mx-auto">
          
          {/* Header Section */}
          <div className="mb-8 w-full flex flex-col gap-4 mt-2">
            <div>
              <p className="text-[12px] font-black uppercase tracking-widest text-slate-400 mb-1">
                Step {currentStep + 1}: {steps[currentStep] === 'Basic Info' ? 'Basic Information' : steps[currentStep]}
              </p>
              <h1 className="text-[26px] font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight">
                Post A Job
              </h1>
            </div>

            {/* Progress & Stepper */}
            <div className="flex flex-col gap-3 mt-4">
              {/* Progress Bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden shadow-inner">
                <div 
                  className="bg-purple-600 h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden" 
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>

              {/* Stepper Navigation */}
              <div className="flex justify-between items-center mt-2 px-1 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-slate-200 dark:bg-slate-700 -z-10"></div>
                {steps.map((step, i) => {
                  const isActive = i === currentStep;
                  const isPast = i < currentStep;
                  return (
                    <div key={step} className="flex flex-col items-center gap-2 bg-slate-50 dark:bg-[#0d141b] px-2">
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 ${
                          isActive 
                            ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)] scale-110 ring-4 ring-purple-100 dark:ring-purple-900/30' 
                            : isPast 
                              ? 'bg-purple-200 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300' 
                              : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {isPast ? <span className="material-symbols-outlined text-[16px]">check</span> : i + 1}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-wider ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400'}`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Form: 65% */}
            <div className="lg:w-[65%] flex flex-col gap-6">
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 flex flex-col gap-6">
                
                {/* Job Title */}
                <div className="flex flex-col gap-2 relative">
                  <label className="flex items-center gap-2 text-slate-900 dark:text-white text-sm font-bold uppercase tracking-wider">
                    Job Title <span className="text-red-500">*</span>
                    <span className="material-symbols-outlined text-purple-500 text-base" title="AI Auto-complete enabled">auto_awesome</span>
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 hover:border-purple-400 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-14 placeholder:text-slate-400 px-4 text-base font-medium transition-all"
                    placeholder="e.g. Senior Machine Learning Engineer"
                    required
                  />
                </div>

                {/* Department & Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-wider">Department</label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined group-focus-within:text-purple-500 transition-colors">group</span>
                      <input
                        name="department"
                        value={form.department}
                        onChange={handleChange}
                        className="w-full rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 hover:border-purple-400 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-14 placeholder:text-slate-400 pl-12 pr-4 text-base font-medium transition-all"
                        placeholder="e.g. Engineering"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-wider">Location</label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined group-focus-within:text-purple-500 transition-colors">location_on</span>
                      <input
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        className="w-full rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 hover:border-purple-400 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-14 placeholder:text-slate-400 pl-12 pr-4 text-base font-medium transition-all"
                        placeholder="e.g. San Francisco or Remote"
                      />
                    </div>
                  </div>
                </div>

                {/* Employment Type */}
                <div className="flex flex-col gap-3">
                  <label className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-wider">Employment Type</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => {
                      const isSelected = form.jobType === type;
                      return (
                        <label key={type} className="cursor-pointer group">
                          <input
                            type="radio"
                            name="jobType"
                            value={type}
                            checked={isSelected}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <div 
                            className={`rounded-xl border p-3 text-center transition-all duration-200 group-hover:scale-[1.03] ${
                              isSelected 
                                ? 'bg-purple-600 border-purple-600 text-white shadow-md' 
                                : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-purple-400'
                            }`}
                          >
                            <span className="text-[13px] font-bold">{type}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Salary Range */}
                <div className="flex flex-col gap-2">
                  <label className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-wider flex items-center justify-between">
                    <span>Salary Range</span>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md" title="Sharing a salary range increases applicant trust">Optional</span>
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative flex-1 w-full group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold group-focus-within:text-purple-500 transition-colors">$</span>
                      <input
                        name="salaryMin"
                        type="number"
                        value={form.salaryMin}
                        onChange={handleChange}
                        className="w-full rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 hover:border-purple-400 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-14 placeholder:text-slate-400 pl-8 pr-4 text-base font-medium transition-all"
                        placeholder="Min"
                      />
                    </div>
                    <span className="hidden sm:block text-slate-400 font-bold">-</span>
                    <div className="relative flex-1 w-full group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold group-focus-within:text-purple-500 transition-colors">$</span>
                      <input
                        name="salaryMax"
                        type="number"
                        value={form.salaryMax}
                        onChange={handleChange}
                        className="w-full rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 hover:border-purple-400 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-14 placeholder:text-slate-400 pl-8 pr-4 text-base font-medium transition-all"
                        placeholder="Max"
                      />
                    </div>
                    <div className="w-full sm:w-32 group">
                      <select
                        name="salaryPeriod"
                        value={form.salaryPeriod}
                        onChange={handleChange}
                        className="w-full rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 hover:border-purple-400 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-14 px-4 text-base font-medium cursor-pointer transition-all"
                      >
                        <option>Yearly</option>
                        <option>Monthly</option>
                        <option>Hourly</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-800 my-4"></div>

                {/* Action Buttons */}
                <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
                  <button
                    onClick={() => navigate('/platform/employer/dashboard')}
                    className="w-full sm:w-auto text-slate-500 dark:text-slate-400 text-xs uppercase tracking-widest font-black hover:text-red-500 dark:hover:text-red-400 transition-colors px-4 py-3 text-center"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => navigate('/platform/employer/bias-free', { state: { basicInfo: form } })}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl py-3 px-12 bg-purple-600 text-white text-base font-black transition-all shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5 active:scale-95"
                  >
                    <span>Next: Requirements</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Panel: AI Assistant (35%) */}
            <div className="lg:w-[35%] flex flex-col gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-3xl p-6 border border-purple-100 dark:border-slate-700 sticky top-4 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                {/* Glow Effect */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/20 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-purple-400/30 transition-colors"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-xl shadow-sm text-purple-600 dark:text-purple-400">
                      <span className="material-symbols-outlined text-xl animate-pulse">auto_awesome</span>
                    </div>
                    <h3 className="font-black text-slate-900 dark:text-white tracking-tight uppercase text-lg">AI Assistant</h3>
                  </div>
                  
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                    Providing accurate basic information helps our AI models to:
                  </p>
                  
                  <ul className="space-y-4">
                    {[
                      'Auto-generate detailed job requirements in the next step.',
                      'Identify potential bias in your wording early on.',
                      'Match with the top 10% of candidates instantly.',
                    ].map((tip) => (
                      <li key={tip} className="flex items-start gap-3 bg-white/50 dark:bg-slate-800/50 p-3 rounded-xl border border-white dark:border-slate-700/50 shadow-sm">
                        <span className="material-symbols-outlined text-green-500 text-lg mt-0.5 shrink-0">check_circle</span>
                        <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{tip}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-6 p-4 bg-purple-100/50 dark:bg-purple-900/20 rounded-xl border border-purple-200/50 dark:border-purple-800/50 flex gap-3">
                    <span className="material-symbols-outlined text-purple-600 dark:text-purple-400 shrink-0">tips_and_updates</span>
                    <p className="text-xs font-bold text-purple-800 dark:text-purple-300 leading-relaxed">
                      Tip: Be specific with the job title. "Senior Full Stack Engineer" performs 40% better than just "Developer".
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
