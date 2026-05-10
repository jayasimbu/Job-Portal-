import React from 'react';
import { 
  Settings as SettingsIcon, 
  Shield, 
  Bell, 
  User,
  ChevronRight,
  Globe,
  Database,
  Lock,
  Cpu,
  Mail,
  Zap,
  Activity,
  ShieldCheck,
  RefreshCw,
  Power,
  Server
} from 'lucide-react';
import { motion } from 'framer-motion';
import { UI } from '../../../constants/ui';

const Settings = () => {
  const sections = [
    { title: 'Platform Core', desc: 'System environment, API endpoints, and global scaling parameters', icon: Database, color: 'blue', tag: 'Infrastructure' },
    { title: 'Security Protocol', desc: 'OAuth configurations, encryption keys, and session lifecycle', icon: Lock, color: 'rose', tag: 'Cyber-Sec' },
    { title: 'Event Triggers', desc: 'Webhook management, email templates, and real-time alerts', icon: Zap, color: 'amber', tag: 'Automation' },
    { title: 'Identity Matrix', desc: 'Role-based access controls and administrative permissions', icon: Shield, color: 'emerald', tag: 'Access Control' },
    { title: 'Neural Engine', desc: 'AI model selection, prompt tuning, and ingestion thresholds', icon: Cpu, color: 'violet', tag: 'Intelligence' },
    { title: 'Communication', desc: 'SMTP relay, push notification providers, and SMS gateways', icon: Mail, color: 'indigo', tag: 'Messaging' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-10"
    >
      
      {/* Header: Infrastructure Orchestration */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 bg-blue-600/10 border border-blue-600/20 rounded-full flex items-center gap-2">
                 <Server className="text-blue-600" size={14} />
                 <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Master Node Configuration</span>
              </div>
           </div>
           <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-4">Global Settings</h1>
           <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl text-lg">Orchestrate the platform's core logic, security frameworks, and administrative boundaries with precision.</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-white dark:bg-slate-900 px-8 py-4 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-6 group hover:shadow-xl hover:border-blue-500/30 transition-all">
              <div className="text-right">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">System Health</p>
                 <p className="text-2xl font-black text-emerald-500 mt-2">OPTIMAL</p>
              </div>
              <div className="w-px h-10 bg-slate-100 dark:bg-slate-800" />
              <div className="size-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 group-hover:animate-pulse">
                 <Activity size={24} />
              </div>
           </div>
        </div>
      </div>

      {/* Settings Matrix Orchestration */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sections.map((section, i) => (
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={i} 
            className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 hover:border-blue-500/50 transition-all text-left group relative overflow-hidden active:scale-95"
          >
            <div className="flex flex-col h-full relative z-10">
              <div className="flex items-center justify-between mb-8">
                 <div className={`size-16 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                   <section.icon size={28} className={`text-slate-400 group-hover:text-blue-600 transition-colors`} />
                 </div>
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-full border border-slate-100 dark:border-slate-700">{section.tag}</span>
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-3 group-hover:text-blue-600 transition-colors">{section.title}</h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed mb-10">{section.desc}</p>
              </div>

              <div className="flex items-center justify-between pt-8 border-t border-slate-50 dark:border-slate-800/50 mt-auto">
                 <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Configure Node</span>
                    <RefreshCw size={12} className="text-slate-300 group-hover:rotate-180 transition-transform duration-700" />
                 </div>
                 <div className="size-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 group-hover:text-blue-600 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 transition-all">
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                 </div>
              </div>
            </div>

            {/* Visual Depth Accents */}
            <div className={`absolute -bottom-12 -right-12 size-48 bg-blue-500/5 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        ))}
      </div>

      {/* Operational Infrastructure Footer */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-12 bg-slate-900 dark:bg-slate-950 rounded-[4rem] flex flex-col xl:flex-row items-center justify-between gap-10 overflow-hidden relative shadow-2xl shadow-slate-900/20"
      >
         <div className="relative z-10 text-center xl:text-left">
            <div className="flex items-center justify-center xl:justify-start gap-3 mb-4">
               <ShieldCheck className="text-blue-500" size={20} />
               <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">System Integrity: Secured</span>
            </div>
            <h4 className="text-white text-3xl font-black tracking-tighter leading-none mb-3">Enterprise Control Unit V4.2</h4>
            <p className="text-slate-400 text-xs font-semibold max-w-md">All operational modifications are logged in the immutable audit registry and synchronized across redundant master nodes.</p>
         </div>
         
         <div className="flex flex-wrap justify-center gap-5 relative z-10">
            <button className="h-14 px-10 bg-white text-slate-900 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95 flex items-center gap-3">
               <Database size={18} />
               Initialize Backup
            </button>
            <button className="h-14 px-10 bg-slate-800 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-rose-600 transition-all border border-slate-700 active:scale-95 flex items-center gap-3 group">
               <Power size={18} className="text-rose-500 group-hover:text-white transition-colors" />
               Critical Lockdown
            </button>
         </div>
         
         {/* Atmospheric Depth */}
         <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-600/10 to-transparent pointer-events-none" />
         <div className="absolute -bottom-24 -left-24 size-64 bg-violet-600/10 blur-[100px] rounded-full pointer-events-none" />
      </motion.div>
    </motion.div>
  );
};

export default Settings;
