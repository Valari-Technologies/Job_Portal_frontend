export default function AdminDashboardIllustration() {
  return (
    <div className="w-[340px] xl:w-[400px] h-[320px] relative select-none pointer-events-none" aria-hidden="true">
      <svg viewBox="0 0 400 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
        <defs>
          <linearGradient id="dashGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A5B4FC" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#DDD6FE" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="laptopScreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E1B4B" />
            <stop offset="100%" stopColor="#312E81" />
          </linearGradient>
          <filter id="glowDash" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Isometric Grid Floor */}
        <polygon points="200,290 380,195 200,100 20,195" fill="url(#dashGrad1)" stroke="#C7D2FE" strokeWidth="1.5" strokeDasharray="4 4" />

        {/* Floating Bar Chart Platform (Left side) */}
        <g transform="translate(40, 200)">
          {/* Bar 1 */}
          <polygon points="15,40 30,32 30,60 15,68" fill="#4338CA" />
          <polygon points="0,32 15,40 15,68 0,60" fill="#6366F1" />
          <polygon points="0,32 15,24 30,32 15,40" fill="#818CF8" />

          {/* Bar 2 */}
          <polygon points="45,25 60,17 60,60 45,68" fill="#6D28D9" />
          <polygon points="30,17 45,25 45,68 30,60" fill="#8B5CF6" />
          <polygon points="30,17 45,9 60,17 45,25" fill="#C084FC" />

          {/* Bar 3 */}
          <polygon points="75,10 90,2 90,60 75,68" fill="#047857" />
          <polygon points="60,2 75,10 75,68 60,60" fill="#10B981" />
          <polygon points="60,2 75,-6 90,2 75,10" fill="#6EE7B7" />
        </g>

        {/* Main 3D Laptop Computer Screen (Center Right) */}
        <g transform="translate(150, 80)" filter="url(#glowDash)">
          {/* Laptop Base Keyboard */}
          <polygon points="70,165 170,115 110,85 10,135" fill="#94A3B8" />
          <polygon points="70,165 170,115 170,123 70,173" fill="#64748B" />
          <polygon points="10,135 70,165 70,173 10,143" fill="#475569" />
          {/* Trackpad */}
          <polygon points="75,148 105,133 95,128 65,143" fill="#CBD5E1" />

          {/* Laptop Lid Screen Frame */}
          <polygon points="70,30 170,80 170,115 70,65" fill="#1E293B" />
          <polygon points="10,60 70,30 70,65 10,95" fill="#0F172A" />
          
          {/* Screen Display Face */}
          <polygon points="20,58 65,35 155,80 110,103" fill="url(#laptopScreen)" />

          {/* UI Charts on Screen */}
          {/* Circular Chart */}
          <ellipse cx="60" cy="62" rx="16" ry="9" fill="none" stroke="#38BDF8" strokeWidth="4" strokeDasharray="60 20" />
          {/* Line Chart */}
          <polyline points="90,85 105,75 120,80 135,68" fill="none" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="135" cy="68" r="3" fill="#FBBF24" />
        </g>

        {/* Server Tower Stack (Far Right) */}
        <g transform="translate(300, 140)">
          {/* Server Unit 1 */}
          <polygon points="40,30 80,10 80,35 40,55" fill="#3B82F6" />
          <polygon points="0,10 40,30 40,55 0,35" fill="#60A5FA" />
          <polygon points="0,10 40,-10 80,10 40,30" fill="#BFDBFE" />
          <circle cx="15" cy="22" r="2" fill="#34D399" />
          <circle cx="25" cy="27" r="2" fill="#34D399" />

          {/* Server Unit 2 */}
          <g transform="translate(0, 30)">
            <polygon points="40,30 80,10 80,35 40,55" fill="#1E40AF" />
            <polygon points="0,10 40,30 40,55 0,35" fill="#3B82F6" />
            <polygon points="0,10 40,-10 80,10 40,30" fill="#93C5FD" />
            <circle cx="15" cy="22" r="2" fill="#FBBF24" />
            <circle cx="25" cy="27" r="2" fill="#34D399" />
          </g>
        </g>

        {/* Floating Database Cloud & Shield */}
        <g transform="translate(320, 60)" filter="url(#glowDash)">
          <rect x="0" y="0" width="45" height="45" rx="12" fill="#FFFFFF" stroke="#C7D2FE" strokeWidth="1.5" />
          <path d="M12,28 C12,22 18,18 24,20 C27,16 34,18 35,22 C38,22 40,26 38,30 C36,32 14,32 12,28 Z" fill="#818CF8" />
        </g>
      </svg>
    </div>
  );
}
