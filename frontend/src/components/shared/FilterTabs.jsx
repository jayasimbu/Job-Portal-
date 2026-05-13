import React from 'react';

const FilterTabs = ({ 
  tabs = [], 
  activeTab, 
  onChange = () => {},
  className = "" 
}) => {
  return (
    <div className={`flex items-center gap-1 p-1 bg-gray-100 rounded-2xl w-fit ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all
              ${isActive 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-gray-500 hover:text-dark hover:bg-white/50'
              }
            `}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={`
                px-1.5 py-0.5 rounded-md text-[10px]
                ${isActive ? 'bg-primary/10 text-primary' : 'bg-gray-200 text-gray-500'}
              `}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default FilterTabs;
