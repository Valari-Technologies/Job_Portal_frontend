import { Shield, LayoutDashboard, Users, UserPlus, Bell, Activity, User, Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSidebarCollapse } from '../../shared/navigation/SidebarCollapseContext';
import SidebarCollapseToggle from '../../shared/navigation/SidebarCollapseToggle';
import SidebarTooltip from '../../shared/navigation/SidebarTooltip';

export default function AdminSidebar({ activeTab, onLogoutClick }) {
  const { isCollapsed, toggleCollapse } = useSidebarCollapse();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4.5 w-4.5 shrink-0" />, path: '/admin/dashboard' },
    { id: 'recruiters', label: 'Recruiters', icon: <Users className="h-4.5 w-4.5 shrink-0" />, path: '/admin/recruiters' },
    { id: 'create-recruiter', label: 'Create Recruiter', icon: <UserPlus className="h-4.5 w-4.5 shrink-0" />, path: '/admin/recruiters/create' },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4.5 w-4.5 shrink-0" />, path: '/admin/notifications' },
    { id: 'activity', label: 'Activity', icon: <Activity className="h-4.5 w-4.5 shrink-0" />, path: '/admin/activity' },
    { id: 'profile', label: 'Profile', icon: <User className="h-4.5 w-4.5 shrink-0" />, path: '/admin/profile' },
    { id: 'settings', label: 'Settings', icon: <Settings className="h-4.5 w-4.5 shrink-0" />, path: '/admin/settings' }
  ];

  return (
    <aside 
      className="hidden lg:flex flex-col bg-gradient-to-b from-[#4A1DDF] via-[#3B15CA] to-[#2B0EAA] text-white justify-between select-none shrink-0 font-sans transition-all duration-200 ease-in-out h-screen sticky top-0"
      style={{ width: isCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-expanded-width)' }}
    >
      <div className="space-y-6 pt-5">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-4.5 min-h-[32px]">
          {isCollapsed ? (
            <SidebarTooltip text="Open sidebar" positionClass="left-full ml-5 text-slate-800">
              <button 
                type="button"
                aria-label="Open sidebar"
                aria-expanded="false"
                aria-controls="portal-sidebar"
                onClick={toggleCollapse}
                className="h-7 w-7 rounded-lg bg-white/10 shrink-0 border-none hover:bg-white/20 transition-all flex items-center justify-center"
                style={{ cursor: 'ew-resize' }}
              >
                <Shield className="h-4 w-4 text-white" />
              </button>
            </SidebarTooltip>
          ) : (
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-7 w-7 flex items-center justify-center rounded-lg bg-white/10 shrink-0">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="text-[17px] font-semibold tracking-wide truncate transition-opacity duration-200">
                Admin Portal
              </span>
            </div>
          )}
          {!isCollapsed && (
            <div className="shrink-0">
              <SidebarCollapseToggle />
            </div>
          )}
        </div>

        {/* Sidebar menus list */}
        <nav className="flex flex-col gap-1.5 px-3">
          {menuItems.map((item) => {
            const isActive = item.id === activeTab;
            return (
              <Link
                key={item.id}
                to={item.path}
                title={isCollapsed ? item.label : undefined}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-[15px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 ${
                  isActive 
                    ? 'bg-white/15 text-white font-semibold' 
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {item.icon}
                  {!isCollapsed && (
                    <span className="truncate transition-opacity duration-200">{item.label}</span>
                  )}
                </div>
                {!isCollapsed && item.badge && (
                  <span className="h-4 px-1.5 min-w-4 flex items-center justify-center rounded-full bg-white/20 text-[9px] font-black text-white leading-none shrink-0">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout button */}
      <div className="p-3 border-t border-white/10 mb-2">
        <button
          onClick={onLogoutClick}
          title={isCollapsed ? "Logout" : undefined}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-medium text-white/70 hover:bg-white/5 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 cursor-pointer text-left border-none bg-transparent"
        >
          <LogOut className="h-4.5 w-4.5 shrink-0" />
          {!isCollapsed && <span className="transition-opacity duration-200">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
