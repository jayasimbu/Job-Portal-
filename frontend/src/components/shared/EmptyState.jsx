import React from 'react';
import { Search } from 'lucide-react';

const EmptyState = ({ 
  icon: Icon = Search, 
  title = "No results found", 
  description = "Try adjusting your filters or search terms to find what you're looking for.",
  action = null
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in zoom-in duration-500">
      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-lg">
        <Icon className="w-10 h-10 text-primary opacity-60" />
      </div>
      
      <h3 className="heading-md mb-2">{title}</h3>
      <p className="body-md text-gray-400 max-w-sm mx-auto mb-8">
        {description}
      </p>

      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
