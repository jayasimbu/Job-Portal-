import React from 'react';

export const Skeleton = ({ className = '', variant = 'rect' }) => {
  const base = "animate-shimmer bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 bg-[length:200%_100%]";
  
  const variants = {
    rect: "rounded-2xl",
    circle: "rounded-full",
    text: "h-4 w-full rounded-full",
  };

  return (
    <div className={`${base} ${variants[variant]} ${className}`} />
  );
};

export const CardSkeleton = () => (
  <div className="p-8 border border-slate-100 dark:border-slate-800 rounded-[2rem] bg-white dark:bg-slate-900 space-y-6">
    <div className="flex justify-between items-start">
      <Skeleton className="size-16" />
      <Skeleton className="w-24 h-8" />
    </div>
    <div className="space-y-3">
      <Skeleton className="w-3/4 h-8" />
      <Skeleton className="w-1/2 h-4" />
    </div>
    <Skeleton className="w-full h-12 mt-6" />
  </div>
);

export const StatSkeleton = () => (
  <div className="p-8 border border-slate-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 space-y-6">
    <div className="flex justify-between items-center">
      <Skeleton className="size-12" />
      <Skeleton className="w-16 h-6" />
    </div>
    <div className="space-y-2">
      <Skeleton className="w-20 h-10" />
      <Skeleton className="w-24 h-4" />
    </div>
  </div>
);



