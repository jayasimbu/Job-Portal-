import React from 'react';

/**
 * Premium Stat Card for Dashboard
 * @param {string} label - The label of the stat (e.g., "ATS SCORE")
 * @param {string|number} value - The value to display
 * @param {string} color - Text color for the value (default: text-slate-900)
 * @param {React.ReactNode} suffix - Optional suffix (e.g., "%")
 */
export const StatCard = ({ label, value, color = 'text-slate-900', suffix = '' }) => (
  <div className="space-y-1">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
    <h2 className={`text-4xl font-black tracking-tighter ${color}`}>
      {value}{suffix}
    </h2>
  </div>
);

/**
 * Premium Job Card for Marketplace
 * @param {Object} job - The job data object
 * @param {Function} onClick - Click handler for the card
 * @param {Function} onApply - Click handler for the apply button
 * @param {boolean} isApplying - Loading state for the apply button
 */
export const JobCard = ({ job, onClick, onApply, isApplying }) => (
  <div 
    onClick={onClick}
    className="group bg-white border border-slate-200 rounded-[2rem] p-8 space-y-8 shadow-sm hover:shadow-xl hover:border-blue-500 transition-all cursor-pointer relative overflow-hidden"
  >
    <div className="absolute top-6 right-6 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100">
      {job.match_score || 70.8}% Match
    </div>
    
    <div className="size-16 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl font-black text-slate-300 uppercase border border-slate-100">
      {(job.company || 'C')[0]}
    </div>

    <div className="space-y-2">
      <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors line-clamp-1">
        {job.title}
      </h4>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{job.company}</p>
      <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
        <span className="material-symbols-outlined text-xs">location_on</span>
        {job.location || 'Global'}
      </div>
    </div>
    
    <button 
      onClick={(e) => { e.stopPropagation(); onApply?.(); }}
      disabled={job.hasApplied || isApplying}
      className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl
        ${job.hasApplied 
          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-default shadow-none' 
          : 'bg-slate-900 text-white group-hover:bg-blue-600 shadow-slate-100 group-hover:shadow-blue-100'
        }
      `}
    >
      {isApplying ? 'Processing...' : job.hasApplied ? 'Application Sent' : 'Quick Apply'}
    </button>
  </div>
);

/**
 * Premium Skill Chip
 * @param {string} label - The skill name
 * @param {string} variant - 'success' | 'danger' | 'info'
 */
export const SkillChip = ({ label, variant = 'info' }) => {
  const styles = {
    success: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    danger: 'bg-rose-50 text-rose-600 border-rose-100',
    info: 'bg-blue-50 text-blue-600 border-blue-100'
  };
  return (
    <span className={`px-4 py-2 rounded-xl text-xs font-bold tracking-tight border ${styles[variant]} lowercase`}>
      {label}
    </span>
  );
};

/**
 * Premium Circular Progress for ATS Scores
 * @param {number} value - Percentage (0-100)
 * @param {number} size - Pixel size (default: 128)
 */
export const ATSCircle = ({ value, size = 128 }) => (
  <div className="relative" style={{ width: size, height: size }}>
    <svg className="size-full -rotate-90" viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-50" strokeWidth="3" />
      <circle 
        cx="18" cy="18" r="16" fill="none" 
        className="stroke-blue-600" 
        strokeWidth="3" 
        strokeDasharray="100" 
        strokeDashoffset={100 - value} 
        strokeLinecap="round"
      />
    </svg>
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="text-sm font-black text-slate-900">{value}%</span>
    </div>
  </div>
);

/**
 * Premium Progress Bar
 * @param {number} value - Percentage (0-100)
 * @param {string} label - Optional label
 */
export const ProgressBar = ({ value, label }) => (
  <div className="space-y-2 w-full">
    {label && (
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
    )}
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
      <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: `${value}%` }} />
    </div>
  </div>
);

/**
 * Premium Section Header
 * @param {string} title - The title
 * @param {string} icon - Material icon name
 * @param {string} iconColor - Icon text color (default: text-blue-600)
 * @param {string} bgColor - Icon background color (default: bg-blue-50)
 */
export const SectionHeader = ({ title, icon, iconColor = 'text-blue-600', bgColor = 'bg-blue-50' }) => (
  <div className="flex items-center gap-3">
    <div className={`size-10 ${bgColor} ${iconColor} rounded-xl flex items-center justify-center shadow-sm`}>
      <span className="material-symbols-outlined text-xl">{icon}</span>
    </div>
    <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">{title}</h3>
  </div>
);

/**
 * Premium Filter Dropdown for Jobs
 * @param {string} label - The label
 * @param {string} value - The current value
 * @param {Array} options - List of strings or {label, value} objects
 * @param {Function} onChange - Change handler
 * @param {string} icon - Material icon name
 */
export const FilterDropdown = ({ label, value, options, onChange, icon }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`h-14 px-6 rounded-2xl border flex items-center gap-4 transition-all bg-white
          ${isOpen ? 'border-blue-600 ring-4 ring-blue-50' : 'border-slate-200 hover:border-slate-300'}
        `}
      >
        <span className={`material-symbols-outlined text-xl ${isOpen ? 'text-blue-600' : 'text-slate-400'}`}>{icon}</span>
        <div className="text-left">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
          <p className="text-xs font-bold text-slate-900 truncate max-w-[120px]">{value || 'Any'}</p>
        </div>
        <span className={`material-symbols-outlined text-slate-300 ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full min-w-[200px] bg-white border border-slate-100 rounded-2xl shadow-2xl z-[100] p-2 animate-in fade-in slide-in-from-top-2 duration-200">
          {options.map((opt, i) => {
            const val = typeof opt === 'string' ? opt : opt.value;
            const lbl = typeof opt === 'string' ? opt : opt.label;
            return (
              <button
                key={i}
                onClick={() => { onChange(val); setIsOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all
                  ${val === value ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                {lbl}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
