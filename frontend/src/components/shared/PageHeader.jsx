import React from 'react';

const PageHeader = ({ 
  title, 
  subtitle, 
  action, 
  breadcrumbs = [] 
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div className="space-y-1">
        {breadcrumbs.length > 0 && (
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">
            {breadcrumbs.map((crumb, i) => (
              <React.Fragment key={crumb}>
                <span>{crumb}</span>
                {i < breadcrumbs.length - 1 && <span className="opacity-30">/</span>}
              </React.Fragment>
            ))}
          </div>
        )}
        <h1 className="heading-xl text-dark tracking-tight-extreme">{title}</h1>
        {subtitle && <p className="body-md text-gray-500 max-w-2xl">{subtitle}</p>}
      </div>

      {action && (
        <div className="flex items-center gap-3">
          {action}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
