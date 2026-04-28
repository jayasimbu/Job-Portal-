import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../core/context/ThemeContext';
import { getCurrentUser } from '../../../core/auth/session';
import { logoutUser } from '../../auth/services/authService';
import logo from '../../../assets/logos/career_auto_logo.png';

const HERO_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjELA1NT791EiteASnrqk5xeXQ7XApmB60i2XkS_ZW1cI9iWW-3g0Ybv-LxiALcWwqZqE61nx8J9p6fReM8azMtsGmi7zcXhrgm570i1lpXmqgv-knTItMAGtbLYUJ1I-Z1_sEnw2A48iwDtRjqLP4Ub3-aRWpxjCkBHtUK7TF_Q4rX45m8vhJta_hJgFqllG1iDEoZkPsg1jizXACTG-q8njVBnueEO9fb0WOsXDmzDB_0W78_fEybuIJ1oDZqqvblAMc8yrK5HxK';

const STATS = [
  { value: '10k+', label: 'Matches Made' },
  { value: '500+', label: 'Partner Companies' },
  { value: '25k+', label: 'Resumes Optimized' },
  { value: '98%', label: 'Success Rate' },
];

const HOW_STEPS = [
  { key: 'step-1', icon: 'upload_file', title: 'Upload Resume', desc: 'AI analyzes skills & ATS score instantly from your document.', link: '/platform/dashboard' },
  { key: 'step-2', icon: 'troubleshoot', title: 'Identify Skill Gaps', desc: 'Detect missing keywords and get actionable AI feedback.', link: '/platform/dashboard' },
  { key: 'step-3', icon: 'school', title: 'Learn Smart', desc: 'Personalized course path to close skill gaps effectively.', link: '/platform/learning' },
  { key: 'step-4', icon: 'send', title: 'Apply with Confidence', desc: 'High match job recommendations tailored to your profile.', link: '/platform/jobs' },
];

const FEATURES = [
  {
    icon: 'fact_check',
    title: 'ATS Intelligence',
    desc: 'Improve your ATS score before applying. We simulate top ATS systems to ensure your resume passes automated screening.',
    link: '/platform/dashboard',
    color: 'from-blue-500 to-blue-700',
  },
  {
    icon: 'school',
    title: 'AI Learning Hub',
    desc: 'Get personalized course recommendations based on the skill gaps detected in your resume analysis.',
    link: '/platform/learning',
    color: 'from-purple-500 to-purple-700',
  },
  {
    icon: 'groups',
    title: 'Bias-Free Hiring',
    desc: 'Skills-first matching that prioritizes merit over demographics — ensuring fair, inclusive hiring decisions.',
    link: '/platform/jobs',
    color: 'from-green-500 to-green-700',
  },
  {
    icon: 'settings',
    title: 'Smart Profile',
    desc: 'Unified settings for your links, preferences, and AI resume data. One source of truth for your career.',
    link: '/platform/settings',
    color: 'from-orange-500 to-red-600',
  },
];

const TRUST_BADGES = [
  { icon: 'people', value: '10,000+', label: 'Candidates' },
  { icon: 'business', value: '500+', label: 'Recruiters' },
  { icon: 'verified', value: '✔', label: 'AI Verified Profiles' },
];

