import React from 'react';

const EmptyState = ({ icon, title, description, actionText, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in duration-700">
      <div className="size-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <span className="material-symbols-outlined text-4xl text-slate-400">{icon || 'folder_open'}</span>
      </div>
      <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{title || 'No data found'}</h3>
      <p className="text-slate-500 max-w-xs mt-2 text-sm font-medium leading-relaxed">{description || 'There is nothing to show here yet.'}</p>
      
      {actionText && (
        <button 
          onClick={onAction}
          className="mt-8 h-12 px-8 bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2"
        >
          {actionText}
          <span className="material-symbols-outlined text-sm">trending_flat</span>
        </button>
      )}
    </div>
  );
};

export const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in duration-500">
    <div className="size-20 bg-red-50 dark:bg-red-900/10 rounded-full flex items-center justify-center mb-6 border border-red-100 dark:border-red-900/30">
      <span className="material-symbols-outlined text-4xl text-red-500">error</span>
    </div>
    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Something went wrong</h3>
    <p className="text-slate-500 max-w-xs mt-2 text-sm font-medium">{message || 'We encountered an error while fetching data.'}</p>
    <button 
      onClick={onRetry}
      className="mt-8 h-12 px-8 bg-red-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-red-700 shadow-lg shadow-red-500/20 transition-all active:scale-95 flex items-center gap-2"
    >
      <span className="material-symbols-outlined text-sm">refresh</span>
      Retry Connection
    </button>
  </div>
);

export default EmptyState;
