import React from 'react';
import { Search, Bell, User, Cpu, Shield, Command } from 'lucide-react';

const AdminTopbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-slate-50/60 dark:bg-[#080c10]/60 backdrop-blur-md border-b border-slate-300/50 dark:border-slate-700/50">
      <div className="max-w-[1600px] mx-auto w-full px-8 h-20 flex items-center justify-between">
        
        {/* Left: Command Search */}
        <div className="flex items-center gap-6">
           <div className="flex w-[420px] h-12 items-center gap-3 rounded-2xl bg-slate-100/50 dark:bg-slate-900/50 px-5 border border-slate-300/50 dark:border-slate-700/50 focus-within:border-blue-500 focus-within:bg-slate-50 dark:focus-within:bg-slate-900 transition-all shadow-sm group">
             <Search size={16} className="text-slate-400 group-focus-within:text-blue-600 transition-colors" />
             <input
               type="text"
               placeholder="Search platform..."
               className="bg-transparent text-[13px] font-medium text-slate-700 dark:text-slate-200 outline-none placeholder:text-slate-400 w-full"
             />
           </div>

        </div>

        {/* Right: Actions & Identity */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <button className="relative size-11 flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all border border-transparent hover:border-slate-300 dark:hover:border-slate-700 group">
              <Bell size={20} className="group-hover:rotate-12 transition-transform" />
              <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-rose-500 border-2 border-white dark:border-[#080c10]" />
            </button>
          </div>

          <div className="h-8 w-px bg-slate-100 dark:bg-slate-800" />

          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-slate-900 dark:text-white leading-none mb-1 group-hover:text-blue-600 transition-colors">Platform Admin</p>
              <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em]">Admin</p>
            </div>
            <div className="size-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
               <div className="w-full h-full rounded-[14px] bg-slate-50 dark:bg-[#080c10] flex items-center justify-center text-blue-600">
                  <User size={20} />
               </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;



