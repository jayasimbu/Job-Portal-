import React from 'react';
import { Target, Info } from 'lucide-react';

const MatchScoreCard = ({ score, atsScore }) => {
  const getScoreColor = (s) => {
    if (s >= 80) return 'text-emerald-600';
    if (s >= 60) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getScoreBg = (s) => {
    if (s >= 80) return 'bg-emerald-50';
    if (s >= 60) return 'bg-amber-50';
    return 'bg-rose-50';
  };

  const getProgressColor = (s) => {
    if (s >= 80) return 'bg-emerald-500';
    if (s >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-300 p-6">
      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Target className="size-5 text-indigo-600" />
        JD Match Analysis
      </h3>

      <div className="flex flex-col items-center text-center">
        <div className={`relative size-40 rounded-full flex items-center justify-center border-8 border-slate-200 ${getScoreBg(score)} transition-all duration-500`}>
          <div className="flex flex-col items-center">
            <span className={`text-5xl font-black ${getScoreColor(score)}`}>{score}%</span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Match Score</span>
          </div>
          {/* Progress ring simulation */}
          <svg className="absolute inset-[-8px] size-[calc(100%+16px)] -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="46%"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray="289"
              strokeDashoffset={289 - (289 * score) / 100}
              className={`${getScoreColor(score).replace('text-', 'text-')} opacity-20`}
            />
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full mt-8">
          <div className="bg-slate-100 rounded-xl p-4 border border-slate-200">
            <p className="text-xs font-bold text-slate-500 uppercase mb-1">ATS Ready</p>
            <p className="text-xl font-bold text-slate-800">{atsScore}%</p>
            <div className="h-1.5 w-full bg-slate-200 rounded-full mt-2">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${atsScore}%` }} />
            </div>
          </div>
          <div className="bg-slate-100 rounded-xl p-4 border border-slate-200">
            <p className="text-xs font-bold text-slate-500 uppercase mb-1">Status</p>
            <p className={`text-lg font-bold ${getScoreColor(score)}`}>
              {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Weak'}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">Based on JD Match</p>
          </div>
        </div>

        <div className="mt-6 flex items-start gap-2 text-left bg-blue-50/50 p-3 rounded-lg border border-blue-100">
          <Info className="size-4 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 leading-relaxed">
            Your match score is calculated based on skill similarity between your resume and the job requirements.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MatchScoreCard;
