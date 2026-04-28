import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/authService';

const NewPassword = () => {
    const [searchParams] = useSearchParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, success, error
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setStatus('error');
            setMessage('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            await resetPassword(token, password);
            setStatus('success');
            setMessage('Your password has been reset successfully.');
            setTimeout(() => navigate('/auth?mode=login'), 3000);
        } catch (err) {
            setStatus('error');
            setMessage(err.response?.data?.detail || 'FAILED TO RESET PASSWORD. TOKEN MAY BE EXPIRED.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 font-inter">
            <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 border border-slate-100 dark:border-slate-700 animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-8">
                    <div className="size-16 bg-blue-50 dark:bg-blue-900/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner border border-blue-100/50 dark:border-blue-800/30">
                        <span className="material-symbols-outlined text-blue-600 text-3xl">lock_open</span>
                    </div>
                    <h1 className="text-3xl font-[900] text-slate-900 dark:text-white tracking-tight leading-tight">Set New Password</h1>
                    <p className="text-slate-500 dark:text-gray-400 text-xs font-semibold mt-2">Please enter your new secure password.</p>
                </div>

                {status === 'success' ? (
                    <div className="text-center space-y-4">
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 rounded-2xl">
                            <p className="text-green-600 dark:text-green-400 font-bold text-sm uppercase tracking-wider">{message}</p>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest animate-pulse">Redirecting to login...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {status === 'error' && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">error</span>
                                {message}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] ml-1 opacity-90">New Password</label>
                            <input
                                type="password"
                                required
                                className={`w-full px-4 py-3.5 rounded-xl border bg-slate-50/30 dark:bg-slate-900/30 dark:text-white text-sm outline-none transition-all focus:ring-4 focus:ring-blue-500/10 ${
                                    status === 'error' && message.includes('match') ? 'border-red-200 focus:border-red-500 ring-red-500/10' : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'
                                }`}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Confirm Password</label>
                            <input
                                type="password"
                                required
                                className={`w-full px-4 py-3.5 rounded-xl border bg-slate-50/30 dark:bg-slate-900/30 dark:text-white text-sm outline-none transition-all focus:ring-4 focus:ring-blue-500/10 ${
                                    status === 'error' && message.includes('match') ? 'border-red-200 focus:border-red-500 ring-red-500/10' : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'
                                }`}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-[900] rounded-xl shadow-[0_8px_20px_rgba(37,99,235,0.25)] hover:shadow-[0_12px_24px_rgba(37,99,235,0.35)] transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 mt-4"
                        >
                            {loading ? (
                                <>
                                    <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Updating...</span>
                                </>
                            ) : 'Update Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default NewPassword;
