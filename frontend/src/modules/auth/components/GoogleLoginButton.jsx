import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithGoogle, getRoleRedirectPath } from '../services/authService';
import appConfig from '../../../core/config/appConfig';

const GoogleLoginButton = ({ activeTab, onSwitch, onError }) => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const googleButtonRef = useRef(null);

  // To fix React StrictMode unmount stale closure issues with Google's singleton initialize:
  const activeTabRef = useRef(activeTab);

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  const handleCredentialResponse = async (response) => {
    if (!response?.credential) {
      setError('Google credential failed.');
      return;
    }
    try {
      setLoading(true);
      setError('');

      const intent = activeTabRef.current === 'signup' ? 'signup' : 'login';
      
      const result = await loginWithGoogle({ 
        id_token: response.credential, 
        role: 'jobseeker',
        intent: intent
      });
      
      navigate(result.redirect_to || getRoleRedirectPath(result.role), { replace: true });
    } catch (err) {
      const body = err?.response?.data || err?.apiError || {};
      const errorCode = body?.detail || body?.error;
      const message = body?.message || err?.message;

      if (errorCode === 'ACCOUNT_NOT_FOUND' || errorCode === 'ACCOUNT_NOT_FOUND_PLEASE_SIGNUP') {
        if (onError) onError('NO ACCOUNT LINKED TO THIS GOOGLE EMAIL. PLEASE SIGN UP FIRST.');
        else setError('NO ACCOUNT LINKED TO THIS GOOGLE EMAIL. PLEASE SIGN UP FIRST.');
      } else if (errorCode === 'ALREADY_EXISTS') {
        if (onError) onError('AN ACCOUNT WITH THIS EMAIL ALREADY EXISTS. PLEASE LOG IN.');
        else setError('AN ACCOUNT WITH THIS EMAIL ALREADY EXISTS. PLEASE LOG IN.');
      } else if (errorCode === 'GOOGLE_LOGIN_REQUIRED') {
        if (onError) onError('THIS ACCOUNT USES GOOGLE LOGIN. PLEASE CONTINUE WITH GOOGLE.');
        else setError('THIS ACCOUNT USES GOOGLE LOGIN. PLEASE CONTINUE WITH GOOGLE.');
      } else if (errorCode === 'AUTH_FAILED') {
        if (onError) onError('GOOGLE TOKEN VERIFICATION FAILED. PLEASE TRY AGAIN.');
        else setError('GOOGLE TOKEN VERIFICATION FAILED. PLEASE TRY AGAIN.');
      } else if (typeof message === 'string' && message.trim()) {
        if (onError) onError(message.toUpperCase());
        else setError(message.toUpperCase());
      } else {
        if (onError) onError('GOOGLE LOGIN FAILED.');
        else setError('GOOGLE LOGIN FAILED.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Keep the global callback strictly bound to the currently mounted component instance
  useEffect(() => {
    window.__googleAuthCallback = handleCredentialResponse;
  });

  useEffect(() => {
    const clientId = appConfig.auth.googleClientId;
    if (!clientId) return;

    const initializeGoogle = () => {
      if (!window.google?.accounts?.id || !googleButtonRef.current) return;

      if (!window.__isGoogleInitialized) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          prompt: 'select_account',
          callback: (res) => window.__googleAuthCallback?.(res)
        });
        window.__isGoogleInitialized = true;
      }

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        type: 'standard',
        shape: 'rectangular',
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        width: googleButtonRef.current.offsetWidth || 280,
      });
    };

    if (window.google?.accounts?.id) {
      initializeGoogle();
    } else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      document.head.appendChild(script);
    }
  }, [navigate]);



  return (
    <div className="w-full">
      <div ref={googleButtonRef} className="w-full flex justify-center min-h-[44px]"></div>
      
      {!onError && error && (
        <div className={`mt-3 p-4 rounded-xl border-2 flex flex-col gap-3 bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/50 text-red-600 dark:text-red-400`}>
          <div className="flex items-start gap-2.5">
            <span className="material-symbols-outlined text-lg flex-shrink-0 mt-0.5">
              error
            </span>
            <div className="flex-1 leading-tight text-sm font-semibold">
              {error === 'NO ACCOUNT LINKED TO THIS GOOGLE EMAIL. PLEASE SIGN UP FIRST.'
                ? 'No account found for this email. Create one first.'
                : error === 'AN ACCOUNT WITH THIS EMAIL ALREADY EXISTS. PLEASE LOG IN.'
                ? 'An account already exists with this email.'
                : error === 'GOOGLE TOKEN VERIFICATION FAILED. PLEASE TRY AGAIN.'
                ? 'Google verification failed. Please try again.'
                : error.toUpperCase()}
            </div>
          </div>
        </div>
      )}
      
      {loading && !error && (
        <div className="mt-3 flex items-center justify-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest ">
          <span className="material-symbols-outlined text-base ">sync</span>
          Verifying Identity...
        </div>
      )}
    </div>
  );
};

export default GoogleLoginButton;



