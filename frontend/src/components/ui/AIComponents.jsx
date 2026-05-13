import React from 'react';
import { Sparkles, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { Card } from './Card';

export const AISummaryCard = ({ summary, score, suggestions = [] }) => (
  <Card className="p-8 border-l-4 border-l-blue-600 bg-blue-50/30 dark:bg-blue-900/10 space-y-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="size-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
          <Sparkles size={20} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">AI Analysis Summary</h3>
      </div>
      {score && (
        <div className="text-right">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">ATS Match</p>
          <p className="text-3xl font-black text-blue-600 tracking-tighter">{score}%</p>
        </div>
      )}
    </div>

    <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
      {summary}
    </p>

    {suggestions.length > 0 && (
      <div className="space-y-3 pt-4 border-t border-blue-100 dark:border-blue-800">
        <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Key Suggestions</p>
        <div className="grid gap-2">
          {suggestions.map((s, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-blue-50 dark:border-blue-700/50">
              <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">{s}</p>
            </div>
          ))}
        </div>
      </div>
    )}
  </Card>
);

export const SkillBadge = ({ skill, level = 'intermediate', status = 'verified' }) => {
  const levels = {
    expert: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    advanced: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    intermediate: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    beginner: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105 ${levels[level]}`}>
      {skill}
      {status === 'verified' && <CheckCircle2 size={12} />}
    </div>
  );
};

export const CircularScore = ({ score, label, size = 'md' }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  const sizes = {
    sm: 'size-20 text-lg',
    md: 'size-32 text-2xl',
    lg: 'size-48 text-4xl',
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`relative ${sizes[size]} flex items-center justify-center`}>
        <svg className="size-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            className="stroke-slate-100 dark:stroke-slate-800 fill-none"
            strokeWidth="8"
          />
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            className="stroke-blue-600 fill-none transition-all ease-out"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-black tracking-tighter text-slate-900 dark:text-white">{score}%</span>
        </div>
      </div>
      {label && <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>}
    </div>
  );
};

export const MatchProgress = ({ score, label, color = 'blue' }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">{label}</span>
      <span className={`text-xs font-black ${score > 70 ? 'text-emerald-500' : 'text-blue-500'}`}>{score}%</span>
    </div>
    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
      <div 
        className={`h-full transition-all ease-out rounded-full bg-${color}-600`}
        style={{ width: `${score}%` }}
      />
    </div>
  </div>
);



