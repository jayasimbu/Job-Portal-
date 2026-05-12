import React from 'react';

const Shimmer = ({ className, width, height, rounded = 'rounded-2xl' }) => {
  return (
    <div 
      className={`shimmer ${rounded} ${className}`} 
      style={{ width, height }}
    />
  );
};

export const ShimmerCard = () => (
  <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] space-y-6">
    <div className="flex justify-between items-start">
      <Shimmer width="56px" height="56px" />
      <Shimmer width="80px" height="24px" rounded="rounded-full" />
    </div>
    <div className="space-y-3">
      <Shimmer width="40%" height="32px" />
      <Shimmer width="60%" height="16px" />
    </div>
  </div>
);

export const ShimmerList = () => (
  <div className="space-y-4 w-full">
    {[1, 2, 3].map(i => (
      <div key={i} className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] flex items-center justify-between gap-6">
        <div className="flex items-center gap-6 flex-1">
          <Shimmer width="56px" height="56px" />
          <div className="space-y-2 flex-1">
            <Shimmer width="30%" height="20px" />
            <Shimmer width="50%" height="14px" />
          </div>
        </div>
        <Shimmer width="100px" height="40px" />
      </div>
    ))}
  </div>
);

export default Shimmer;



