import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Building, 
  Users, 
  Briefcase, 
  UserCheck, 
  FileText, 
  Clock, 
  BarChart, 
  User, 
  Settings 
} from 'lucide-react';
import logoJobz from '../../assets/logo-jobz.png';

const SIDEBAR_BG = '#8CC63F';
const CORNER_RADIUS = 40;
const PINCH_RATIO = 0.29;
const DIP_HALF_HEIGHT = 30;

function buildWavePath(width, height, activeY, bandHalf) {
  if (!width || !height) return '';

  const r = Math.min(CORNER_RADIUS, height / 4, width);

  if (activeY == null) {
    return `M0,${r} Q0,0 ${r},0 L${width - r},0 Q${width},0 ${width},${r} L${width},${height - r} Q${width},${height} ${width - r},${height} L${r},${height} Q0,${height} 0,${height - r} Z`;
  }

  const pinchX = width * (1 - PINCH_RATIO);
  const topY = Math.max(r, activeY - bandHalf);
  const botY = Math.min(height - r, activeY + bandHalf);
  const midTop = (topY + activeY) / 2;
  const midBot = (activeY + botY) / 2;

  let d = `M0,${r} Q0,0 ${r},0 L${width - r},0 Q${width},0 ${width},${r} `;
  d += `L${width},${topY} `;
  d += `C${width},${midTop} ${pinchX},${midTop} ${pinchX},${activeY} `;
  d += `C${pinchX},${midBot} ${width},${midBot} ${width},${botY} `;
  d += `L${width},${height - r} Q${width},${height} ${width - r},${height} L${r},${height} Q0,${height} 0,${height - r} Z`;

  return d;
}

export default function SuperAdminSidebar() {
  const location = useLocation();
  const asideRef = useRef(null);
  const itemRefs = useRef({});
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [activeY, setActiveY] = useState(null);

  const isRouteActive = (path, end = false) => {
    const current = location.pathname.endsWith('/') && location.pathname.length > 1
      ? location.pathname.slice(0, -1)
      : location.pathname;
    const target = path.endsWith('/') && path.length > 1
      ? path.slice(0, -1)
      : path;
    if (end) {
      return current === target;
    }
    return current.startsWith(target);
  };

  const navItems = [
    { to: '/superadmin-dashboard', icon: Home, end: true, label: 'Dashboard' },
    { to: '/superadmin-dashboard/organizations', icon: Building, end: false, label: 'Organizations' },
    { to: '/superadmin-dashboard/hr-management', icon: Users, end: false, label: 'HR Management' },
    { to: '/superadmin-dashboard/jobs', icon: Briefcase, end: false, label: 'Jobs' },
    { to: '/superadmin-dashboard/candidates', icon: UserCheck, end: false, label: 'Candidates' },
    { to: '/superadmin-dashboard/applications', icon: FileText, end: false, label: 'Applications' },
    { to: '/superadmin-dashboard/activity-logs', icon: Clock, end: false, label: 'Activity Logs' },
    { to: '/superadmin-dashboard/reports', icon: BarChart, end: false, label: 'Reports' },
    { to: '/superadmin-dashboard/profile', icon: User, end: false, label: 'Profile' }
  ];

  const activeTo = isRouteActive('/superadmin-dashboard/settings') 
    ? '/superadmin-dashboard/settings' 
    : navItems.find((item) => isRouteActive(item.to, item.end))?.to;

  useEffect(() => {
    const el = asideRef.current;
    if (!el) return undefined;

    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const measure = () => {
      const aside = asideRef.current;
      const activeEl = activeTo && itemRefs.current[activeTo];
      if (!aside || !activeEl) return;
      const asideRect = aside.getBoundingClientRect();
      const itemRect = activeEl.getBoundingClientRect();
      setActiveY(itemRect.top - asideRect.top + itemRect.height / 2);
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [activeTo, size.height]);

  const bandHalf = size.height ? DIP_HALF_HEIGHT : 0;
  const wavePath = buildWavePath(size.width, size.height, activeY, bandHalf);
  const iconOffset = (size.width * PINCH_RATIO) / 2;

  return (
    <div className="hidden md:flex w-16 md:w-18 min-h-[96vh] flex flex-col items-center select-none shrink-0 relative z-25">
      <img src={logoJobz} alt="Branding Logo" className="w-12 h-12 md:w-14 md:h-14 object-contain mt-3.5 mb-4 cursor-pointer hover:opacity-90 transition-opacity shrink-0" />

      <aside ref={asideRef} className="w-full flex-grow relative flex flex-col items-center justify-start pt-16 pb-12">
        {wavePath && (
          <svg
            className="absolute inset-0 pointer-events-none"
            width={size.width}
            height={size.height}
            viewBox={`0 0 ${size.width} ${size.height}`}
            aria-hidden="true"
          >
            <path
              d={wavePath}
              fill={SIDEBAR_BG}
              style={{ transition: 'd 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
            />
          </svg>
        )}

        <nav className="relative z-20 flex flex-col items-center gap-4">
          {navItems.map((item) => {
            const active = isRouteActive(item.to, item.end);
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                ref={(el) => (itemRefs.current[item.to] = el)}
                to={item.to}
                end={item.end}
                className={`w-10 h-10 md:w-11 md:h-11 flex items-center justify-center transition-all duration-[400ms] cursor-pointer ${
                  active ? 'text-white' : 'text-white/60 hover:text-white'
                }`}
                style={{ transform: active ? `translateX(-${iconOffset}px) scale(1.1)` : undefined }}
                aria-label={item.label}
              >
                <Icon className="w-5 h-5 md:w-6 md:h-6" />
              </NavLink>
            );
          })}
        </nav>

        <div className="relative w-full flex items-center justify-center mt-auto mb-4 z-20">
          <NavLink
            to="/superadmin-dashboard/settings"
            ref={(el) => (itemRefs.current['/superadmin-dashboard/settings'] = el)}
            className={({ isActive }) =>
              `w-10 h-10 md:w-11 md:h-11 flex items-center justify-center transition-all duration-[400ms] cursor-pointer ${
                isActive ? 'text-white' : 'text-white/60 hover:text-white'
              }`
            }
            style={{ transform: isRouteActive('/superadmin-dashboard/settings') ? `translateX(-${iconOffset}px) scale(1.1)` : undefined }}
            aria-label="Settings"
          >
            <Settings className="w-5 h-5 md:w-6 md:h-6" />
          </NavLink>
        </div>
      </aside>
    </div>
  );
}
