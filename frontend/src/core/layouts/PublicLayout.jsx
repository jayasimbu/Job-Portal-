import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, LayoutDashboard, LogIn, UserPlus } from 'lucide-react';
import logo from '../../assets/logos/career_auto_logo.png';
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
    }, 400); // 400ms for polishing feel
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d141b] transition-colors duration-300 font-manrope">
      <nav className="fixed top-0 left-0 right-0 z-[70] py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 md:px-10 flex items-center justify-between h-12">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group decoration-none">
              <div className="size-9 bg-blue-600 rounded-full flex items-center justify-center p-1.5 transition-transform group-hover:scale-110 shadow-lg shadow-blue-500/20 overflow-hidden">
                <img src={logo} alt="L" className="w-full h-full object-cover scale-110" />
              </div>
              <span className="font-black text-xl tracking-tighter text-slate-900 dark:text-white uppercase transition-colors group-hover:text-blue-600">Career Auto</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <button 
                  onClick={() => {
                    const role = user?.role;
                    const path = role === 'admin' ? '/platform/admin/dashboard' : (role === 'employer' ? '/platform/employer/dashboard' : '/platform/jobseeker/dashboard');
                    handleNav(path, 'dashboard');
                  }}
                  disabled={loadingAction === 'dashboard'}
                  className="text-xs font-black text-white bg-blue-600 px-6 py-2.5 rounded-full hover:bg-blue-700 shadow-2xl shadow-blue-600/30 transition-all duration-200 uppercase tracking-widest active:scale-[0.98] flex items-center justify-center min-w-[170px]"
                >
                  {loadingAction === 'dashboard' ? (
                    <span className="flex items-center gap-2"><span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>Loading...</span>
                  ) : 'Open Dashboard'}
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => handleNav('/auth/login', 'login')}
                    disabled={loadingAction === 'login'}
                    className="text-xs font-black text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-6 py-2.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 uppercase tracking-widest items-center justify-center min-w-[120px]"
                  >
                    {loadingAction === 'login' ? 'Wait...' : 'Login'}
                  </button>
                  <button 
                    onClick={() => handleNav('/auth/signup', 'signup')}
                    disabled={loadingAction === 'signup'}
                    className="text-xs font-black text-white bg-blue-600 px-6 py-2.5 rounded-full hover:bg-blue-700 shadow-2xl shadow-blue-600/30 transition-all duration-200 uppercase tracking-widest active:scale-[0.98] flex items-center justify-center min-w-[140px]"
                  >
                    {loadingAction === 'signup' ? (
                      <span className="flex items-center gap-2"><span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>Wait...</span>
                    ) : 'Sign Up'}
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="md:hidden size-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-200"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-2xl z-[70] animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col p-6 gap-4">
              {isAuthenticated ? (
                <button 
                  onClick={() => {
                    const role = user?.role;
                    const path = role === 'admin' ? '/platform/admin/dashboard' : (role === 'employer' ? '/platform/employer/dashboard' : '/platform/jobseeker/dashboard');
                    handleNav(path, 'dashboard');
                  }}
                  className="flex items-center justify-between w-full p-4 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-500/30"
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
                    className="flex items-center gap-3 w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-black uppercase tracking-widest text-xs"
                  >
                    <LogIn size={18} />
                    <span>Login</span>
                  </button>
                  <button 
                    onClick={() => handleNav('/auth/signup', 'signup')}
                    className="flex items-center justify-between w-full p-4 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-500/30"
                  >
                    <div className="flex items-center gap-3">
                      <UserPlus size={18} />
                      <span>Create Account</span>
                    </div>
                    <ArrowRight size={18} />
                  </button>
                </>
              )}
              
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">Quick Navigation</span>
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 py-2">About Us</Link>
                  <Link to="/careers" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 py-2">Careers</Link>
                  <Link to="/status" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 py-2">Status</Link>
                  <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 py-2">Contact</Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="pt-0 mt-0">
        {children}
      </main>

      <GlobalFooter />
      <LogoModal />
    </div>
  );
};

export default PublicLayout;
