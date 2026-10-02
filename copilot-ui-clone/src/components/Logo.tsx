import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-48 h-auto" }) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center select-none ${className}`}>
      {/* Shield Emblem Top */}
      <div className="relative flex items-center justify-center w-20 h-24 mb-2 drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]">
        <svg viewBox="0 0 100 120" className="w-full h-full">
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5D792" />
              <stop offset="35%" stopColor="#D4AF37" />
              <stop offset="70%" stopColor="#9C7736" />
              <stop offset="100%" stopColor="#E6C27A" />
            </linearGradient>
            <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#A8A9AD" />
              <stop offset="100%" stopColor="#6C727F" />
            </linearGradient>
            <linearGradient id="charcoalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4A5568" />
              <stop offset="50%" stopColor="#2D3748" />
              <stop offset="100%" stopColor="#1A202C" />
            </linearGradient>
          </defs>
          {/* Outer Shield Frame */}
          <path 
            d="M50 4 L92 20 L92 60 C92 92 50 116 50 116 C50 116 8 92 8 60 L8 20 Z" 
            fill="none" 
            stroke="url(#silverGrad)" 
            strokeWidth="4" 
          />
          {/* Inner Gold Shield Accent */}
          <path 
            d="M50 10 L86 24 L86 58 C86 86 50 108 50 108 C50 108 14 86 14 58 L14 24 Z" 
            fill="none" 
            stroke="url(#goldGrad)" 
            strokeWidth="2.5" 
            opacity="0.85"
          />
          {/* Z Ribbon (Dark Metallic) */}
          <path 
            d="M26 34 L74 34 L38 84 L74 84" 
            fill="none" 
            stroke="url(#charcoalGrad)" 
            strokeWidth="11" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          {/* A Ribbon (Brushed Gold) */}
          <path 
            d="M50 26 L28 84 M50 26 L72 84 M36 62 L64 62" 
            fill="none" 
            stroke="url(#goldGrad)" 
            strokeWidth="6.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
      </div>

      {/* ZARZAYN Text Below Logo */}
      <h2 className="text-2xl md:text-3xl font-display font-extrabold tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-b from-gray-100 via-gray-200 to-gray-400 drop-shadow-md uppercase">
        ZARZAYN
      </h2>

      {/* Subtitle Line Below ZARZAYN */}
      <div className="flex items-center justify-center gap-2 w-full mt-1 max-w-[260px]">
        <div className="h-[1px] bg-gradient-to-r from-transparent to-amber-500/70 flex-1"></div>
        <p className="text-amber-400 text-[8px] md:text-[9px] tracking-[0.25em] font-semibold uppercase whitespace-nowrap">
          EST. 2024 <span className="mx-1 text-gray-400">|</span> PREMIUM SOLUTIONS
        </p>
        <div className="h-[1px] bg-gradient-to-l from-transparent to-amber-500/70 flex-1"></div>
      </div>
    </div>
  );
};