const USER_ROLES = [
  {
    role: 'Job Seekers',
    icon: 'work',
    color: 'blue',
    features: [
      { icon: 'fact_check', text: 'Resume scoring with ATS simulation' },
      { icon: 'psychology', text: 'AI-powered feedback & suggestions' },
      { icon: 'auto_fix_high', text: 'Smart job matching engine' },
      { icon: 'trending_up', text: 'Career growth analytics' },
    ],
  },
  {
    role: 'Employers',
    icon: 'corporate_fare',
    color: 'purple',
    features: [
      { icon: 'leaderboard', text: 'ATS ranking & candidate scoring' },
      { icon: 'groups', text: 'Smart hiring with bias-free matching' },
      { icon: 'verified_user', text: 'Project & skill verification' },
      { icon: 'speed', text: 'Fast, efficient talent pipeline' },
    ],
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const user = getCurrentUser();
  const isAuthenticated = !!(user && (user.email || user.name || user.googleId || user.role));
  const dashboardPath = user?.role === 'admin' ? '/platform/admin/dashboard' : (user?.role === 'employer' ? '/platform/employer/dashboard' : '/platform/jobseeker/dashboard');
  
  const goToAuth = (tab = 'login') => navigate(`/auth?tab=${tab}`);
  const goToAppArea = (path = null) => {
    const target = path || dashboardPath;
    navigate(isAuthenticated ? target : '/auth?tab=role');
  };

  const [loadingAction, setLoadingAction] = React.useState(null);

  const handleNav = (path, actionName) => {
    setLoadingAction(actionName);
    setTimeout(() => {
      navigate(path);
      setLoadingAction(null);
    }, 400);
  };

  return (
    <div className="font-sans text-[#0d141b] dark:text-slate-100 overflow-x-hidden">

      {/* Hero Section */}
      <section className="relative w-full px-6 lg:px-12 xl:px-20 py-20 lg:py-32 flex items-center justify-center overflow-hidden" style={{ background: isDark ? 'linear-gradient(180deg, #0d141b, #111d2e)' : 'linear-gradient(180deg, #F8FAFF, #EEF2FF)' }}>
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent dark:from-blue-900/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-blue-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 font-black text-[11px] tracking-widest uppercase mx-auto">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            Intelligence-Driven Hiring Platform
          </div>
          
          <h1 className="text-3xl lg:text-5xl xl:text-6xl font-black mb-4 leading-tight tracking-tight text-slate-900 dark:text-white">
            <span className="block mb-2 text-blue-600 dark:text-blue-400">AI-Powered Career Growth Platform</span>
            <span className="block dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:via-slate-200 dark:to-slate-400">Analyze → Improve → Get Hired</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto font-medium opacity-90">
            From resume upload to real-time application tracking. Our AI engine identifies your skill gaps, recommends learning, and matches you with roles that value your expertise.
          </p>

          <div className="flex flex-col items-center gap-3">
            <div className="flex flex-wrap items-center justify-center gap-6">
              <button 
                onClick={() => goToAppArea()}
                className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-2xl shadow-blue-600/30 transition-all duration-200 active:scale-[0.98] flex items-center gap-3 text-base md:text-lg group"
              >
                Get Started
                <span className="material-symbols-outlined font-black group-hover:translate-x-1 transition-transform">trending_flat</span>
              </button>
              <button 
                onClick={() => goToAuth('role')}
                className="px-10 py-4 text-slate-700 dark:text-slate-200 font-black rounded-2xl transition-all duration-200 active:scale-[0.98] text-base md:text-lg hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300"
              >
                For Recruiters
              </button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 pt-6">
            {TRUST_BADGES.map((badge, i) => (
              <div key={i} className="flex items-center gap-2 group cursor-default">
                <div className="size-9 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform border border-blue-100 dark:border-blue-800/40">
                  <span className="material-symbols-outlined text-blue-600 text-lg">{badge.icon}</span>
                </div>
                <div className="text-left">
                  <span className="block text-sm font-black text-slate-800 dark:text-white leading-none">{badge.value}</span>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{badge.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section id="how-it-works" className="w-full px-6 lg:px-12 xl:px-20 py-16 lg:py-24 bg-white dark:bg-[#020617] relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-[10px] font-black tracking-[0.3em] text-blue-600 uppercase mb-2 block">Our Workflow</span>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">Seamless Career Progression</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative">
            <div className="hidden lg:block absolute top-7 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-100 via-blue-300 to-blue-100 dark:from-blue-900 dark:via-blue-600 dark:to-blue-900 z-0" />
            
            {HOW_STEPS.map((step) => (
              <div
                key={step.title}
                onClick={() => goToAppArea(step.link)}
                className="relative z-10 p-5 md:p-6 rounded-2xl bg-slate-50 dark:bg-[#1a2632] border border-slate-100 dark:border-slate-800 hover:border-blue-600/30 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer group flex flex-col items-center text-center"
              >
                <div className="size-10 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center mb-3 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-sm">{step.icon}</span>
                </div>
                <h3 className="font-black text-sm text-slate-900 dark:text-white mb-1 uppercase tracking-tight">{step.title}</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full px-6 lg:px-12 xl:px-20 py-16 lg:py-24 bg-slate-50 dark:bg-[#0d1117] relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
            <div className="max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2 uppercase">Platform Hub</h2>
              <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black leading-relaxed uppercase tracking-widest">Unified intelligence for the elite career path.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {FEATURES.map((feature) => (
              <div 
                key={feature.title} 
                className="group cursor-pointer p-5 md:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:shadow-2xl hover:scale-105 transition-all"
                onClick={() => goToAppArea(feature.link)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="size-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center border border-blue-100 dark:border-blue-800/50 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-2xl text-blue-600">{feature.icon}</span>
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white leading-tight">{feature.title}</h3>
                </div>
                <p className="text-[12px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section id="user-roles" className="w-full px-6 lg:px-12 xl:px-20 py-16 lg:py-24 bg-white dark:bg-[#020617] relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
             <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase tracking-tighter">Workflow-Based Product</h2>
             <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-3 max-w-2xl mx-auto">From discovery to hire — Career Auto facilitates every step of the journey.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {USER_ROLES.map((roleData) => (
              <div 
                key={roleData.role}
                className={`p-5 md:p-6 rounded-3xl border transition-all hover:-translate-y-2 group cursor-pointer flex flex-col h-full ${
                  roleData.color === 'blue' 
                    ? 'bg-blue-50/30 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/50 hover:border-blue-400 shadow-xl shadow-blue-500/5' 
                    : 'bg-purple-50/30 dark:bg-purple-950/10 border-purple-100 dark:border-purple-900/50 hover:border-purple-400 shadow-xl shadow-purple-500/5'
                }`}
                onClick={() => goToAppArea()}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className={`size-14 rounded-2xl flex items-center justify-center ${roleData.color === 'blue' ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'}`}>
                    <span className="material-symbols-outlined text-2xl">{roleData.icon}</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">{roleData.role}</h3>
                </div>

                <div className="space-y-3">
                  {roleData.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className={`size-8 rounded-xl flex items-center justify-center shrink-0 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700`}>
                        <span className={`material-symbols-outlined text-base ${roleData.color === 'blue' ? 'text-blue-600' : 'text-purple-600'}`}>{feat.icon}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{feat.text}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-auto pt-5">
                  <button className={`w-full py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-transform active:scale-95 ${roleData.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20' : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20'}`}>
                    {roleData.role === 'Job Seekers' ? 'Start Your Journey' : 'Hire Smart Talent'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🧩 CTA (ENGAGEMENT BOOST) */}
      <section className="w-full px-6 lg:px-12 xl:px-20 py-20 lg:py-32 bg-white dark:bg-[#0d141b] text-center border-t border-slate-200 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase mb-6">
            Start your AI-powered career journey today
          </h2>
          <button 
            onClick={() => handleNav(isAuthenticated ? dashboardPath : '/auth/signup', 'cta')}
            className="px-10 py-4 bg-blue-600 text-white font-black rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 text-sm uppercase tracking-widest"
          >
            Get Started
          </button>
        </div>
      </section>

    </div>
  );
}
