import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, getRoleRedirectPath } from '../services/authService';
import { isValidEmail } from '../utils/validators';
import RoleSelection from '../components/RoleSelection';
import GoogleLoginButton from '../components/GoogleLoginButton';

const Register = ({ onSwitch, activeTab, onSwitchTab, onSuccess }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', email: '', password: '', confirm_password: '', role: 'jobseeker' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-200', text: 'text-slate-400' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return [
      { label: 'Very Weak', color: 'bg-red-500',    text: 'text-red-500' },
      { label: 'Weak',      color: 'bg-orange-500', text: 'text-orange-500' },
      { label: 'Medium',    color: 'bg-yellow-500', text: 'text-yellow-500' },
      { label: 'Strong',    color: 'bg-blue-500',   text: 'text-blue-500' },
      { label: 'Exceptional', color: 'bg-green-500', text: 'text-green-500' },
    ][score];
  };
  const strength = getPasswordStrength(formData.password);
  const passwordRules = [
    { label: '8+ characters', met: formData.password.length >= 8 },
    { label: '1 uppercase letter', met: /[A-Z]/.test(formData.password) },
    { label: '1 number', met: /[0-9]/.test(formData.password) },
  ];

  const handleRoleSelect = (role) => { setFormData({ ...formData, role }); if (onSwitchTab) onSwitchTab('signup'); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (!isValidEmail(formData.email)) { setError('Please provide a valid email.'); return; }
    if (formData.password !== formData.confirm_password) { setError('Passwords do not match.'); return; }
    if (formData.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    try {
      setLoading(true);
      await registerUser(formData);
      setSuccess(true);
      if (typeof onSuccess === 'function') onSuccess();
    } catch (err) {
      const body = err?.response?.data || {};
      const ec = body?.error || body?.detail;
      const msg = body?.message || err?.message;
      if (ec === 'ALREADY_EXISTS' || ec === 'USER_ALREADY_EXISTS') setError('An account with this email already exists.');
      else if (ec === 'EMAIL_ACCOUNT_ALREADY_EXISTS') setError('This email is linked to an email+password account.');
      else setError(msg || 'Registration failed.');
    } finally { setLoading(false); }
  };

  /* Reusable input class */
  const inputCls = (isErr) => `w-full px-4 py-3 rounded-[10px] text-sm bg-slate-50 dark:bg-slate-800/30 dark:text-white outline-none transition-all border ${
    isErr ? 'border-red-400 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]'
          : 'border-[#D1D5DB] dark:border-slate-700 focus:border-[#2563EB] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]'
  }`;

  // ── Role Selection ─────────────────────────────────────────────────
  if (activeTab === 'role') {
    return (
      <div className="zoom-in-95 ">
        <RoleSelection selectedRole={formData.role} onSelect={handleRoleSelect} />
        <div className="mt-5 flex flex-col gap-2">
          <button onClick={() => onSwitchTab && onSwitchTab('signup')}
            style={{ height: 52, background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', fontSize: 15, fontWeight: 600 }}
            className="w-full text-white rounded-xl transition-all hover:-translate-y-px hover:shadow-[0_8px_20px_rgba(37,99,235,0.3)] active:scale-[0.98]">
            Next: Account Details →
          </button>
          <button onClick={() => onSwitchTab && onSwitchTab('login')}
            style={{ fontSize: 13, fontWeight: 500 }}
            className="text-blue-600 hover:text-blue-700 transition-colors">Already have an account? Log in</button>
        </div>
      </div>
    );
  }

  // ── Success ────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="zoom-in-95 text-center py-6">
        <div className="size-16 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-500/10">
          <span className="material-symbols-outlined text-green-600 text-3xl">mark_email_read</span>
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 600 }} className="text-slate-900 dark:text-white mb-2">Check Your Email</h2>
        <p style={{ fontSize: 14 }} className="text-slate-500 mb-6">
          Verification link sent to <span className="text-blue-600 font-semibold">{formData.email}</span>.
        </p>
        <button onClick={() => onSwitchTab('login')}
          style={{ height: 48, fontSize: 15, fontWeight: 600 }}
          className="w-full bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 rounded-xl hover:-translate-y-px active:scale-[0.98] transition-all">
          Go to Login
        </button>
      </div>
    );
  }

  // ── Main Sign-Up Form ──────────────────────────────────────────────
  return (
    <div className="slide-in-from-bottom-3 ">
      <div className="mb-4">
        <h2 style={{ fontSize: 28, fontWeight: 600 }} className="text-slate-900 dark:text-white mb-1 tracking-tight">Create Account</h2>
        <p style={{ fontSize: 15 }} className="text-slate-500 dark:text-slate-400">Fill in your details to get started.</p>
      </div>

      {/* Google — clean, border only */}
      <div className="mb-3">
        <div className="rounded-[10px] overflow-hidden transition-all hover:bg-[#F9FAFB]"
             style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', boxShadow: 'none' }}>
          <GoogleLoginButton activeTab={activeTab} onSwitch={onSwitch} onError={setError} />
        </div>
        <div className="flex items-center gap-3 my-3">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          <span style={{ fontSize: 12, fontWeight: 500 }} className="text-slate-400 uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>

      {/* Role Toggle — Premium Interaction */}
      <div className="flex gap-2 mb-4 p-1 bg-slate-100 dark:bg-slate-800 rounded-[10px]">
        {[{ id: 'jobseeker', label: '👤  Job Seeker' }, { id: 'employer', label: '🏢  Employer' }].map((r) => (
          <button key={r.id} type="button" onClick={() => setFormData({ ...formData, role: r.id })}
            style={{ borderRadius: 10, transition: 'all 0.2s ease', fontSize: 14, fontWeight: 600 }}
            className={`flex-1 py-2.5 ${formData.role === r.id
              ? 'bg-[#EFF6FF] border-2 border-[#2563EB] text-blue-600 shadow-[0_4px_10px_rgba(0,0,0,0.06)] scale-[1.02]'
              : 'bg-transparent border-2 border-transparent text-slate-500 hover:text-slate-700'}`}>
            {r.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-2.5">
        {error && (
          <div className="p-3 rounded-[10px] border border-red-200 bg-red-50 flex items-center gap-2 text-red-600">
            <span className="material-symbols-outlined text-base shrink-0">error</span>
            <p style={{ fontSize: 13, fontWeight: 500 }} className="leading-snug">{error}</p>
            {error.includes('already exists') && (
              <button type="button" onClick={() => onSwitchTab('login')} className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold ml-auto whitespace-nowrap transition-colors">Log In</button>
            )}
          </div>
        )}

        {/* Name + Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1 md:col-span-2">
            <label style={{ fontSize: 12, fontWeight: 600 }} className="text-slate-500 dark:text-slate-400 ml-0.5 uppercase tracking-wide">Full Name</label>
            <input name="full_name" type="text" placeholder="Jayasimbu Jayamani"
              className={inputCls(false)} value={formData.full_name} onChange={handleChange} required />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label style={{ fontSize: 12, fontWeight: 600 }} className="text-slate-500 dark:text-slate-400 ml-0.5 uppercase tracking-wide">Work Email</label>
            <input name="email" type="email" placeholder={formData.role === 'jobseeker' ? 'jayasimbu66@gmail.com' : 'jayasimbu@company.com'}
              className={inputCls(error.includes('email') || error.includes('exists'))} value={formData.email} onChange={handleChange} required />
          </div>
        </div>

        {/* Password + Confirm */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label style={{ fontSize: 12, fontWeight: 600 }} className="text-slate-500 dark:text-slate-400 ml-0.5 uppercase tracking-wide">Password</label>
            <input name="password" type="password" placeholder="••••••••"
              className={inputCls(error.includes('match'))} value={formData.password} onChange={handleChange} required />
            {formData.password && (
              <div className="mt-1 space-y-0.5">
                <div className="flex gap-0.5">
                  {[0,1,2,3].map(idx => (
                    <div key={idx} className={`h-1 flex-1 rounded-full transition-all ${idx < strength.score ? strength.color : 'bg-slate-200 dark:bg-slate-700'}`} />
                  ))}
                </div>
                <p className={`text-[10px] font-semibold ${strength.text}`}>{strength.label}</p>
                <div className="space-y-px">
                  {passwordRules.map(r => (
                    <div key={r.label} className="flex items-center gap-1">
                      <span className={`material-symbols-outlined text-[10px] ${r.met ? 'text-green-500' : 'text-slate-300'}`}>{r.met ? 'check_circle' : 'radio_button_unchecked'}</span>
                      <span className={`text-[10px] ${r.met ? 'text-green-600 font-semibold' : 'text-slate-400'}`}>{r.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="space-y-1">
            <label style={{ fontSize: 12, fontWeight: 600 }} className="text-slate-500 dark:text-slate-400 ml-0.5 uppercase tracking-wide">Confirm</label>
            <input name="confirm_password" type="password" placeholder="••••••••"
              className={inputCls(error.includes('match'))} value={formData.confirm_password} onChange={handleChange} required />
          </div>
        </div>

        {/* CTA */}
        <div className="pt-1">
          <button type="submit" disabled={loading}
            style={{ height: 52, background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', fontSize: 15, fontWeight: 600 }}
            className="w-full text-white rounded-xl transition-all hover:-translate-y-px hover:shadow-[0_8px_20px_rgba(37,99,235,0.3)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3">
            {loading ? (<><div className="size-4 border-2 border-white/30 border-t-white rounded-full " /><span>Creating Account...</span></>) : 'Create Account'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;



