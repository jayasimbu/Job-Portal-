import React from 'react';

export const Heading = ({ 
  level = 1, 
  children, 
  className = '', 
  ...props 
}) => {
  const Tag = `h${level}`;
  const sizes = {
    1: 'text-3xl font-bold tracking-tight text-slate-900 dark:text-white',
    2: 'text-xl font-semibold tracking-tight text-slate-900 dark:text-white',
    3: 'text-lg font-medium text-slate-900 dark:text-white',
    4: 'text-base font-medium text-slate-900 dark:text-white',
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
    body: 'text-sm text-slate-500 dark:text-slate-400 leading-relaxed',
    small: 'text-[10px] text-slate-400 uppercase tracking-widest',
    muted: 'text-sm text-slate-400',
    lead: 'text-base text-slate-600 dark:text-slate-300',
  };

  return (
    <p className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </p>
  );
};



