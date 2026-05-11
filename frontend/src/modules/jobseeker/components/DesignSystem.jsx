import React from 'react';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Card, { CardBody, CardHeader } from '../../../components/ui/Card';
import { Heading, Text } from '../../../components/ui/Typography';

/**
 * Premium Stat Card for Dashboard
 */
export const StatCard = ({ label, value, color = 'text-blue-600', suffix = '' }) => (
  <div className="space-y-1">
    <Text variant="small" className="font-bold uppercase tracking-wider text-slate-500">{label}</Text>
    <div className={`text-4xl font-bold tracking-tight ${color}`}>
      {value}{suffix}
    </div>
  </div>
);

/**
 * Premium Job Card for Marketplace
 */
export const JobCard = ({ job, onClick, onApply, isApplying }) => (
  <Card 
    onClick={onClick}
    className="group hover:border-blue-500 transition-all cursor-pointer relative overflow-hidden"
  >
    <CardBody className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="size-14 bg-blue-50 rounded-xl flex items-center justify-center text-xl font-bold text-blue-600 uppercase border border-blue-100">
          {(job.company || 'C')[0]}
        </div>
        <Badge variant="primary">
          {job.match_score || 70}% Match
        </Badge>
      </div>

      <div className="space-y-1">
        <Heading level={4} className="group-hover:text-blue-600 transition-colors line-clamp-1">
          {job.title}
        </Heading>
        <Text variant="small" className="font-medium">{job.company}</Text>
        <div className="flex items-center gap-1.5 text-slate-400">
          <span className="material-symbols-outlined text-sm">location_on</span>
          <span className="text-xs font-medium uppercase tracking-wider">{job.location || 'Global'}</span>
        </div>
      </div>
      
      <Button 
        onClick={(e) => { e.stopPropagation(); onApply?.(); }}
        disabled={job.hasApplied || isApplying}
        variant={job.hasApplied ? 'secondary' : 'primary'}
        className="w-full"
      >
        {isApplying ? 'Processing...' : job.hasApplied ? 'Applied' : 'Quick Apply'}
      </Button>
    </CardBody>
  </Card>
);

/**
 * Premium Skill Chip
 */
export const SkillChip = ({ label, variant = 'primary' }) => (
  <Badge variant={variant} className="px-3 py-1 text-xs">
    {label}
  </Badge>
);

/**
 * Premium Circular Progress for ATS Scores
 */
export const ATSCircle = ({ value, size = 128 }) => (
  <div className="relative" style={{ width: size, height: size }}>
    <svg className="size-full -rotate-90" viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-100" strokeWidth="3" />
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
      <span className="text-xl font-bold text-slate-900">{value}%</span>
    </div>
  </div>
);

/**
 * Premium Progress Bar
 */
export const ProgressBar = ({ value, label }) => (
  <div className="space-y-2 w-full">
    {label && (
      <div className="flex justify-between items-center">
        <Text variant="small" className="font-bold uppercase tracking-wider">{label}</Text>
        <Text variant="small" className="font-bold">{value}%</Text>
      </div>
    )}
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
      <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: `${value}%` }} />
    </div>
  </div>
);

/**
 * Premium Section Header
 */
export const SectionHeader = ({ title, icon, iconColor = 'text-blue-600', bgColor = 'bg-blue-50' }) => (
  <div className="flex items-center gap-4">
    <div className={`size-12 ${bgColor} ${iconColor} rounded-2xl flex items-center justify-center shadow-sm`}>
      <span className="material-symbols-outlined text-2xl">{icon}</span>
    </div>
    <Heading level={3} className="text-slate-900">{title}</Heading>
  </div>
);

/**
 * Premium Filter Dropdown for Jobs
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
        className={`h-14 px-6 rounded-2xl border flex items-center gap-4 transition-all bg-white w-full
          ${isOpen ? 'border-blue-600 ring-4 ring-blue-50' : 'border-slate-200 hover:border-slate-300'}
        `}
      >
        <span className={`material-symbols-outlined text-xl ${isOpen ? 'text-blue-600' : 'text-slate-400'}`}>{icon}</span>
        <div className="text-left">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">{label}</p>
          <p className="text-sm font-bold text-slate-900 truncate max-w-[120px]">{value || 'Any'}</p>
        </div>
        <span className={`material-symbols-outlined text-slate-300 ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full min-w-[200px] bg-white border border-slate-100 rounded-2xl shadow-xl z-[100] p-2 animate-in fade-in slide-in-from-top-2 duration-200">
          {options.map((opt, i) => {
            const val = typeof opt === 'string' ? opt : opt.value;
            const lbl = typeof opt === 'string' ? opt : opt.label;
            return (
              <button
                key={i}
                onClick={() => { onChange(val); setIsOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all
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
