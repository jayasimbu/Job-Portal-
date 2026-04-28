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

  /* reusable input style */
  const inputBase = 'w-full pl-11 pr-4 py-2.5 rounded-[10px] text-sm bg-white dark:bg-slate-800/30 dark:text-white outline-none transition-all duration-200';
  const inputBorder = (isError) => isError
    ? 'border border-red-400 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]'
    : 'border border-[#D1D5DB] dark:border-slate-700 focus:border-[#2563EB] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* Heading — 28px, font-weight 600 */}
      <div className="mb-5">
        <h2 style={{ fontSize: 28, fontWeight: 600 }} className="text-slate-900 dark:text-white mb-1 tracking-tight">Sign in with Email</h2>
        <p style={{ fontSize: 15 }} className="text-slate-500 dark:text-slate-400">Enter your credentials to access your dashboard.</p>
      </div>

      {/* Google — border only, no shadow, 44px, hover bg change */}
      <div className="mb-3">
        <div className="rounded-[10px] overflow-hidden transition-all duration-200 hover:bg-[#F9FAFB]"
             style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', boxShadow: 'none' }}>
          <GoogleLoginButton activeTab="login" onSwitch={onSwitch} onError={setError} />
        </div>
        <div className="flex items-center gap-3 my-3">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          <span style={{ fontSize: 12, fontWeight: 500 }} className="text-slate-400 uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Error */}
        {error && (
          <div className={`p-3 rounded-[10px] border flex flex-col gap-2 ${
            error === 'GOOGLE_REGISTERED' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-red-50 border-red-200 text-red-600'
          }`}>
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-base mt-0.5">{error === 'GOOGLE_REGISTERED' ? 'info' : 'error'}</span>
              <p style={{ fontSize: 13, fontWeight: 500 }} className="leading-snug">
                {error === 'GOOGLE_REGISTERED' ? 'This email is registered with Google.'
                  : error === 'ACCOUNT_NOT_FOUND' ? 'Account not found. Create one to get started.'
                  : error === 'INVALID_PASSWORD' ? 'Incorrect password. Try again or reset it.'
                  : error}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {error === 'GOOGLE_REGISTERED' && <button type="button" onClick={() => onSwitch('login')} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors">Use Google Login</button>}
              {error === 'ACCOUNT_NOT_FOUND' && <button type="button" onClick={() => onSwitch('signup')} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors">Go to Sign Up</button>}
            </div>
          </div>
        )}

        {/* Email */}
        <div className="space-y-1.5">
          <label style={{ fontSize: 12, fontWeight: 600 }} className="text-slate-500 dark:text-slate-400 ml-0.5 uppercase tracking-wide">Email Address</label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg transition-colors group-focus-within:text-blue-500">mail</span>
            <input type="email" placeholder="jayasimbu@company.com"
              className={`${inputBase} ${inputBorder(error && error !== 'GOOGLE_REGISTERED' && error !== 'ACCOUNT_NOT_FOUND' && error !== 'INVALID_PASSWORD')}`}
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label style={{ fontSize: 12, fontWeight: 600 }} className="text-slate-500 dark:text-slate-400 ml-0.5 uppercase tracking-wide">Password</label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg transition-colors group-focus-within:text-blue-500">lock</span>
            <input type={showPassword ? 'text' : 'password'} placeholder="••••••••"
              className={`${inputBase} !pr-12 ${inputBorder(error === 'INVALID_PASSWORD')}`}
              value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors">
              <span className="material-symbols-outlined text-lg">{showPassword ? 'visibility_off' : 'visibility'}</span>
            </button>
          </div>
        </div>

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between px-0.5">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
            <span style={{ fontSize: 13, fontWeight: 500 }} className="text-slate-500 dark:text-slate-400">Remember me</span>
          </label>
          <button type="button" onClick={onForgot} style={{ fontSize: 13, fontWeight: 600 }} className="text-blue-600 hover:text-blue-700 transition-colors">Forgot Password?</button>
        </div>

        {/* CTA — 52px, gradient 135deg, hover translateY(-1px), click scale(0.98) */}
        <button type="submit" disabled={loading}
          style={{ height: 52, background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', fontSize: 15, fontWeight: 600 }}
          className="w-full text-white rounded-xl transition-all duration-200 hover:-translate-y-px hover:shadow-[0_8px_20px_rgba(37,99,235,0.3)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3">
          {loading ? (<><div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Verifying...</span></>) : 'Sign In Now'}
        </button>
      </form>
    </div>
  );
};

export default Login;
