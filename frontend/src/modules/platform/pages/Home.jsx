import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../core/context/ThemeContext';
import { getCurrentUser } from '../../../core/auth/session';
import { UI } from '../../../constants/ui';
import logo from '../../../assets/logos/linkup_logo.png';

const HERO_BG = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop';

const Home = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const user = getCurrentUser();
  const isAuthenticated = !!user;

  const dashboardPath = user?.role === 'employer' 
    ? '/platform/employer/dashboard' 
    : user?.role === 'admin' 
      ? '/platform/admin/dashboard' 
      : '/platform/jobseeker/dashboard';

  const goToApp = () => navigate(isAuthenticated ? dashboardPath : '/auth/login');

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d141b] text-slate-700 dark:text-slate-300 font-sans selection:bg-blue-600/10 selection:text-blue-600">
      
      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6 lg:px-20 overflow-hidden">
         {/* Elegant Background Decor */}
         <div className="absolute top-0 right-0 w-[40%] h-full bg-slate-50/50 dark:bg-slate-900/10 -skew-x-6 translate-x-20 z-0" />
         <div className="absolute top-40 left-20 size-[500px] bg-blue-600/5 rounded-full blur-[120px] animate-pulse z-0" />
         
         <div className="max-w-[1400px] mx-auto relative z-10">
            <div className="max-w-4xl space-y-10">
               <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-2xl shadow-sm">
                  <span className="material-symbols-outlined text-blue-600 text-[18px]">auto_awesome</span>
                  <span className="text-sm font-semibold text-blue-600 tracking-tight">Intelligence-Driven Career Platform</span>
               </div>
               
               <h1 className="text-7xl lg:text-[100px] font-semibold text-slate-900 dark:text-white leading-[0.95] tracking-tight">
                  Design your <br/>
                  <span className="text-blue-600 font-serif italic">Future</span> <br/>
                  with clarity.
               </h1>
               
               <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-relaxed">
                  LINKUP bridges the gap between high-impact talent and innovative companies through precision neural matching.
               </p>
               
               <div className="flex flex-wrap items-center gap-6 pt-6">
                  <button onClick={goToApp} className="h-16 px-10 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-semibold text-base shadow-2xl shadow-slate-900/20 dark:shadow-blue-600/20 hover:-translate-y-1 transition-all active:scale-95">
                     Explore Opportunities
                  </button>
                  <button className="flex items-center gap-3 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all group">
                     See how it works
                     <span className="material-symbols-outlined text-blue-600 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
               </div>

               <div className="pt-20 flex gap-16 border-t border-slate-100 dark:border-slate-800/50 w-fit">
                  {[
                     { val: '24k+', label: 'Elite Talent' },
                     { val: '98%', label: 'Match Precision' },
                     { val: '12ms', label: 'Processing' }
                  ].map(stat => (
                     <div key={stat.label}>
                        <p className="text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">{stat.val}</p>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mt-2">{stat.label}</p>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 lg:px-20 bg-slate-50/50 dark:bg-slate-900/20">
         <div className="max-w-[1400px] mx-auto space-y-24">
            <div className="text-center space-y-6 max-w-3xl mx-auto">
               <h2 className="text-sm font-bold text-blue-600 uppercase tracking-[0.2em]">Our Core Engine</h2>
               <h3 className="text-5xl lg:text-6xl font-semibold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
                  Intelligent tools for the modern workplace.
               </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
               {[
                  { title: 'Neural Matching', icon: 'hub', desc: 'Go beyond keywords with multi-dimensional skill mapping that understands your potential.', color: 'blue' },
                  { title: 'ATS Intelligence', icon: 'psychology', desc: 'Analyze your profile against 500+ proprietary ATS algorithms to optimize visibility.', color: 'indigo' },
                  { title: 'Bias-Free Protocols', icon: 'verified_user', desc: 'Anonymized merit-based scoring to ensure total workplace equality and inclusion.', color: 'emerald' },
                  { title: 'Growth Analytics', icon: 'trending_up', desc: 'Visualize your professional trajectory with predictive growth modeling.', color: 'violet' },
                  { title: 'Skill Gap Analysis', icon: 'data_exploration', desc: 'Identify critical competencies missing from your profile for your dream role.', color: 'amber' },
                  { title: 'Enterprise Pipelines', icon: 'corporate_fare', desc: 'Direct-to-recruiter channels for verified high-impact candidates.', color: 'rose' }
               ].map((feature, i) => (
                  <div key={i} className="group p-10 bg-white dark:bg-slate-900/50 rounded-[32px] border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900/50 transition-all hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-none">
                     <div className={`size-14 rounded-2xl bg-${feature.color}-50 dark:bg-${feature.color}-900/10 flex items-center justify-center text-${feature.color}-600 mb-8 group-hover:scale-110 transition-transform`}>
                        <span className="material-symbols-outlined text-3xl">{feature.icon}</span>
                     </div>
                     <h4 className="text-xl font-semibold text-slate-900 dark:text-white tracking-tight mb-4">{feature.title}</h4>
                     <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{feature.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
};

export default Home;
