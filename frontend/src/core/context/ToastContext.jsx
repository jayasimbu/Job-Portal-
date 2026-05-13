import React, { useState, useEffect, createContext, useContext } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success', id = null) => {
    const toastId = id || Date.now();
    setToasts((prev) => {
      const filtered = id ? prev.filter(t => t.id !== id) : prev;
      return [...filtered, { id: toastId, message, type }];
    });
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl pointer-events-auto ${
              toast.type === 'error' 
                ? 'bg-rose-600 text-white' 
                : 'bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-lg">
              {toast.type === 'error' ? 'error' : 'check_circle'}
            </span>
            <span className="text-xs font-black uppercase tracking-widest">{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);



