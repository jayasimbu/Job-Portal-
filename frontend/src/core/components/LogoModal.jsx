import React, { useState, useEffect } from 'react';
import Logo from './Logo';
const LogoModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-logo-modal', handleOpen);
    return () => window.removeEventListener('open-logo-modal', handleOpen);
  }, []);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 "
      onClick={() => setIsOpen(false)}
    >
      <div 
        className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center gap-6 "
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined text-3xl">close</span>
        </button>
        
        <div className="bg-white/5 p-8 rounded-3xl border border-white/10 shadow-2xl flex items-center justify-center scale-150 my-10">
          <Logo variant="dark" />
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-black text-white tracking-tight">LINKUP</h2>
          <p className="text-white/60 text-sm font-medium mt-1">Refined Branding Identity</p>
        </div>
      </div>
    </div>
  );
};

export default LogoModal;



