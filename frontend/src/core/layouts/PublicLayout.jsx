import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, LayoutDashboard, LogIn, UserPlus, Sparkles } from 'lucide-react';

import GlobalFooter from '../components/GlobalFooter';
import LogoModal from '../components/LogoModal';
import Logo from '../components/Logo';
import { getCurrentUser } from '../auth/session';

const PublicLayout = ({ children }) => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const isAuthenticated = !!user;
  const [loadingAction, setLoadingAction] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (path, actionName) => {
    setLoadingAction(actionName);
    setIsMenuOpen(false);
    setTimeout(() => {
      navigate(path);
      setLoadingAction(null);
    }, 300);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0F172A] transition-colors font-sans">
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all ${
        scrolled 
          ? 'py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800/50 shadow-sm' 
          : 'py-6 bg-transparent'
      }`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link to="/" className="decoration-none">
              <Logo variant="light" />
            </Link>

            {/* Navigation links removed per clean design */}
          </div>
          
          <div className="flex items-center gap-6">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <button 
                  onClick={() => {
                    const role = user?.role;
                    const path = role === 'admin' ? '/platform/admin/dashboard' : (role === 'employer' ? '/platform/employer/dashboard' : '/platform/jobseeker/dashboard');
                    handleNav(path, 'dashboard');
                  }}
                  className="group relative inline-flex items-center justify-center gap-3 bg-slate-900 dark:bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold text-sm overflow-hidden transition-all hover:pr-12 shadow-xl shadow-blue-600/10 active:scale-95"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {loadingAction === 'dashboard' ? (
                        <span className="size-4 border-2 border-white/30 border-t-white rounded-full "></span>
                    ) : <LayoutDashboard size={18} />}
                    Open Dashboard
                  </span>
                  <ArrowRight size={18} className="absolute right-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => handleNav('/auth/login', 'login')}
                    className="text-sm font-bold text-slate-600 dark:text-slate-300 px-6 py-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all uppercase tracking-widest"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => handleNav('/auth/signup', 'signup')}
                    className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2 uppercase tracking-widest"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="md:hidden size-12 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-blue-50 transition-all border border-slate-100 dark:border-slate-700"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-2xl z-[100] duration-300">
            <div className="flex flex-col p-8 gap-6">
              {/* Mobile navigation links removed */}
              <div className="flex flex-col gap-4 pt-4">
                {isAuthenticated ? (
                  <button 
                    onClick={() => {
                      const role = user?.role;
                      const path = role === 'admin' ? '/platform/admin/dashboard' : (role === 'employer' ? '/platform/employer/dashboard' : '/platform/jobseeker/dashboard');
                      handleNav(path, 'dashboard');
                    }}
                    className="flex items-center justify-between w-full p-5 rounded-2xl bg-blue-600 text-white font-bold text-lg shadow-xl shadow-blue-500/20"
                  >
                    <span>Dashboard</span>
                    <ArrowRight size={20} />
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={() => handleNav('/auth/login', 'login')}
                      className="flex items-center gap-4 w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-lg"
                    >
                      <LogIn size={22} />
                      <span>Sign In</span>
                    </button>
                    <button 
                      onClick={() => handleNav('/auth/signup', 'signup')}
                      className="flex items-center justify-between w-full p-5 rounded-2xl bg-slate-900 text-white font-bold text-lg shadow-xl shadow-slate-900/20"
                    >
                      <span>Create Account</span>
                      <ArrowRight size={22} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <main>
        {children}
      </main>

      <GlobalFooter />
      <LogoModal />
    </div>
  );
};

export default PublicLayout;



