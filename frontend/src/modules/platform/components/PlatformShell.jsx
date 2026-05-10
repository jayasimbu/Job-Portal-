import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../assets/logos/linkup_logo.png';
import GlobalFooter from '../../../core/components/GlobalFooter';
import LogoModal from '../../../core/components/LogoModal';
import { useTheme } from '../../../core/context/ThemeContext';

const links = [
  { key: 'home', label: 'Home', to: '/platform/home' },
  { key: 'intelligence', label: 'Intelligence', to: '/platform/intelligence' },
  { key: 'legal', label: 'Legal', to: '/platform/legal' },
  { key: 'search', label: 'Search', to: '/platform/search' },
  { key: 'settings', label: 'Settings', to: '/platform/settings' },
  { key: 'system', label: 'System', to: '/platform/system' },
];

const PlatformShell = ({ active, children }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'dark' : ''} bg-[var(--bg-page)] text-[var(--text-main)]`} style={{ fontFamily: "'Manrope', sans-serif" }}>
      <header className="flex justify-between items-center px-10 py-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-50">
        <div className="flex items-center gap-3 group">
          <div 
            className="size-10 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/30 overflow-hidden p-1.5 transition-transform group-hover:scale-110 cursor-pointer"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.dispatchEvent(new CustomEvent('open-logo-modal')); }}
          >
            <img src={logo} alt="LINKUP" className="w-full h-full object-cover scale-[1.2]" />
          </div>
          <Link to="/" className="font-black text-xl text-slate-900 dark:text-white tracking-tighter hover:text-blue-600 transition-colors uppercase no-underline">LINKUP</Link>
        </div>
        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider ml-1">Platform</span>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-2">
            {links.map((item) => (
              <Link
                key={item.key}
                to={item.to}
                className={`px-3 py-1.5 rounded-full text-xs font-black transition-all ${
                  active === item.key 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                    : 'bg-[var(--bg-page)] text-slate-600 border border-slate-200 dark:border-slate-700 hover:border-blue-500'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            onClick={toggleTheme}
            className="size-9 rounded-full bg-[var(--bg-page)] dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center transition-all hover:border-blue-500 hover:shadow-lg active:scale-95"
            title="Toggle Theme"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        </div>
      </header>
      <main className="p-6 md:p-8 min-h-[calc(100vh-140px)]">{children}</main>
      <GlobalFooter />
      <LogoModal />
    </div>
  );
};

export default PlatformShell;
