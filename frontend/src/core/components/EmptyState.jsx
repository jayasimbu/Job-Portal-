import React from 'react';
import { FolderOpen, AlertCircle, RefreshCw, MoveRight } from 'lucide-react';

const EmptyState = ({ icon: Icon = FolderOpen, title, description, actionText, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="size-20 bg-slate-100 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center mb-8 border border-slate-200 dark:border-slate-700 shadow-sm transition-transform hover:rotate-6">
        <Icon size={40} className="text-slate-300 dark:text-slate-600" />
      </div>
      <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none mb-3">
        {title || 'Information Void'}
      </h3>
      <p className="text-slate-400 max-w-[280px] text-[11px] font-bold uppercase tracking-widest leading-relaxed">
        {description || 'No data detected in this sector of the matrix.'}
      </p>
      
      {actionText && (
        <button 
          onClick={onAction}
          className="mt-10 h-12 px-8 bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-3 group"
        >
          {actionText}
          <MoveRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  );
};

export const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="size-20 bg-rose-50 dark:bg-rose-900/10 rounded-[2rem] flex items-center justify-center mb-8 border border-rose-100 dark:border-rose-900/30">
      <AlertCircle size={40} className="text-rose-500" />
    </div>
    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none mb-3">
      System Anomaly
    </h3>
    <p className="text-rose-400/70 max-w-[280px] text-[11px] font-bold uppercase tracking-widest leading-relaxed">
      {message || 'We encountered a critical error during data synthesis.'}
    </p>
    <button 
      onClick={onRetry}
      className="mt-10 h-12 px-8 bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-rose-700 shadow-lg shadow-rose-500/20 transition-all active:scale-95 flex items-center gap-3 group"
    >
      <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
      Retry Synthesis
    </button>
  </div>
);

export default EmptyState;



