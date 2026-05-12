import React from 'react';

export default function SystemStatus() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center py-20 px-6">
      <div className="max-w-2xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="size-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-green-600 text-3xl">check_circle</span>
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">System Status</h1>
            <p className="text-green-600 dark:text-green-400 font-bold tracking-widest text-sm uppercase mt-1">All systems operational</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-slate-400">api</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">API Gateway</span>
            </div>
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-black rounded-full uppercase">Active</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-slate-400">memory</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">AI Engine</span>
            </div>
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-black rounded-full uppercase">Running</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-slate-400">storage</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">Database</span>
            </div>
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-black rounded-full uppercase">Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
}



