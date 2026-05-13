import React from 'react';
import { 
  User, 
  Mail, 
  Calendar, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles,
  Zap,
  Clock,
  Briefcase
} from 'lucide-react';
import SkillBadge from './SkillBadge';
import Button from '../ui/Button';

const CandidateCard = ({ 
  candidate = {}, 
  onShortlist = () => {},
  onViewDetails = () => {}
}) => {
  const {
    name = "Candidate Name",
    email = "candidate@example.com",
    experience = "0",
    ats_score = 0,
    match_score = 0,
    skills = [],
    missing_skills = [],
    status = "applied",
    avatar = null,
    applied_at = "2 days ago",
    ai_summary = ""
  } = candidate;

  // Semantic Ranking Badges
  const getRankBadge = () => {
    const score = match_score || ats_score;
    if (score >= 85) return (
      <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-200 dark:border-emerald-500/30">
        <Sparkles size={10} /> Top Match
      </div>
    );
    if (score >= 70) return (
      <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg text-[9px] font-black uppercase tracking-widest border border-blue-200 dark:border-blue-500/30">
        <Zap size={10} /> Strong Fit
      </div>
    );
    return null;
  };

  const score = Math.round(match_score || ats_score);

  return (
    <div className="group card-premium p-4 hover:border-primary/50 transition-all duration-300 flex flex-col lg:flex-row gap-6 items-start lg:items-center">
      
      {/* 1. Profile Core */}
      <div className="flex items-center gap-4 min-w-[240px]">
        <div className="size-12 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center font-black text-primary text-lg overflow-hidden shrink-0">
          {avatar ? <img src={avatar} alt={name} className="size-full object-cover" /> : name[0]}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-black text-gray-900 dark:text-white truncate">{name}</h3>
            {getRankBadge()}
          </div>
          <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
             <span className="flex items-center gap-1"><Briefcase size={10} /> {experience}y Exp</span>
             <span className="text-gray-200 dark:text-gray-800">•</span>
             <span className="flex items-center gap-1"><Clock size={10} /> {applied_at}</span>
          </div>
        </div>
      </div>

      {/* 2. Intelligence Metrics */}
      <div className="flex items-center gap-8 border-l border-gray-100 dark:border-gray-800 pl-8 h-10 hidden md:flex">
         <div className="flex flex-col items-center">
            <span className={`text-xl font-black tracking-tighter ${score >= 70 ? 'text-emerald-500' : score >= 40 ? 'text-amber-500' : 'text-rose-500'}`}>
              {score}%
            </span>
            <span className="text-[7px] font-black text-gray-400 uppercase tracking-[0.2em]">Match</span>
         </div>
         <div className="flex flex-col items-center">
            <span className="text-xl font-black tracking-tighter text-gray-900 dark:text-white">
              {Math.round(ats_score)}%
            </span>
            <span className="text-[7px] font-black text-gray-400 uppercase tracking-[0.2em]">ATS</span>
         </div>
      </div>

      {/* 3. Skill Overlap */}
      <div className="flex-grow min-w-0 space-y-2">
         <div className="flex flex-wrap gap-1.5">
            {skills.slice(0, 4).map(skill => (
              <SkillBadge key={skill} name={skill} type="primary" size="sm" />
            ))}
            {missing_skills.length > 0 && (
               <SkillBadge name={`Missing: ${missing_skills[0]}`} type="warning" size="sm" />
            )}
         </div>
         {ai_summary && (
           <p className="text-[10px] text-gray-400 font-medium italic truncate max-w-md">
             "AI: {ai_summary}"
           </p>
         )}
      </div>

      {/* 4. Action Layer */}
      <div className="flex items-center gap-2 shrink-0 w-full lg:w-auto">
        <Button 
          variant="secondary" 
          onClick={onViewDetails}
          className="flex-1 lg:flex-none h-9 px-4 rounded-xl text-[10px] uppercase font-black tracking-widest border-gray-200"
        >
          <ExternalLink size={14} className="mr-2" /> Details
        </Button>
        <Button 
          onClick={onShortlist}
          disabled={status === 'shortlisted'}
          className="flex-1 lg:flex-none h-9 px-5 rounded-xl text-[10px] uppercase font-black tracking-widest shadow-lg shadow-primary/10"
        >
          {status === 'shortlisted' ? <CheckCircle2 size={14} className="mr-2" /> : <Zap size={14} className="mr-2" />}
          {status === 'shortlisted' ? 'Shortlisted' : 'Shortlist'}
        </Button>
      </div>
    </div>
  );
};

export default CandidateCard;
