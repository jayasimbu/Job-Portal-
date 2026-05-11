import React from 'react';

export const Card = ({ children, className = '', ...props }) => (
  <div 
    className={`bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ children, className = '' }) => (
  <div className={`p-6 border-b border-slate-100 ${className}`}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`p-6 border-t border-slate-100 bg-slate-50/50 ${className}`}>
    {children}
  </div>
);

export default Card;
