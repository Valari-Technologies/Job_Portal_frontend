export default function AdminSecurityIllustration() {
  return (
    <div className="w-[340px] xl:w-[400px] h-[320px] relative select-none pointer-events-none" aria-hidden="true">
      <svg viewBox="0 0 400 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
        <defs>
          <linearGradient id="secGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818CF8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#C084FC" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="secGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4318FF" />
            <stop offset="100%" stopColor="#868CFF" />
          </linearGradient>
          <filter id="glowSec" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Isometric Grid Floor Platform */}
        <polygon points="200,280 370,185 200,90 30,185" fill="url(#secGrad1)" stroke="#A5B4FC" strokeWidth="1.5" strokeDasharray="4 4" />
        <polygon points="200,265 340,185 200,105 60,185" fill="#EEF2FF" opacity="0.7" />

        {/* Background Network Connection Lines & Nodes */}
        <path d="M70,140 L120,90 L200,120" stroke="#818CF8" strokeWidth="2" strokeDasharray="3 3" />
        <circle cx="70" cy="140" r="5" fill="#6366F1" />
        <circle cx="120" cy="90" r="4" fill="#A855F7" />
        <circle cx="200" cy="120" r="6" fill="#4F46E5" />

        {/* Left Server Rack Block */}
        <g transform="translate(45, 140)">
          <polygon points="40,0 80,20 80,70 40,50" fill="#3730A3" />
          <polygon points="0,20 40,0 40,50 0,70" fill="#4338CA" />
          <polygon points="0,20 40,0 80,20 40,40" fill="#6366F1" />
          {/* Server Lights */}
          <circle cx="15" cy="32" r="2.5" fill="#34D399" />
          <circle cx="25" cy="27" r="2.5" fill="#60A5FA" />
          <circle cx="15" cy="47" r="2.5" fill="#FBBF24" />
          <circle cx="25" cy="42" r="2.5" fill="#34D399" />
        </g>

        {/* Floating Password Pill */}
        <g transform="translate(180, 50)" filter="url(#glowSec)">
          <rect x="0" y="0" width="110" height="32" rx="16" fill="#FFFFFF" stroke="#C7D2FE" strokeWidth="1.5" />
          <circle cx="20" cy="16" r="4" fill="#4F46E5" />
          <circle cx="35" cy="16" r="4" fill="#4F46E5" />
          <circle cx="50" cy="16" r="4" fill="#4F46E5" />
          <circle cx="65" cy="16" r="4" fill="#4F46E5" />
          <circle cx="80" cy="16" r="4" fill="#4F46E5" />
          <circle cx="95" cy="16" r="4" fill="#34D399" />
        </g>

        {/* Central Glowing Pedestal & Security Shield */}
        <g transform="translate(145, 100)">
          {/* Pedestal Base */}
          <polygon points="55,140 110,110 110,125 55,155" fill="#312E81" />
          <polygon points="0,110 55,140 55,155 0,125" fill="#3730A3" />
          <polygon points="0,110 55,80 110,110 55,140" fill="url(#secGrad2)" />

          {/* Holographic Concentric Rings */}
          <ellipse cx="55" cy="110" rx="40" ry="20" fill="none" stroke="#60A5FA" strokeWidth="2" opacity="0.8" />
          <ellipse cx="55" cy="110" rx="25" ry="12" fill="none" stroke="#A7F3D0" strokeWidth="2" />

          {/* Central 3D Shield Badge */}
          <g transform="translate(25, 10)" filter="url(#glowSec)">
            <path d="M30,0 C45,0 60,10 60,35 C60,65 30,85 30,85 C30,85 0,65 0,35 C0,10 15,0 30,0 Z" fill="url(#shieldGrad)" stroke="#FFFFFF" strokeWidth="2" />
            {/* Lock Icon inside shield */}
            <rect x="20" y="42" width="20" height="18" rx="4" fill="#FFFFFF" />
            <path d="M24,42 V35 C24,30 36,30 36,35 V42" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            <circle cx="30" cy="50" r="2.5" fill="#4318FF" />
          </g>
        </g>

        {/* Right Digital Card Screen */}
        <g transform="translate(250, 150)">
          <polygon points="40,0 80,20 80,60 40,40" fill="#818CF8" opacity="0.8" />
          <polygon points="0,20 40,0 40,40 0,60" fill="#A5B4FC" opacity="0.9" />
          <polygon points="0,20 40,0 80,20 40,40" fill="#FFFFFF" />
          <line x1="15" y1="23" x2="35" y2="33" stroke="#6366F1" strokeWidth="3" strokeLinecap="round" />
          <line x1="15" y1="30" x2="28" y2="36" stroke="#C7D2FE" strokeWidth="2" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}
