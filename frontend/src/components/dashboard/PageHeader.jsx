import React from 'react';

export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>
        {subtitle && (
          <p className="text-slate-500 text-base mt-1">
            {subtitle}
          </p>
        )}
      </div>
      
      {actions && (
        <div className="flex items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}



