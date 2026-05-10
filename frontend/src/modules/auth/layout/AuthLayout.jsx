import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/logos/linkup_logo.png';
import LogoModal from '../../../core/components/LogoModal';

const AuthLayout = ({ children, title, subtitle, activeTab, onSwitch, hideLeftPanel = false }) => {
  const navigate = useNavigate();

  const stats = [
    { value: '10K+', label: 'Candidates' },
    { value: '500+', label: 'Recruiters' },
    { value: '100%', label: 'AI Verified' },
  ];

  return (
    <div className="w-full h-full flex items-stretch justify-center">
      <div className={`w-full h-full ${hideLeftPanel ? 'max-w-[420px]' : ''} flex flex-col lg:flex-row overflow-hidden transition-all duration-300`}
           style={{ borderRadius: 16 }}>

        {/* ═══ LEFT PANEL ═══════════════════════════════════════════════ */}
        {!hideLeftPanel && (
          <div className="hidden lg:flex lg:flex-1 flex-col justify-between text-white relative overflow-hidden"
               style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 60%, #2563eb 100%)', padding: 'clamp(20px, 3vw, 32px)' }}>
            {/* Glow overlay */}
            <div className="absolute inset-0 pointer-events-none"
                 style={{ background: 'radial-gradient(ellipse at 80% 0%, rgba(255,255,255,0.07) 0%, transparent 70%)' }} />

            {/* TOP — Logo */}
            <div className="relative z-10">
              <div className="flex items-center gap-2 cursor-pointer group w-fit" onClick={() => navigate('/')}>
                <div className="size-8 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg overflow-hidden p-1 transition-transform group-hover:scale-110"
                     onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('open-logo-modal')); }}>
                  <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-sm font-bold tracking-tight text-white/90 hover:text-white transition-colors">LINKUP</span>
              </div>
            </div>

            {/* MIDDLE — Heading + Features + CTA */}
            <div className="relative z-10 flex flex-col">
              <h1 style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.15 }} className="mb-2 text-white">{title}</h1>
              <p style={{ fontSize: 15, color: '#CBD5F5' }} className="mb-5 max-w-[260px] leading-relaxed">{subtitle}</p>

              {/* Feature cards — only on signup */}
              {(activeTab === 'signup' || activeTab === 'role') && (
                <div className="grid grid-cols-3 gap-2 mb-5 animate-in fade-in slide-in-from-bottom-3 duration-500">
                  {[
                    { label: 'ATS Logic',  desc: 'Resume scoring', icon: 'verified' },
                    { label: 'AI Insight', desc: 'Smart feedback', icon: 'psychology' },
                    { label: 'Job Fit',    desc: 'Match analysis', icon: 'target' }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white/5 border border-white/10 transition-transform hover:scale-105">
                      <span className="material-symbols-outlined text-blue-200 text-base">{item.icon}</span>
                      <p className="text-[8px] font-bold uppercase tracking-wider opacity-90">{item.label}</p>
                      <p className="text-[7px] text-blue-200/50 font-medium text-center">{item.desc}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA link */}
              <p style={{ fontSize: 15, color: '#E0E7FF' }}>
                {activeTab === 'login' ? (
                  <>New here? <button onClick={() => onSwitch('signup')} className="font-semibold text-white underline underline-offset-2 hover:text-blue-200 transition-colors">Create account</button></>
                ) : (
                  <>Already have an account? <button onClick={() => onSwitch('login')} className="font-semibold text-white underline underline-offset-2 hover:text-blue-200 transition-colors">Log in</button></>
                )}
              </p>
            </div>

            {/* BOTTOM — Stats + Footer */}
            <div className="relative z-10">
              <div className="w-full h-px bg-white/10 mb-3" />
              <div className="flex items-center mb-3">
                {stats.map((s, i) => (
                  <div key={i} className={`flex-1 text-center ${i < stats.length - 1 ? 'border-r border-white/10' : ''}`}>
                    <p style={{ fontWeight: 600, opacity: 0.9 }} className="text-base text-white leading-none">{s.value}</p>
                    <p className="text-[8px] text-blue-200/50 font-semibold uppercase tracking-widest mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 13, fontWeight: 500, color: '#6B7280' }} className="text-center opacity-50">© 2026 LINKUP Inc.</p>
            </div>
          </div>
        )}

        {/* ═══ RIGHT PANEL — Form ══════════════════════════════════════ */}
        <div className={`flex-1 flex flex-col justify-center bg-white dark:bg-[#0a0f14] relative overflow-hidden min-h-0`}
             style={{ padding: 32, boxShadow: '0 12px 32px rgba(0,0,0,0.08)' }}>
          <div className="flex-1 flex flex-col w-full justify-center min-h-0">
            {hideLeftPanel && (
              <div className="flex items-center gap-2 cursor-pointer mb-6 justify-center group" onClick={() => navigate('/')}>
                <div className="size-10 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-lg overflow-hidden p-1.5 border border-slate-100 dark:border-slate-800 transition-transform group-hover:scale-110"
                     onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('open-logo-modal')); }}>
                  <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white hover:text-blue-600 transition-colors">LINKUP</span>
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
      <LogoModal />
    </div>
  );
};

export default AuthLayout;
