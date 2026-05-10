import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, LayoutDashboard, LogIn, UserPlus } from 'lucide-react';
import logo from '../../assets/logos/linkup_logo.png';
import GlobalFooter from '../components/GlobalFooter';
import LogoModal from '../components/LogoModal';
import { getCurrentUser } from '../auth/session';

const PublicLayout = ({ children }) => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const isAuthenticated = !!user;
  const [loadingAction, setLoadingAction] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <div className="min-h-screen bg-white dark:bg-[#0d141b] transition-colors duration-300 font-sans">
      <nav className="fixed top-0 left-0 right-0 z-[70] py-2 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800/50">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex items-center justify-between h-14">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 group decoration-none">
              <div className="size-11 flex items-center justify-center transition-all group-hover:scale-110">
                <img src={logo} alt="LINKUP" className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white transition-colors group-hover:text-blue-600 uppercase">LINKUP</span>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              {['Features', 'Intelligence', 'Sourcing', 'Pricing'].map(item => (
                <button key={item} className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">{item}</button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <button 
                  onClick={() => {
                    const role = user?.role;
                    const path = role === 'admin' ? '/platform/admin/dashboard' : (role === 'employer' ? '/platform/employer/dashboard' : '/platform/jobseeker/dashboard');
                    handleNav(path, 'dashboard');
                  }}
                  disabled={loadingAction === 'dashboard'}
                  className="text-sm font-semibold text-white bg-blue-600 px-7 py-2.5 rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] flex items-center gap-2 min-w-[180px] justify-center"
                >
                  {loadingAction === 'dashboard' ? (
                    <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : <LayoutDashboard size={18} />}
                  <span>Open Dashboard</span>
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => handleNav('/auth/login', 'login')}
                    disabled={loadingAction === 'login'}
                    className="text-sm font-semibold text-slate-600 dark:text-slate-300 px-6 py-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                  >
                    {loadingAction === 'login' ? '...' : 'Sign In'}
                  </button>
                  <button 
                    onClick={() => handleNav('/auth/signup', 'signup')}
                    disabled={loadingAction === 'signup'}
                    className="text-sm font-semibold text-white bg-slate-900 dark:bg-blue-600 px-7 py-2.5 rounded-2xl hover:opacity-90 transition-all active:scale-[0.98] flex items-center gap-2"
                  >
                    {loadingAction === 'signup' && <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                    <span>Get Started</span>
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="md:hidden size-11 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-blue-50 transition-all"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-2xl z-[70] animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col p-6 gap-4">
              {isAuthenticated ? (
                <button 
                  onClick={() => {
                    const role = user?.role;
                    const path = role === 'admin' ? '/platform/admin/dashboard' : (role === 'employer' ? '/platform/employer/dashboard' : '/platform/jobseeker/dashboard');
                    handleNav(path, 'dashboard');
                  }}
                  className="flex items-center justify-between w-full p-4 rounded-2xl bg-blue-600 text-white font-semibold text-sm shadow-lg shadow-blue-500/20"
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard size={18} />
                    <span>Go to Dashboard</span>
                  </div>
                  <ArrowRight size={18} />
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => handleNav('/auth/login', 'login')}
                    className="flex items-center gap-3 w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm"
                  >
                    <LogIn size={18} />
                    <span>Sign In</span>
                  </button>
                  <button 
                    onClick={() => handleNav('/auth/signup', 'signup')}
                    className="flex items-center justify-between w-full p-4 rounded-2xl bg-slate-900 text-white font-semibold text-sm shadow-lg shadow-slate-900/20"
                  >
                    <div className="flex items-center gap-3">
                      <UserPlus size={18} />
                      <span>Create Account</span>
                    </div>
                    <ArrowRight size={18} />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="min-h-screen">
        {children}
      </main>

      <GlobalFooter />
      <LogoModal />
    </div>
  );
};

export default PublicLayout;
