import React from 'react';

const SkillBadge = ({ name, type = 'default' }) => {
  const styles = {
    default: 'bg-gray-100 text-gray-600 border-gray-200',
    primary: 'bg-primary/10 text-primary border-primary/20',
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
  }[type];

  return (
    <span className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all hover:scale-105 cursor-default ${styles}`}>
      {name}
    </span>
  );
};

export default SkillBadge;
