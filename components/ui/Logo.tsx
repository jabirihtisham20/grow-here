import React from 'react';

interface LogoProps {
  variant?: 'horizontal' | 'mark' | 'stacked';
  theme?: 'dark' | 'light';
  showTagline?: boolean;
  className?: string;
}

export function Logo({
  variant = 'horizontal',
  theme = 'dark',
  showTagline = true,
  className = '',
}: LogoProps) {
  const isLight = theme === 'light';
  const strokeColor = isLight ? '#132B20' : '#FAF7F2';
  const leafColor = '#7C9A82';

  // Standalone Squircle Mark
  if (variant === 'mark') {
    return (
      <span className={`inline-block flex-shrink-0 relative ${className}`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          aria-hidden="true"
        >
          {/* Outer Squircle */}
          <rect
            x="7"
            y="7"
            width="86"
            height="86"
            rx="24"
            ry="24"
            stroke={strokeColor}
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* G & H Monogram */}
          <g>
            {/* G Curve */}
            <path
              d="M 44 26 C 41 24.5 37 23.5 32.5 23.5 C 20.5 23.5 14 33.5 14 50 C 14 66.5 21 76.5 32.5 76.5 C 38 76.5 42.5 74.5 45.5 71.5"
              stroke={strokeColor}
              strokeWidth="5.2"
              strokeLinecap="round"
            />
            {/* G Top Serif */}
            <path d="M 43 23 L 45 28" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
            {/* G Spur & Crossbar */}
            <path d="M 45 56 L 45 72" stroke={strokeColor} strokeWidth="4.8" strokeLinecap="round" />
            <path d="M 34 56 L 47 56" stroke={strokeColor} strokeWidth="4.5" strokeLinecap="round" />

            {/* H Left Stem */}
            <path d="M 48 37 L 48 76" stroke={strokeColor} strokeWidth="4.8" strokeLinecap="round" />
            <path d="M 45 37 L 51 37" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
            <path d="M 45 76 L 51 76" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />

            {/* H Crossbar */}
            <path d="M 48 56 L 68 56" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />

            {/* H Right Stem */}
            <path d="M 68 28 L 68 76" stroke={strokeColor} strokeWidth="5" strokeLinecap="round" />
            <path d="M 64 28 L 73 28" stroke={strokeColor} strokeWidth="3.2" strokeLinecap="round" />
            <path d="M 63 76 L 74 76" stroke={strokeColor} strokeWidth="3.2" strokeLinecap="round" />

            {/* Botanical Leaf Accent */}
            <path d="M 57 53 C 58 45 64 34 76 26 C 76 36 71 45 61 51 Z" fill={leafColor} />
            <path
              d="M 56 54 Q 65 42 75 27"
              stroke={strokeColor}
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.85"
            />
          </g>
        </svg>
      </span>
    );
  }

  // Stacked Logo
  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <div className="w-16 h-16 mb-2.5">
          <Logo variant="mark" theme={theme} />
        </div>
        <span
          className={`font-serif tracking-[0.35em] text-lg font-medium ${
            isLight ? 'text-forest-950' : 'text-cream-100'
          }`}
        >
          GROWHERE
        </span>
        {showTagline && (
          <span
            className={`font-sans italic text-xs tracking-wider mt-0.5 ${
              isLight ? 'text-forest-800/80' : 'text-cream-400/80'
            }`}
          >
            Grow a better way of living.
          </span>
        )}
      </div>
    );
  }

  // Horizontal Logo (Default for Header & Footer)
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Mark */}
      <div className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
        <Logo variant="mark" theme={theme} />
      </div>

      {/* Subtle Divider Line */}
      <div
        className={`h-7 w-[1px] hidden sm:block ${
          isLight ? 'bg-forest-900/25' : 'bg-cream-400/25'
        }`}
      />

      {/* Brand Typography */}
      <div className="flex flex-col justify-center">
        <span
          className={`font-serif tracking-[0.28em] text-base sm:text-lg font-medium leading-none ${
            isLight ? 'text-forest-950' : 'text-cream-100'
          }`}
        >
          GROWHERE
        </span>
        {showTagline && (
          <span
            className={`font-sans italic text-[10px] sm:text-[11px] tracking-wide mt-1 leading-none ${
              isLight ? 'text-forest-800/80' : 'text-botanical-muted'
            }`}
          >
            Grow a better way of living.
          </span>
        )}
      </div>
    </div>
  );
}
