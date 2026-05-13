import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import appConfig from '../../../core/config/appConfig';
import { getRoleRedirectPath } from '../services/authService';
import Login from './Login';
import Register from './Register';
import ResetPassword from './ResetPassword';
import AuthLayout from '../layout/AuthLayout';

const tabs = [
  { id: 'login',  label: 'Log In'   },
  { id: 'signup', label: 'Sign Up'  },
  { id: 'forgot', label: 'Reset PW' },
];

const AuthCenter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'login';
  const navigate = useNavigate();
  const [hideLeft, setHideLeft] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(appConfig.auth.tokenStorageKey);
    const role  = localStorage.getItem(appConfig.auth.roleStorageKey);
    if (token && role) navigate(getRoleRedirectPath(role), { replace: true });
  }, [navigate]);

  const switchTab = (tab) => { setHideLeft(false); setSearchParams({ tab }); };

  const getTitle = () => {
    if (activeTab === 'login') return 'Welcome Back!';
    if (activeTab === 'signup' || activeTab === 'role') return 'Join the Future!';
    return 'Security First';
  };
  const getSubtitle = () => {
    if (activeTab === 'login') return 'Your AI-powered career journey continues here.';
    if (activeTab === 'signup' || activeTab === 'role') return 'AI-matched to the right jobs. Zero guesswork.';
    return "We'll help you get back into your account safely.";
  };

  /* Active index for the sliding indicator */
  const activeIdx = tabs.findIndex(t =>
    t.id === 'signup' ? (activeTab === 'signup' || activeTab === 'role') : activeTab === t.id
  );

  return (
    <div style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
         className="bg-slate-100 dark:bg-[#0a0f14] px-4">

      {/* ─── Tab bar with sliding indicator ──────────────────────────── */}
      <div className="w-full max-w-[760px] mb-3 flex-shrink-0">
        <div className="relative flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-2xl shadow-inner">
          {/* Sliding bg pill */}
          <div
            className="absolute top-1 bottom-1 rounded-xl bg-blue-600 shadow-lg shadow-blue-500/20 transition-all ease-out"
            style={{ width: `calc(${100/tabs.length}% - 4px)`, left: `calc(${activeIdx * (100/tabs.length)}% + 2px)` }}
          />
          {tabs.map(({ id, label }) => {
            const active = id === 'signup' ? (activeTab === 'signup' || activeTab === 'role') : activeTab === id;
            return (
              <button key={id} onClick={() => switchTab(id)}
                className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold tracking-wide relative z-10 transition-colors ${
                  active ? 'text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                }`}>{label}</button>
            );
          })}
        </div>
      </div>

      {/* ─── Card fills remaining space ─────────────────────────────── */}
      <div className="w-full max-w-[760px] flex-1 min-h-0 pb-3">
        <AuthLayout title={getTitle()} subtitle={getSubtitle()} activeTab={activeTab} onSwitch={switchTab}
          hideLeftPanel={activeTab === 'forgot' || hideLeft}>
          {activeTab === 'login'  && <Login onSwitch={() => switchTab('signup')} onForgot={() => switchTab('forgot')} />}
          {(activeTab === 'signup' || activeTab === 'role') &&
            <Register onSwitch={() => switchTab('login')} activeTab={activeTab} onSwitchTab={switchTab} onSuccess={() => setHideLeft(true)} />}
          {activeTab === 'forgot' && <ResetPassword onBack={() => switchTab('login')} />}
        </AuthLayout>
      </div>
    </div>
  );
};

export default AuthCenter;



