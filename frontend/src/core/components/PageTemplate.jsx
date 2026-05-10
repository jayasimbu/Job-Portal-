import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../auth/session';

const PageTemplate = ({ title, subtitle, features = [], steps = [], benefit }) => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const isAuthenticated = !!user;

  const handleCtaClick = () => {
    if (isAuthenticated) {
      const dashboardPath = user?.role === 'admin' ? '/platform/admin/dashboard' : (user?.role === 'employer' ? '/platform/employer/dashboard' : '/platform/jobseeker/dashboard');
      navigate(dashboardPath);
    } else {
      navigate('/auth/signup');
    }
  };

  return (
    <div className="mb-24">

      {/* 🔥 HERO SECTION (LIKE ZOHO) */}
      <div className="bg-slate-50 dark:bg-[#0b1016] py-16 md:py-24 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

          {/* LEFT TEXT */}
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100/50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6">
              LINKUP Platform
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">{title}</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 font-medium leading-relaxed">{subtitle}</p>

            <button 
              onClick={handleCtaClick}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition-all active:scale-95 uppercase tracking-widest text-sm"
            >
              Get Started
            </button>
          </div>

          {/* RIGHT IMAGE */}
          <div className="hidden md:flex justify-end relative">
             <div className="absolute inset-0 bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-3xl -z-10 transform scale-110"></div>
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
              alt="Platform Engine"
              className="w-3/4 max-w-sm opacity-90 dark:opacity-70 grayscale hover:grayscale-0 transition-all duration-500"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

        </div>
      </div>

      {/* 🔽 MAIN CONTENT */}
      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* FEATURES */}
        {features.length > 0 && (
          <div className="mb-16">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest mb-8 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-xl">star</span>
              Features
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <div key={i} className="p-6 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-start gap-3">
                  <span className="material-symbols-outlined text-blue-600 text-lg shrink-0 mt-0.5">check_circle</span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEPS */}
        {steps.length > 0 && (
          <div className="mb-16">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest mb-8 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-xl">route</span>
              How it Works
            </h2>

            <ol className="space-y-4">
              {steps.map((s, i) => (
                <li key={i} className="flex items-center gap-4 p-5 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 min-w-[32px] w-8 h-8 flex items-center justify-center rounded-full font-black text-sm shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-slate-700 dark:text-slate-300 font-medium text-lg">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* BENEFIT */}
        {benefit && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40 p-8 rounded-2xl flex items-start gap-4">
            <span className="material-symbols-outlined text-blue-600 text-3xl shrink-0">lightbulb</span>
            <div>
              <h3 className="font-black text-blue-900 dark:text-blue-100 uppercase tracking-widest mb-2">Benefit</h3>
              <p className="text-blue-800 dark:text-blue-200 font-medium text-lg leading-relaxed">{benefit}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PageTemplate;
