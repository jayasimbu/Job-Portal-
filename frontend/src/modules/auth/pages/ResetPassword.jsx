import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../services/authService';

const ResetPassword = ({ onBack }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      if (email.toLowerCase().endsWith('@gmail.com')) {
        setError('Google accounts do not use passwords. Please sign in with Google.');
        setLoading(false); return;
      }
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send reset link. Please try again.');
    } finally { setLoading(false); }
  };

  const inputCls = (isErr) => `w-full pl-11 pr-4 py-2.5 rounded-[10px] text-sm bg-white dark:bg-slate-800/30 dark:text-white outline-none transition-all duration-200 border ${
    isErr ? 'border-red-400 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]'
          : 'border-[#D1D5DB] dark:border-slate-700 focus:border-[#2563EB] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]'
  }`;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div className="mb-5">
        <div className="size-11 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-3">
          <span className="material-symbols-outlined text-blue-600 text-xl">lock_reset</span>
        </div>
        <h2 style={{ fontSize: 28, fontWeight: 600 }} className="text-slate-900 dark:text-white mb-1 tracking-tight">Reset Password</h2>
        <p style={{ fontSize: 15 }} className="text-slate-500 dark:text-slate-400 leading-relaxed">Enter your email and we'll send you a secure link.</p>
      </div>

      {error && (
        <div className="p-3 rounded-[10px] border border-red-200 bg-red-50 flex items-center gap-2 text-red-600 mb-4">
          <span className="material-symbols-outlined text-base">warning</span>
          <p style={{ fontSize: 13, fontWeight: 500 }} className="leading-snug">{error}</p>
        </div>
      )}

      {/* Info alert */}
      <div className="flex items-center gap-2.5 mb-4 px-3 py-2.5 rounded-[10px] bg-[#EFF6FF] border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800/30">
        <span className="material-symbols-outlined text-blue-600 text-base shrink-0">security</span>
        <p style={{ fontSize: 14, fontWeight: 500 }} className="text-blue-600 leading-snug">Secure verification required before change.</p>
      </div>

      {!sent ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label style={{ fontSize: 12, fontWeight: 600 }} className="text-slate-500 dark:text-slate-400 ml-0.5 uppercase tracking-wide">Email Address</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg transition-colors group-focus-within:text-blue-500">mail</span>
              <input type="email" placeholder="your@email.com" className={inputCls(!!error)}
                value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-3">
            <button type="submit" disabled={loading}
              style={{ height: 52, background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', fontSize: 15, fontWeight: 600 }}
              className="w-full text-white rounded-xl transition-all duration-200 hover:-translate-y-px hover:shadow-[0_8px_20px_rgba(37,99,235,0.3)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3">
              {loading ? (<><div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Sending...</span></>) : 'Send Reset Link'}
            </button>
            <button type="button" onClick={onBack}
              style={{ height: 44, fontSize: 14, fontWeight: 600 }}
              className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition-all active:scale-[0.98]">
              Back to Login
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center space-y-5 animate-in zoom-in-95 duration-500 py-3">
          <div className="p-6 bg-green-50/50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/30 rounded-2xl flex flex-col items-center">
            <div className="size-14 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-3 text-green-600 animate-bounce">
              <span className="material-symbols-outlined text-3xl">mark_email_read</span>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 600 }} className="text-slate-900 dark:text-white mb-1">Email Sent!</h3>
            <p style={{ fontSize: 13 }} className="text-slate-500 leading-relaxed">
              Recovery link sent to <span className="text-blue-600 font-semibold">{email}</span>. Check inbox & spam.
            </p>
          </div>
          <button onClick={onBack}
            style={{ height: 48, fontSize: 15, fontWeight: 600 }}
            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl hover:-translate-y-px active:scale-[0.98] transition-all">
            Return to Sign In
          </button>
        </div>
      )}

      {/* Footer — consistent across all pages */}
      <p style={{ fontSize: 13, fontWeight: 500, color: '#6B7280', marginTop: 16, textAlign: 'center' }}>
        By continuing, you agree to our{' '}
        <button className="font-semibold text-[#2563EB] hover:underline" onClick={() => navigate('/legal')}>Terms</button>
        {' '}&{' '}
        <button className="font-semibold text-[#2563EB] hover:underline" onClick={() => navigate('/legal')}>Privacy Policy</button>
      </p>
    </div>
  );
};

export default ResetPassword;
