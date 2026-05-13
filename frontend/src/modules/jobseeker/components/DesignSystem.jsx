import React from 'react';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Card, { CardBody, CardHeader } from '../../../components/ui/Card';
import { Heading, Text } from '../../../components/ui/Typography';
import { MapPin, Building2, Zap } from 'lucide-react';

/**
 * Premium Stat Card for Dashboard
 */
export const StatCard = ({ label, value, icon: Icon, color = 'blue', suffix = '', trend = '' }) => {
  return (
    <Card className="border-slate-200">
      <CardBody className="p-6">
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
            {Icon && <Icon size={20} />}
          </div>
          <div>
            <Text variant="small" className="font-bold uppercase tracking-widest text-slate-400 leading-none mb-1">{label}</Text>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{value}{suffix}</span>
              {trend && <span className="text-[10px] font-bold text-emerald-600">{trend}</span>}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

/**
 * Premium Job Card for Marketplace
 */
export const JobCard = ({ job, onClick, onApply, isApplying }) => (
  <Card 
    onClick={onClick}
    className="group border-slate-200 cursor-pointer relative overflow-hidden bg-slate-50 dark:bg-slate-900 shadow-sm"
  >
    <CardBody className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="size-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-lg font-black text-blue-600 uppercase border border-slate-200 dark:border-slate-700">
            {(job.company || 'C')[0]}
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 leading-tight">
              {job.title}
            </h4>
            <div className="flex items-center gap-2 mt-1">
               <span className="text-xs font-bold text-slate-500">{job.company}</span>
               <span className="text-[10px] text-slate-300">•</span>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{job.location || 'Hybrid'}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-black text-blue-600">{job.match_score || 70}% Match</p>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Precision</p>
        </div>
      </div>

      <div className="space-y-3 pt-2 border-t border-slate-50 dark:border-slate-700">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
              <div className="size-1.5 bg-emerald-500 rounded-full" />
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium italic">
                Aligned with your {['React', 'Node.js', 'Tailwind'][Math.floor(Math.random() * 3)]} focus.
              </p>
           </div>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {Math.floor(Math.random() * 20) + 5} Applicants
           </span>
        </div>
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
              <div className="size-1.5 bg-amber-500 rounded-full" />
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                Missing: <span className="font-bold">Docker</span>
              </p>
           </div>
           <span className="text-[10px] font-bold text-slate-500">
              {Math.floor(Math.random() * 5) + 1}d ago
           </span>
        </div>
      </div>
      
      <Button 
        onClick={(e) => { e.stopPropagation(); onApply?.(); }}
        disabled={job.hasApplied || isApplying}
        variant={job.hasApplied ? 'secondary' : 'primary'}
        className="w-full h-10 rounded-xl text-xs font-bold"
      >
        {isApplying ? 'Processing...' : job.hasApplied ? 'Applied' : 'View Opportunity'}
      </Button>
    </CardBody>
  </Card>
);

/**
 * Premium Skill Chip
 */
export const SkillChip = ({ label, variant = 'primary' }) => (
  <Badge variant={variant} className="px-4 py-1.5 text-[11px] border-none shadow-sm">
    {label}
  </Badge>
);

/**
 * Premium Circular Progress for ATS Scores
 */
export const ATSCircle = ({ value, size = 128 }) => {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="size-full -rotate-90 drop-shadow-xl" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r={radius} fill="none" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="3" />
        <circle 
          cx="18" cy="18" r={radius} fill="none" 
          className="stroke-blue-600" 
          strokeWidth="3" 
          strokeDasharray={circumference} 
          strokeDashoffset={offset} 
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">{value}</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Score</span>
      </div>
    </div>
  );
};

/**
 * Premium Progress Bar
 */
export const ProgressBar = ({ value, label, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
    emerald: 'bg-emerald-600',
  };

  return (
    <div className="space-y-3 w-full">
      {label && (
        <div className="flex justify-between items-center">
          <Text variant="small" className="font-bold uppercase tracking-widest text-slate-500">{label}</Text>
          <Text variant="small" className="font-black text-slate-900 dark:text-white">{value}%</Text>
        </div>
      )}
      <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
        <div 
          className={`h-full ${colors[color]} rounded-full transition-all relative`} 
          style={{ width: `${value}%` }}
        >
          <div className="absolute inset-0 bg-slate-50/20 "></div>
        </div>
      </div>
    </div>
  );
};

/**
 * Premium Section Header
 */
export const SectionHeader = ({ title, icon: Icon, color = 'blue' }) => {
  const colors = {
    blue: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
    emerald: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20',
    amber: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20',
  };

  return (
    <div className="flex items-center gap-4">
      <div className={`size-12 ${colors[color]} rounded-2xl flex items-center justify-center border border-white/50 dark:border-white/5`}>
        {Icon && <Icon size={24} />}
      </div>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{title}</h3>
    </div>
  );
};

/**
 * Premium Filter Dropdown for Jobs
 */
export const FilterDropdown = ({ label, value, options, onChange, icon: Icon }) => {
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
        className={`h-14 px-6 rounded-2xl border flex items-center gap-4 transition-all bg-slate-50 dark:bg-slate-900 w-full
          ${isOpen ? 'border-blue-600 ring-4 ring-blue-50 dark:ring-blue-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-700'}
        `}
      >
        <div className={`${isOpen ? 'text-blue-600' : 'text-slate-400'}`}>
          {Icon && <Icon size={20} />}
        </div>
        <div className="text-left">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">{label}</p>
          <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[120px]">{value || 'Any'}</p>
        </div>
        <span className={`material-symbols-outlined text-slate-300 ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full min-w-[220px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-premium z-[100] p-2 duration-200">
          {options.map((opt, i) => {
            const val = typeof opt === 'string' ? opt : opt.value;
            const lbl = typeof opt === 'string' ? opt : opt.label;
            return (
              <button
                key={i}
                onClick={() => { onChange(val); setIsOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all
                  ${val === value ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}
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



