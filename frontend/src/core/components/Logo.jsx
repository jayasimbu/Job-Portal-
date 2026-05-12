import React from 'react';
import { Share2 } from 'lucide-react';

const Logo = ({ variant = 'light', className = '', showText = true }) => {
  // Styles based on variant
  const isDark = variant === 'dark';
  const textColor = isDark ? 'text-white' : 'text-slate-900';
  const subtextColor = isDark ? 'text-blue-100 opacity-90' : 'text-slate-500 opacity-70';

  return (
    <div className={`flex items-center gap-[12px] ${className}`}>
      {/* ICON */}
      <div 
        className="flex items-center justify-center shrink-0"
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #2563eb 0%, #4338ca 100%)',
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
        }}
      >
        <Share2 size={24} className="text-white" />
      </div>

      {/* TEXT */}
      {showText && (
        <div className="flex flex-col justify-center">
          <span 
            className={`${textColor} leading-none`}
            style={{
              fontSize: '30px',
              fontWeight: 800,
              letterSpacing: '-1px'
            }}
          >
            LINKUP
          </span>
          <span 
            className={`${subtextColor} uppercase leading-none mt-1`}
            style={{
              fontSize: '10px',
              letterSpacing: '2px'
            }}
          >
            Career Intelligence Platform
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
