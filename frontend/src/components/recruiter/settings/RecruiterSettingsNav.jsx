import { Link } from 'react-router-dom';
import { User, Bell, Shield, Users } from 'lucide-react';

export default function RecruiterSettingsNav({ activeTab }) {
  const navItems = [
    { id: 'general', label: 'General', icon: User, path: '/recruiter/settings/general' },
    { id: 'notifications', label: 'Notifications', icon: Bell, path: '/recruiter/settings/notifications' },
    { id: 'security', label: 'Security', icon: Shield, path: '/recruiter/settings/security' },
    { id: 'team', label: 'Team', icon: Users, path: '/recruiter/settings/team' },
  ];

  return (
    <div className="w-full md:w-56 shrink-0 font-sans">
      {/* Desktop Vertical Navigation */}
      <nav className="hidden md:flex flex-col space-y-1 border-r border-slate-150 pr-4" aria-label="Settings categories">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600 font-black'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Mobile Horizontal Navigation */}
      <div className="flex md:hidden items-center gap-2 overflow-x-auto pb-2 border-b border-slate-150">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
