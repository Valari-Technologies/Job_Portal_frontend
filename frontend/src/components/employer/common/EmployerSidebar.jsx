import { Link } from 'react-router-dom';
import {
  Briefcase,
  FileText,
  Calendar,
  MessageSquare,
  User,
  HelpCircle
} from 'lucide-react';
import logoJobz from '../../../assets/logo-jobz.png';
import { useSidebarCollapse } from '../../shared/navigation/SidebarCollapseContext';
import SidebarCollapseToggle from '../../shared/navigation/SidebarCollapseToggle';
import SidebarTooltip from '../../shared/navigation/SidebarTooltip';

export default function EmployerSidebar({ activeTab }) {
  const { isCollapsed, toggleCollapse } = useSidebarCollapse();

  return (
    <aside 
      className="hidden lg:flex flex-col bg-white border-r border-slate-150 justify-between select-none shrink-0 font-sans transition-all duration-200 ease-in-out h-screen sticky top-0"
      style={{ width: isCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-expanded-width)' }}
    >
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-4.5 border-b border-slate-100 shrink-0">
          {isCollapsed ? (
            <SidebarTooltip text="Open sidebar" positionClass="left-full ml-5 text-slate-800">
              <button 
                type="button"
                aria-label="Open sidebar"
                aria-expanded="false"
                aria-controls="portal-sidebar"
                onClick={toggleCollapse}
                className="h-8 w-auto border-none bg-transparent hover:opacity-85 active:scale-95 transition-all flex items-center justify-center"
                style={{ cursor: 'ew-resize' }}
              >
                <img src={logoJobz} alt="TN Jobz Logo" className="h-8 w-auto object-contain shrink-0" />
              </button>
            </SidebarTooltip>
          ) : (
            <div className="flex items-center gap-2 min-w-0">
              <img src={logoJobz} alt="TN Jobz Logo" className="h-8 w-auto object-contain shrink-0" />
              <span className="text-xl font-black text-slate-800 tracking-tight truncate transition-opacity duration-200">
                State <span className="text-teal-600">Jobz</span>
              </span>
            </div>
          )}
          {!isCollapsed && (
            <div className="shrink-0">
              <SidebarCollapseToggle />
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 space-y-1.5">
          <Link
            to="/employer/overview"
            title={isCollapsed ? "Overview" : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] transition-colors focus:outline-none focus:ring-2 focus:ring-teal-100 ${
              activeTab === 'overview' 
                ? 'bg-teal-600 text-white font-extrabold shadow-md shadow-teal-600/10' 
                : 'font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <Briefcase className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span>Overview</span>}
          </Link>
          <Link
            to="/employer/jobs"
            title={isCollapsed ? "Jobs" : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] transition-colors focus:outline-none focus:ring-2 focus:ring-teal-100 ${
              activeTab === 'jobs' 
                ? 'bg-teal-600 text-white font-extrabold shadow-md shadow-teal-600/10' 
                : 'font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <Briefcase className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span>Jobs</span>}
          </Link>
          <Link
            to="/employer/applications"
            title={isCollapsed ? "Applications" : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] transition-colors focus:outline-none focus:ring-2 focus:ring-teal-100 ${
              activeTab === 'applications' 
                ? 'bg-teal-600 text-white font-extrabold shadow-md shadow-teal-600/10' 
                : 'font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <FileText className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span>Applications</span>}
          </Link>
          <Link
            to="/employer/interviews"
            title={isCollapsed ? "Interviews" : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] transition-colors focus:outline-none focus:ring-2 focus:ring-teal-100 ${
              activeTab === 'interviews' 
                ? 'bg-teal-600 text-white font-extrabold shadow-md shadow-teal-600/10' 
                : 'font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <Calendar className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span>Interviews</span>}
          </Link>
          <Link
            to="/employer/messages"
            title={isCollapsed ? "Messages" : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] transition-colors focus:outline-none focus:ring-2 focus:ring-teal-100 ${
              activeTab === 'messages' 
                ? 'bg-teal-600 text-white font-extrabold shadow-md shadow-teal-600/10' 
                : 'font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span>Messages</span>}
          </Link>
          <Link
            to="/employer/company-profile"
            title={isCollapsed ? "Profile" : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] transition-colors focus:outline-none focus:ring-2 focus:ring-teal-100 ${
              activeTab === 'profile' 
                ? 'bg-teal-600 text-white font-extrabold shadow-md shadow-teal-600/10' 
                : 'font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <User className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span>Company profile</span>}
          </Link>
        </nav>
      </div>

      {/* Support details */}
      <div className="p-3 border-t border-slate-100 mb-2">
        <Link
          to="#"
          title={isCollapsed ? "Support" : undefined}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-100"
        >
          <HelpCircle className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span>Support</span>}
        </Link>
      </div>
    </aside>
  );
}
