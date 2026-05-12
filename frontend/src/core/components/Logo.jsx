import React from 'react';
import premiumLogo from '../../assets/logos/linkup_premium_logo.png';

const Logo = ({ variant = 'light', className = '', showText = true, showIcon = true, size = 'default' }) => {
  // Styles based on variant
  const isDark = variant === 'dark';
  
  // Size mapping
  const sizeMap = {
    small: 'h-10',
    default: 'h-14',
    large: 'h-20',
    xl: 'h-32'
  };

  const logoHeight = sizeMap[size] || sizeMap.default;

  return (
    <div className={`flex items-center gap-[14px] ${className}`}>
      {/* PREMIUM LOGO IMAGE */}
      {showIcon && (
        <div 
          className={`flex items-center justify-center shrink-0 overflow-hidden ${logoHeight}`}
          style={{
            // Maintain aspect ratio, width will be auto
            aspectRatio: 'auto'
          }}
        >
          <img 
            src={premiumLogo} 
            alt="LINKUP Premium Logo" 
            className="h-full w-auto object-contain transition-transform duration-300 hover:scale-105" 
          />
        </div>
      )}

      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <div 
            className={`font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}
            style={{
              fontSize: size === 'small' ? '22px' : size === 'large' ? '42px' : size === 'xl' ? '64px' : '30px',
              lineHeight: 1
            }}
          >
            LINK<span style={{ color: '#2563eb' }}>UP</span>
          </div>
          {size !== 'small' && (
            <span 
              className={`uppercase tracking-[0.2em] mt-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
              style={{ fontSize: size === 'large' ? '12px' : size === 'xl' ? '16px' : '10px', fontWeight: 800 }}
            >
              Career Intelligence
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
