import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, getRoleRedirectPath } from '../services/authService';
import { isValidEmail } from '../utils/validators';
import GoogleLoginButton from '../components/GoogleLoginButton';

const Login = ({ onSwitch, onForgot }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!isValidEmail(email)) { setError('Enter a valid email address.'); return; }
    if (!password) { setError('Password is required.'); return; }
    try {
      setLoading(true);
      const result = await loginUser({ email, password });
      navigate(result.redirect_to || getRoleRedirectPath(result.role), { replace: true });
    } catch (err) {
      const body = err?.response?.data || {};
      const errorCode = body?.error || body?.detail;
      const message = body?.message || err?.message;
      if (errorCode === 'ACCOUNT_NOT_FOUND' || errorCode === 'USER_NOT_FOUND') setError('ACCOUNT_NOT_FOUND');
      else if (errorCode === 'GOOGLE_LOGIN_REQUIRED') setError('GOOGLE_REGISTERED');
      else if (errorCode === 'INVALID_PASSWORD' || errorCode === 'AUTH_FAILED') setError('INVALID_PASSWORD');
      else setError((message || 'Login failed.').toUpperCase());
    } finally { setLoading(false); }
  };

  const inputBase = 'w-full pl-12 pr-4 py-3.5 rounded-2xl text-sm bg-slate-50 dark:bg-slate-800/50 dark:text-white outline-none transition-all duration-300 border border-transparent';
  const inputBorder = (isError) => isError
    ? '!border-red-400 focus:!shadow-[0_0_0_4px_rgba(239,68,68,0.05)]'
    : 'focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(59,130,246,0.05)]';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-slate-900 dark:text-white mb-2 tracking-tight">Welcome back</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Enter your details to access your professional dashboard.</p>
      </div>

      <div className="mb-6">
        <div className="rounded-2xl overflow-hidden transition-all duration-300 hover:bg-slate-50 border border-slate-100 dark:border-slate-800">
          <GoogleLoginButton activeTab="login" onSwitch={onSwitch} onError={setError} />
        </div>
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">or continue with email</span>
          <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className={`p-4 rounded-2xl border text-sm font-medium animate-in fade-in zoom-in-95 duration-300 ${
            error === 'GOOGLE_REGISTERED' ? 'bg-blue-50 border-blue-100 text-blue-700' : 'bg-red-50 border-red-100 text-red-600'
          }`}>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[20px]">{error === 'GOOGLE_REGISTERED' ? 'info' : 'error'}</span>
              <p className="leading-relaxed">
                {error === 'GOOGLE_REGISTERED' ? 'This email is registered via Google.'
                  : error === 'ACCOUNT_NOT_FOUND' ? 'Account not found. Create one to get started.'
                  : error === 'INVALID_PASSWORD' ? 'Incorrect password. Please try again.'
                  : error}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 dark:text-slate-500 ml-1 uppercase tracking-widest">Email Address</label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] transition-colors group-focus-within:text-blue-500">mail</span>
            <input type="email" placeholder="jayasimbu@company.com"
              className={`${inputBase} ${inputBorder(error && !['GOOGLE_REGISTERED', 'ACCOUNT_NOT_FOUND', 'INVALID_PASSWORD'].includes(error))}`}
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 dark:text-slate-500 ml-1 uppercase tracking-widest">Password</label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] transition-colors group-focus-within:text-blue-500">lock</span>
            <input type={showPassword ? 'text' : 'password'} placeholder="••••••••"
              className={`${inputBase} !pr-14 ${inputBorder(error === 'INVALID_PASSWORD')}`}
              value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors">
              <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input type="checkbox" className="size-4.5 rounded-lg border-slate-200 text-blue-600 focus:ring-blue-500/20 transition-all" />
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-900 transition-colors">Keep me signed in</span>
          </label>
          <button type="button" onClick={onForgot} className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">Reset Password</button>
        </div>

        <button type="submit" disabled={loading}
          className="w-full h-14 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-semibold text-base shadow-xl shadow-slate-900/10 dark:shadow-blue-600/10 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3">
          {loading ? (<><div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Verifying...</span></>) : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export default Login;
