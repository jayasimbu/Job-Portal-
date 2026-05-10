import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logos/linkup_logo.png';

const GlobalFooter = () => {
  return (
    <footer className="w-full bg-slate-50 dark:bg-[#0b1016] border-t border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-12 pb-6">
        {/* 🧠 MAIN FOOTER GRID (5-COLUMN STRUCTURE) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 mb-8">
          
          {/* 1. CAREER */}
          <div>
            <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-4">Career</h4>
            <ul className="space-y-2">
              {[
                { name: 'AI Matcher', path: '/ai-matcher' },
                { name: 'Resume Builder', path: '/resume-builder' },
                { name: 'Skills Analysis', path: '/skills-analysis' },
                { name: 'Applications', path: '/applications' }
              ].map(item => (
                <li key={item.name}>
                  <Link to={item.path} className="text-sm text-slate-500 hover:text-blue-600 transition-all duration-200">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 2. HIRING */}
          <div>
            <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-4">Hiring</h4>
            <ul className="space-y-2">
              {[
                { name: 'Talent Sourcing', path: '/talent-sourcing' },
                { name: 'AI Ranking', path: '/ai-ranking' },
                { name: 'ATS Integration', path: '/ats' },
                { name: 'Enterprise Hiring', path: '/enterprise' }
              ].map(item => (
                <li key={item.name}>
                  <Link to={item.path} className="text-sm text-slate-500 hover:text-blue-600 transition-all duration-200">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. RESOURCES */}
          <div>
            <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-4">Resources</h4>
            <ul className="space-y-2">
              {[
                { name: 'How It Works', path: '/how-it-works' },
                { name: 'AI Career Guide', path: '/guide' },
                { name: 'Resume Tips', path: '/resume-tips' },
                { name: 'Interview Prep', path: '/interview-prep' },
                { name: 'Help Center', path: '/help' }
              ].map(item => (
                <li key={item.name}>
                  <Link to={item.path} className="text-sm text-slate-500 hover:text-blue-600 transition-all duration-200">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. COMPANY */}
          <div>
            <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-4">Company</h4>
            <ul className="space-y-2">
              {[
                { name: 'About', path: '/about' },
                { name: 'Careers', path: '/careers' },
                { name: 'Press', path: '/press' },
                { name: 'Contact', path: '/contact' }
              ].map(item => (
                <li key={item.name}>
                  <Link to={item.path} className="text-sm text-slate-500 hover:text-blue-600 transition-all duration-200">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 5. CONTACT */}
          <div>
            <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="text-sm text-slate-500 flex items-center gap-2"><span className="text-base leading-none">📧</span> careerautoai@gmail.com</li>
              <li className="text-sm text-slate-500 flex items-center gap-2"><span className="text-base leading-none">📞</span> +91 XXXXX XXXXX</li>
              <li>
                <Link to="/contact" className="text-sm text-slate-500 hover:text-blue-600 transition-all duration-200 flex items-center gap-2">
                  <span className="text-base leading-none">💬</span> Live Support
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* 🔐 LEGAL & TRUST BAR (BOTTOM STRIP) */}
        <div className="my-6 border-t border-slate-200 dark:border-slate-800/60 pt-6">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-slate-400">
            {[
              { name: 'Privacy', path: '/privacy' },
              { name: 'Terms', path: '/terms' },
              { name: 'Security', path: '/security' },
              { name: 'AI Ethics', path: '/ai-ethics' },
              { name: 'Bias-Free Policy', path: '/bias-free' }
            ].map((item, idx) => (
              <React.Fragment key={item.name}>
                <Link to={item.path} className="hover:text-slate-900 dark:hover:text-white transition-all duration-200">{item.name}</Link>
                {idx < 4 && <span className="text-slate-300 dark:text-slate-700/50">|</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* 🧾 FINAL BRAND LINE */}
        <div className="my-6 border-t border-slate-200 dark:border-slate-800/60 pt-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <div className="size-10 bg-blue-600 rounded-full flex shrink-0 items-center justify-center p-2 shadow-sm overflow-hidden" onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('open-logo-modal')); }}>
              <img src={logo} alt="LINKUP" className="w-full h-full object-cover scale-110 cursor-pointer" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">© 2026 LINKUP Inc.</p>
              <p className="text-[13px] text-slate-500 mt-1 max-w-lg leading-relaxed">
                AI-driven career platform connecting learning and hiring.
              </p>
            </div>
          </div>
          
          {/* 🌐 SOCIAL + BRAND SIGNALS */}
          <div className="flex items-center gap-4 text-slate-400">
            <a href="#" className="hover:text-[#0077b5] transition-all duration-200" aria-label="LinkedIn">
              <svg className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-all duration-200" aria-label="GitHub">
              <svg className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
            <a href="#" className="hover:text-[#ff0000] transition-all duration-200" aria-label="YouTube">
              <svg className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default GlobalFooter;
