import React from 'react';

export const Heading = ({ 
  level = 1, 
  children, 
  className = '', 
  ...props 
}) => {
  const Tag = `h${level}`;
  const sizes = {
    1: 'text-3xl font-bold tracking-tight text-slate-900',
    2: 'text-2xl font-bold tracking-tight text-slate-900',
    3: 'text-xl font-bold text-slate-900',
    4: 'text-lg font-semibold text-slate-900',
  };

  return (
    <Tag className={`${sizes[level]} ${className}`} {...props}>
      {children}
    </Tag>
  );
};

export const Text = ({ 
  variant = 'body', 
  children, 
  className = '', 
  ...props 
}) => {
  const variants = {
    body: 'text-base text-slate-600 leading-relaxed',
    small: 'text-sm text-slate-500',
    muted: 'text-sm text-slate-400',
    lead: 'text-lg text-slate-600',
  };

  return (
    <p className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </p>
  );
};
