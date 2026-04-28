import React from 'react';

export default function ProjectAuthBadge({ score = 95, label = 'Verified Project', size = 'md' }) {
  let colorClass = 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/50';
  let icon = 'verified';

  if (score < 50) {
    colorClass = 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50';
    icon = 'warning';
  } else if (score < 80) {
    colorClass = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50';
    icon = 'info';
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-3 py-1 text-xs gap-1.5',
    lg: 'px-4 py-2 text-sm gap-2'
  };

  const iconSizes = {
    sm: '!text-[12px]',
    md: '!text-[16px]',
    lg: '!text-[20px]'
  };

  return (
    <div 
      className={`inline-flex items-center rounded-full border font-bold uppercase tracking-wider ${colorClass} ${sizes[size]} shadow-sm`}
      title={`Project Authenticity Score: ${score}/100. Analyzed commits, contributors, and repo history.`}
    >
      <span className={`material-symbols-outlined ${iconSizes[size]}`}>{icon}</span>
      <span>{label}</span>
      <span className="mx-1 opacity-50">•</span>
      <span>{score}/100</span>
    </div>
  );
}
