import React from 'react';

const SectionTitle = ({ 
  title, 
  description, 
  action = null,
  className = "" 
}) => {
  return (
    <div className={`flex items-end justify-between mb-6 ${className}`}>
      <div className="space-y-1">
        <h2 className="heading-md text-dark tracking-tight">{title}</h2>
        {description && <p className="body-sm text-gray-500">{description}</p>}
      </div>
      
      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </div>
  );
};

export default SectionTitle;
