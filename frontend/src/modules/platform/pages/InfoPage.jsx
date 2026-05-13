import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { infoPagesData } from '../../../core/data/infoPagesData';

export default function InfoPage() {
  const { slug } = useParams();
  const pageData = infoPagesData[slug];

  if (!pageData) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4">search_off</span>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Page Not Found</h1>
        <p className="text-slate-500 mb-8">The page you are looking for does not exist or is currently being built.</p>
        <Link to="/" className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-slate-100 dark:bg-[#0b1016] py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-50 dark:bg-[#0d141b] border border-slate-300 dark:border-slate-700/60 rounded-3xl p-8 md:p-12 shadow-xl">
          <div className="mb-10 text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100/50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">
              LINKUP Platform
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
              {pageData.title}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              {pageData.description}
            </p>
          </div>

          <div className="space-y-10">
            {pageData.features && pageData.features.length > 0 && (
              <div className="bg-slate-100 dark:bg-slate-900/50 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600 text-xl">star</span>
                  {pageData.featuresListTitle}
                </h3>
                <ul className="space-y-4">
                  {pageData.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-blue-600 text-lg shrink-0 mt-0.5">check_circle</span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {pageData.benefit && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 md:p-8 border border-blue-100 dark:border-blue-800/40">
                <h3 className="text-sm font-black text-blue-900 dark:text-blue-100 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600 text-xl">lightbulb</span>
                  {pageData.benefitTitle || 'Outcome'}
                </h3>
                <p className="text-blue-800 dark:text-blue-200 font-medium leading-relaxed">
                  {pageData.benefit}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



