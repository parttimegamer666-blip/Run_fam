import React from 'react';

interface RunFamLogoProps {
  variant?: 'full' | 'compact' | 'icon' | 'badge';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  darkTheme?: boolean;
  className?: string;
}

export const RunFamLogo: React.FC<RunFamLogoProps> = ({
  variant = 'full',
  size = 'md',
  darkTheme = false,
  className = '',
}) => {
  // Height definitions for crisp vector rendering
  const sizeMap = {
    xs: { h: 'h-6', iconSize: 22, text: 'text-base', sub: 'text-[7px]' },
    sm: { h: 'h-8', iconSize: 28, text: 'text-lg', sub: 'text-[9px]' },
    md: { h: 'h-10', iconSize: 36, text: 'text-2xl', sub: 'text-[11px]' },
    lg: { h: 'h-14', iconSize: 48, text: 'text-3xl', sub: 'text-[13px]' },
    xl: { h: 'h-20', iconSize: 68, text: 'text-5xl', sub: 'text-[16px]' },
  };

  const currentSize = sizeMap[size];

  // SVG Runner Icon matching the user's uploaded official logo exactly:
  // Circular head forward, curved athletic 'R' upper body, forward stride slash, bent knee trailing
  const RunnerIcon = ({ size: px }: { size: number }) => (
    <svg
      width={px}
      height={px}
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 group-hover:scale-105"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="rf-lime-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8EF700" />
          <stop offset="50%" stopColor="#72D600" />
          <stop offset="100%" stopColor="#4EAB00" />
        </linearGradient>
      </defs>

      {/* Head */}
      <circle cx="146" cy="42" r="22" fill="url(#rf-lime-grad)" />

      {/* Forward Hand / Upper Blade */}
      <path
        d="M 160 88 C 174 88 190 98 190 105 C 190 112 174 120 160 120 Z"
        fill="url(#rf-lime-grad)"
      />

      {/* Torso & Loop Curve ('R' / Runner Body) */}
      <path
        d="M 44 64 
           L 112 64 
           C 136 64 158 82 158 108 
           C 158 132 136 148 112 148 
           L 92 148 
           C 84 148 81 154 84 161 
           L 98 161 
           C 128 161 164 134 164 102 
           C 164 68 130 46 94 46 
           L 36 46 
           C 22 46 30 64 44 64 Z"
        fill="url(#rf-lime-grad)"
      />

      {/* Main Dynamic Forward Stride Body Slash */}
      <path
        d="M 94 76 
           L 14 190 
           C 4 204 16 214 32 214 
           L 48 214 
           L 124 102 
           Z"
        fill="url(#rf-lime-grad)"
      />

      {/* Rear Running Leg with bent knee */}
      <path
        d="M 92 152 
           C 82 152 78 160 86 168 
           L 114 198 
           C 122 206 118 216 102 222 
           L 82 222 
           C 104 232 132 218 138 202 
           L 118 172 
           C 110 160 104 152 92 152 Z"
        fill="url(#rf-lime-grad)"
      />
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <RunnerIcon size={currentSize.iconSize} />
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-2 group select-none ${className}`}>
        <RunnerIcon size={currentSize.iconSize} />
        <span
          className={`font-display font-black italic tracking-tight ${currentSize.text} leading-none`}
        >
          <span className={darkTheme ? 'text-white' : 'text-[#0F172A]'}>Run</span>
          <span className="text-[#72D600]">Fam</span>
        </span>
      </div>
    );
  }

  // Full variant with "MOVE TOGETHER" tagline
  return (
    <div className={`inline-flex flex-col items-start group select-none ${className}`}>
      <div className="flex items-center gap-2.5">
        <RunnerIcon size={currentSize.iconSize} />
        <div className="flex flex-col">
          <span
            className={`font-display font-black italic tracking-tight ${currentSize.text} leading-none`}
          >
            <span className={darkTheme ? 'text-white' : 'text-[#0F172A]'}>Run</span>
            <span className="text-[#72D600]">Fam</span>
          </span>
          <span
            className={`font-sans font-bold tracking-[0.26em] uppercase ${currentSize.sub} mt-0.5 ${
              darkTheme ? 'text-slate-400' : 'text-[#0F172A]/80'
            }`}
          >
            MOVE TOGETHER
          </span>
        </div>
      </div>
    </div>
  );
};
