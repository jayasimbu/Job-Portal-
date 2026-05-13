import React from 'react';

export default function ATSScoreCard({ score = 0, sectionScores = {} }) {
  // Simple circular gauge math
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let scoreColor = 'text-green-500';
  let strokeColor = 'stroke-green-500';
  if (score < 50) {
    scoreColor = 'text-red-500';
    strokeColor = 'stroke-red-500';
  } else if (score < 75) {
    scoreColor = 'text-amber-500';
    strokeColor = 'stroke-amber-500';
  }

  const sections = Object.entries(sectionScores).map(([name, val]) => ({
    name,
    val,
  })) || [
    { name: 'Formatting', val: 90 },
    { name: 'Keywords', val: 75 },
    { name: 'Experience', val: 85 },
    { name: 'Education', val: 100 }
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-300 dark:border-slate-700 w-full">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">ATS Compatibility Score</h3>
      
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Gauge */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="transform -rotate-90 w-32 h-32">
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              className="text-slate-100 dark:text-slate-800"
            />
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={`${strokeColor} transition-all ease-out`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className={`text-4xl font-black ${scoreColor}`}>{score}</span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">/ 100</span>
          </div>
        </div>

        {/* Section Bars */}
        <div className="flex-1 w-full space-y-4">
          {sections.length === 0 && (
            <div className="text-sm text-slate-500">No detailed section scores available.</div>
          )}
          {sections.map((sec, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                <span>{sec.name}</span>
                <span>{sec.val}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${sec.val >= 80 ? 'bg-green-500' : sec.val >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: `${sec.val}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



