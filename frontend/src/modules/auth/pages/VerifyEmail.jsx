import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../services/authService';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const token = searchParams.get('token');

    useEffect(() => {
        const performVerification = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Verification token is missing.');
                return;
            }

            try {
                const data = await verifyEmail(token);
                setStatus('success');
                setMessage(data.message || 'Email verified successfully!');
                // Auto redirect after 3 seconds
                setTimeout(() => navigate('/auth?mode=login'), 3000);
            } catch (err) {
                setStatus('error');
                setMessage(err.response?.data?.detail || 'INVALID_OR_EXPIRED_TOKEN');
            }
        };

        performVerification();
    }, [token, navigate]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 text-center border border-slate-100 dark:border-slate-700 animate-in fade-in zoom-in duration-500">
                <div className="mb-6">
                    {status === 'verifying' && (
                        <div className="size-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <span className="material-symbols-outlined text-blue-600 text-4xl animate-spin">sync</span>
                        </div>
                    )}
                    {status === 'success' && (
                        <div className="size-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/10">
                            <span className="material-symbols-outlined text-green-600 text-4xl animate-in zoom-in duration-500">check_circle</span>
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="size-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-500/10">
                            <span className="material-symbols-outlined text-red-600 text-4xl animate-bounce">error</span>
                        </div>
                    )}
                </div>

                <h1 className="text-3xl font-[900] text-slate-900 dark:text-white mb-2 tracking-tight">
                    {status === 'verifying' ? 'Verifying Email...' : status === 'success' ? 'Verified!' : 'Verification Failed'}
                </h1>
                
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
                    {message || (status === 'verifying' ? 'Please wait while we confirm your email address.' : '')}
                </p>

                {status !== 'verifying' && (
                    <button 
                        onClick={() => navigate('/auth?mode=login')}
                        className="w-full py-4.5 bg-gradient-to-r from-slate-800 to-slate-900 dark:from-white dark:to-slate-100 text-white dark:text-slate-900 font-[900] rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(0,0,0,0.15)] text-[11px] uppercase tracking-[0.25em]"
                    >
                        Go to Login
                    </button>
                )}

                {status === 'success' && (
                    <p className="mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest animate-pulse">
                        Redirecting to login in 3 seconds...
                    </p>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
