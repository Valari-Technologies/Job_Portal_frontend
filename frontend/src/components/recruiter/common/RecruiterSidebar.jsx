import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Users,
  Calendar,
  CreditCard,
  Building2,
  Settings,
  LogOut,
  User
} from 'lucide-react';
import { useSidebarCollapse } from '../../shared/navigation/SidebarCollapseContext';
import SidebarCollapseToggle from '../../shared/navigation/SidebarCollapseToggle';
import SidebarTooltip from '../../shared/navigation/SidebarTooltip';

export default function RecruiterSidebar({ activeTab }) {
  const { isCollapsed, toggleCollapse } = useSidebarCollapse();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/recruiter/dashboard' },
    { id: 'jobs', label: 'Jobs', icon: Briefcase, path: '/recruiter/jobs' },
    { id: 'applications', label: 'Applications', icon: FileText, path: '/recruiter/applications' },
    { id: 'candidates', label: 'Candidates', icon: Users, path: '/recruiter/candidates' },
    { id: 'interviews', label: 'Interviews', icon: Calendar, path: '/recruiter/interviews' },
    { id: 'payments', label: 'Payments', icon: CreditCard, path: '/recruiter/payments' },
    { id: 'company-profile', label: 'Company Profile', icon: Building2, path: '/recruiter/company-profile' },
  ];

  return (
    <aside 
      className="hidden lg:flex flex-col bg-white border-r border-slate-150 justify-between select-none shrink-0 font-sans transition-all duration-200 ease-in-out h-screen sticky top-0"
      style={{ width: isCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-expanded-width)' }}
    >
      <div className="space-y-5">
        {/* Recruiter Header / Brand Area */}
        <div className="flex items-center justify-between px-4 pt-5 pb-3 border-b border-slate-100 shrink-0">
          {isCollapsed ? (
            <SidebarTooltip text="Open sidebar" positionClass="left-full ml-4 text-slate-800">
              <button 
                type="button"
                aria-label="Open sidebar"
                onClick={toggleCollapse}
                className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 hover:bg-indigo-100 transition-colors"
              >
                <User className="h-5 w-5" />
              </button>
            </SidebarTooltip>
          ) : (
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center shrink-0 overflow-hidden">
                <User className="h-6 w-6 text-slate-500" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-black text-indigo-600 tracking-tight leading-none">Job Portal</h2>
                <span className="text-xs font-bold text-indigo-600/90 tracking-wide block mt-1">Premium Tier</span>
              </div>
            </div>
          )}
          {!isCollapsed && (
            <div className="shrink-0">
              <SidebarCollapseToggle />
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="px-3 space-y-1.5" aria-label="Recruiter navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <Link
                key={item.id}
                to={item.path}
                title={isCollapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-indigo-100 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-700 hover:bg-indigo-50/60 hover:text-indigo-600'
                }`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-white' : 'text-indigo-600'}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Area */}
      <div className="p-3 border-t border-slate-100 space-y-1">
        <Link
          to="/recruiter/settings"
          title={isCollapsed ? "Settings" : undefined}
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
            activeTab === 'settings'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-700 hover:bg-slate-50 hover:text-indigo-600'
          }`}
        >
          <Settings className={`h-4.5 w-4.5 shrink-0 ${activeTab === 'settings' ? 'text-white' : 'text-slate-500'}`} />
          {!isCollapsed && <span>Settings</span>}
        </Link>
        <Link
          to="/login"
          title={isCollapsed ? "Logout" : undefined}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-4.5 w-4.5 shrink-0 text-slate-500" />
          {!isCollapsed && <span>Logout</span>}
        </Link>
      </div>
    </aside>
  );
}
