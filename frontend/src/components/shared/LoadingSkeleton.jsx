import React from 'react';

const LoadingSkeleton = ({ type = 'card', count = 1 }) => {
  const skeletons = Array(count).fill(0);

  const CardSkeleton = () => (
    <div className="card-premium p-6 space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gray-100 animate-pulse" />
        <div className="space-y-2 flex-grow">
          <div className="h-4 w-1/3 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-3 w-1/4 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-3 w-5/6 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    </div>
  );

  const TableSkeleton = () => (
    <div className="w-full space-y-4">
      {skeletons.map((_, i) => (
        <div key={i} className="flex gap-4 p-4 border-b border-gray-100">
          <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
          <div className="h-4 w-1/4 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-4 w-1/4 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-4 w-1/4 bg-gray-100 rounded-lg animate-pulse ml-auto" />
        </div>
      ))}
    </div>
  );

  const StatsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {skeletons.map((_, i) => (
        <div key={i} className="card-premium p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 animate-pulse" />
          <div className="h-3 w-1/2 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-6 w-3/4 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      ))}
    </div>
  );

  if (type === 'table') return <TableSkeleton />;
  if (type === 'stats') return <StatsSkeleton />;
  
  return (
    <div className="space-y-4">
      {skeletons.map((_, i) => <CardSkeleton key={i} />)}
    </div>
  );
};

export default LoadingSkeleton;
