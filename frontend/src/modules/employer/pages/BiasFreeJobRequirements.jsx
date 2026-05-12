import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createJobPosting } from '../services/employerService';

const proficiencyLevels = [
  { id: 'foundational', label: 'Foundational', desc: 'Basic understanding, needs supervision.' },
  { id: 'proficient', label: 'Proficient', desc: 'Can work independently on core tasks.' },
  { id: 'advanced', label: 'Advanced', desc: 'Can lead projects and mentor others.' },
  { id: 'expert', label: 'Expert', desc: 'Thought leader, defines strategy.' },
];

const suggestions = ['Design Systems', 'Accessibility', 'UI Design', 'Motion Design', 'Information Architecture'];
const steps = ['Basic Info', 'Requirements', 'AI Bias Check', 'Publish'];

export default function BiasFreeJobRequirements() {
  const navigate = useNavigate();
  const location = useLocation();
  const basicInfo = location.state?.basicInfo || {};
  
  const [jobTitle, setJobTitle] = useState(basicInfo.title || 'Senior Product Designer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mustHaveSkills, setMustHaveSkills] = useState(['Figma', 'Prototyping', 'User Research']);
  const [niceToHaveSkills, setNiceToHaveSkills] = useState(['HTML/CSS']);
  const [proficiency, setProficiency] = useState('proficient');
  const [mustInput, setMustInput] = useState('');
  const [niceInput, setNiceInput] = useState('');

  const handleMustKeyDown = (e) => {
    if (e.key === 'Enter' && mustInput.trim()) {
      setMustHaveSkills((p) => [...p, mustInput.trim()]);
      setMustInput('');
    }
  };
  const handleNiceKeyDown = (e) => {
    if (e.key === 'Enter' && niceInput.trim()) {
      setNiceToHaveSkills((p) => [...p, niceInput.trim()]);
      setNiceInput('');
    }
  };
  const removeMust = (s) => setMustHaveSkills((p) => p.filter((x) => x !== s));
  const removeNice = (s) => setNiceToHaveSkills((p) => p.filter((x) => x !== s));
  const addSuggestion = (s) => {
    if (!mustHaveSkills.includes(s)) setMustHaveSkills((p) => [...p, s]);
  };

  const [toast, setToast] = useState(null);

  const publishJob = async () => {
    try {
      setLoading(true);
      setError('');
      
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (!user.id) {
        setError('You must be logged in to publish a job.');
        return;
      }
      
      const description = `This role requires proficiency at the **${proficiency}** level.\n\n### Requirements\n${mustHaveSkills.map((s) => `- ${s}`).join('\n')}\n\n### Bonus Skills\n${niceToHaveSkills.map((s) => `- ${s}`).join('\n')}`;
      
      const payload = {
         employer_id: user.id, 
         title: jobTitle,
         description: description,
         required_skills: [...mustHaveSkills, ...niceToHaveSkills],
         min_experience: 0, 
         location: basicInfo.location || 'Remote',
         employment_type: basicInfo.jobType || 'full_time',
      };
      
      await createJobPosting(payload);
      setToast({ text: '✔ Job published successfully!', type: 'success' });
      setTimeout(() => navigate('/platform/employer/dashboard'), 1500);
    } catch (err) {
      setToast({ text: '❌ Failed to publish job', type: 'error' });
      setError(err.response?.data?.detail || 'Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentStep = 1; // Requirements is step 2 (index 1)
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="h-full flex flex-col overflow-hidden duration-700">
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pb-4">
        <div className="flex flex-col w-full max-w-[1024px] mx-auto">
          
          {/* Header Section */}
          <div className="mb-8 w-full flex flex-col gap-4 mt-2">
            <div>
              <p className="text-[12px] font-black uppercase tracking-widest text-slate-400 mb-1">
                Step {currentStep + 1}: {steps[currentStep]}
              </p>
              <h1 className="text-[26px] font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight">
                Post A Job
              </h1>
            </div>

            {/* Progress & Stepper */}
            <div className="flex flex-col gap-3 mt-4">
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden shadow-inner">
                <div 
                  className="bg-purple-600 h-3 rounded-full transition-all ease-out relative overflow-hidden" 
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
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
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

          {error && (
            <div className="flex flex-col gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 text-red-600 dark:text-red-400 text-sm mb-6 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span>
                <span className="font-bold">{error}</span>
              </div>
              <button 
                onClick={publishJob}
                className="mt-2 w-fit px-4 py-1.5 bg-red-100 text-red-700 dark:bg-red-800/40 dark:text-red-300 font-bold text-xs rounded-lg hover:bg-red-200 dark:hover:bg-red-800/60 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {toast && (
            <div className={`p-4 rounded-2xl text-sm font-bold mb-6 shadow-sm flex items-center gap-2 ${
              toast.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400' : 
              'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
            }`}>
              <span className="material-symbols-outlined">
                {toast.type === 'error' ? 'error' : 'check_circle'}
              </span>
              {toast.text}
            </div>
          )}

          {/* Main Content Grid */}
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Form: 65% */}
            <div className="lg:w-[65%] flex flex-col gap-6">
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 flex flex-col gap-8">
                
                {/* Heading */}
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white uppercase mb-2">Define Role Requirements</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                    Focus on competencies to build a diverse team. Our AI will help you select skills that reduce bias.
                  </p>
                </div>

                {/* Job Title */}
                <div className="flex flex-col gap-2 relative">
                  <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between uppercase tracking-wider">
                    Job Title
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md lowercase">Used for AI suggestions</span>
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className="w-full rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 hover:border-purple-400 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-14 px-4 text-base font-medium transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-500 material-symbols-outlined cursor-pointer hover:scale-110 transition-transform" title="Regenerate suggestions">
                      auto_awesome
                    </span>
                  </div>
                </div>

                {/* Must-Have Skills */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Must-Have Skills <span className="text-red-500">*</span></label>
                    <button className="text-[10px] font-black uppercase tracking-widest text-purple-600 hover:text-purple-700 transition-colors">Import from template</button>
                  </div>
                  <div className="flex flex-wrap gap-2 p-4 min-h-[100px] bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus-within:ring-2 focus-within:ring-purple-500 hover:border-purple-400 transition-all">
                    {mustHaveSkills.map((skill) => (
                      <div key={skill} className="inline-flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">
                        {skill}
                        <button onClick={() => removeMust(skill)} className="text-slate-400 hover:text-red-500 transition-colors flex items-center">
                          <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                      </div>
                    ))}
                    <input
                      type="text"
                      value={mustInput}
                      onChange={(e) => setMustInput(e.target.value)}
                      onKeyDown={handleMustKeyDown}
                      className="bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-400 flex-1 min-w-[150px] py-1 text-sm font-medium"
                      placeholder="Type a skill and press Enter..."
                    />
                  </div>
                  {/* AI Suggestions */}
                  <div className="flex flex-wrap gap-2 items-center mt-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 flex items-center gap-1 bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded-md">
                      <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                      Suggested
                    </span>
                    {suggestions.filter((s) => !mustHaveSkills.includes(s)).slice(0, 4).map((s) => (
                      <button
                        key={s}
                        onClick={() => addSuggestion(s)}
                        className="text-[11px] font-bold bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/50 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 shadow-sm hover:shadow"
                      >
                        <span className="material-symbols-outlined text-[14px]">add</span>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nice-to-Have Skills */}
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Nice-to-Have Skills</label>
                  <div className="flex flex-wrap gap-2 p-4 min-h-[100px] bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus-within:ring-2 focus-within:ring-purple-500 hover:border-purple-400 transition-all">
                    {niceToHaveSkills.map((skill) => (
                      <div key={skill} className="inline-flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">
                        {skill}
                        <button onClick={() => removeNice(skill)} className="text-slate-400 hover:text-red-500 transition-colors flex items-center">
                          <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                      </div>
                    ))}
                    <input
                      type="text"
                      value={niceInput}
                      onChange={(e) => setNiceInput(e.target.value)}
                      onKeyDown={handleNiceKeyDown}
                      className="bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-400 flex-1 min-w-[150px] py-1 text-sm font-medium"
                      placeholder="Add optional skills..."
                    />
                  </div>
                </div>

                {/* Proficiency Level */}
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    Proficiency Level
                    <span className="material-symbols-outlined text-slate-400 text-[18px] cursor-help" title="We use competency-based levels instead of years of experience to reduce age bias.">info</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {proficiencyLevels.map((level) => {
                      const isSelected = proficiency === level.id;
                      return (
                        <label key={level.id} className="relative group cursor-pointer">
                          <input
                            type="radio"
                            name="proficiency"
                            value={level.id}
                            checked={isSelected}
                            onChange={() => setProficiency(level.id)}
                            className="sr-only"
                          />
                          <div className={`h-full p-5 rounded-2xl border transition-all flex flex-col gap-2 group-hover:scale-[1.02] ${
                            isSelected 
                              ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-500 ring-1 ring-purple-500 shadow-sm' 
                              : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:border-purple-400'
                          }`}>
                            <div className={`size-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-purple-600 bg-purple-600' : 'border-slate-300 dark:border-slate-600'}`}>
                              {isSelected && <div className="size-2 rounded-full bg-white"></div>}
                            </div>
                            <span className="font-bold text-slate-900 dark:text-white">{level.label}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{level.desc}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-800 my-2"></div>

                {/* Action Buttons */}
                <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
                  <button className="w-full sm:w-auto text-slate-500 dark:text-slate-400 text-xs uppercase tracking-widest font-black hover:text-slate-900 dark:hover:text-white transition-colors px-4 py-3">
                    Save Draft
                  </button>
                  <div className="flex w-full sm:w-auto gap-4">
                    <button
                      onClick={() => navigate(-1)}
                      className="flex-1 sm:flex-none text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700 rounded-xl px-8 py-3 text-sm font-black hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      Back
                    </button>
                    <button 
                      onClick={publishJob}
                      disabled={loading}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl py-3 px-10 bg-purple-600 text-white text-base font-black transition-all shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {loading ? <span className="material-symbols-outlined ">sync</span> : 'Publish Job'}
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Sidebar: Bias Check (35%) */}
            <div className="lg:w-[35%] flex flex-col gap-6">
              
              {/* Score Card */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 sticky top-4 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2 text-lg">
                    <span className="material-symbols-outlined text-purple-500">analytics</span>
                    Bias Check
                  </h3>
                  <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Good</span>
                </div>

                {/* Score Gauge */}
                <div className="flex items-center gap-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="relative size-20 shrink-0">
                    <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                      <path className="text-slate-200 dark:text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                      <path className="text-purple-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="85, 100" strokeWidth="3" />
                    </svg>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                      <span className="text-xl font-black text-slate-900 dark:text-white">85</span>
                      <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Score</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Your job post is inclusive.</p>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">Great job focusing on skills. A few minor tweaks could perfect it.</p>
                  </div>
                </div>

                {/* Alerts */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time Alerts</h4>
                  
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-900/50 rounded-2xl flex gap-3">
                    <span className="material-symbols-outlined text-orange-500 shrink-0 mt-0.5">warning</span>
                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        <span className="font-bold text-orange-600 dark:text-orange-400">"Energetic"</span> can imply age bias.
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs font-bold text-slate-500">Try:</span>
                        {['Proactive', 'Driven'].map((alt) => (
                          <button key={alt} className="text-[10px] font-black uppercase tracking-widest text-purple-600 bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-800/50 px-2 py-1 rounded-md shadow-sm hover:shadow hover:bg-purple-50 transition-all">{alt}</button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-900/30 rounded-2xl flex gap-3">
                    <span className="material-symbols-outlined text-purple-500 shrink-0 mt-0.5">lightbulb</span>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        60% of candidates for this role have <span className="font-bold">User Research</span> skills.
                      </p>
                      <button className="text-[10px] uppercase tracking-widest text-left text-purple-600 font-black mt-1 hover:text-purple-700 transition-colors">Add to Nice-to-haves</button>
                    </div>
                  </div>
                </div>

                {/* Focus Balance */}
                <div className="mt-2 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Focus Balance</h4>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                      <span>Hard Skills</span>
                      <span>Soft Skills</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                      <div className="h-full bg-blue-500 w-[70%]"></div>
                      <div className="h-full bg-purple-500 w-[30%]"></div>
                    </div>
                    <p className="text-[10px] font-medium text-slate-400 text-right mt-1">Currently heavy on technical competencies.</p>
                  </div>
                </div>
              </div>

              {/* Inclusive Hiring Guide CTA */}
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-purple-500/20 relative overflow-hidden group cursor-pointer hover:-translate-y-1 transition-all ">
                <div className="absolute -right-10 -top-10 bg-white/10 size-40 rounded-full blur-2xl group-hover:bg-white/20 transition-all "></div>
                <div className="relative z-10 flex flex-col gap-3">
                  <div className="size-12 bg-white/20 rounded-2xl flex items-center justify-center mb-1 backdrop-blur-md shadow-inner">
                    <span className="material-symbols-outlined text-white">menu_book</span>
                  </div>
                  <h3 className="font-black text-lg tracking-tight">Inclusive Hiring Guide</h3>
                  <p className="text-sm text-purple-100 font-medium leading-relaxed mb-1">Learn how to write descriptions that attract 2x more diverse candidates.</p>
                  <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all text-white">
                    Read Guide <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </span>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



