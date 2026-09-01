import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SidebarCollapseProvider } from '../../shared/navigation/SidebarCollapseContext';
import EmployerSidebar from '../../../components/employer/common/EmployerSidebar';
import EmployerHeader from '../../../components/employer/common/EmployerHeader';
import EmployerMobileHeader from '../../../components/employer/common/EmployerMobileHeader';
import EmployerMobileBottomNav from '../../../components/employer/common/EmployerMobileBottomNav';
import EmployerFab from '../../../components/employer/common/EmployerFab';

export default function EmployerLayout({ children, activeTab, breadcrumbTitle }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <SidebarCollapseProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row text-slate-800 font-sans">
        {/* Desktop Sidebar (Left) */}
        <EmployerSidebar activeTab={activeTab} />

        {/* Main Page Content Container */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Desktop Header */}
          <EmployerHeader breadcrumbTitle={breadcrumbTitle} />

          {/* Mobile Header */}
          <EmployerMobileHeader onToggleMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />

          {/* Mobile Navigation Dropdown Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden bg-white border-b border-slate-200 p-4 space-y-1.5 animate-fadeIn">
              <Link to="/employer/overview" className={`block px-4 py-2.5 rounded-xl text-sm ${activeTab === 'overview' ? 'font-extrabold bg-teal-50 text-teal-700' : 'font-bold text-slate-655 hover:bg-slate-50'}`}>Overview</Link>
              <Link to="/employer/jobs" className={`block px-4 py-2.5 rounded-xl text-sm ${activeTab === 'jobs' ? 'font-extrabold bg-teal-50 text-teal-700' : 'font-bold text-slate-655 hover:bg-slate-50'}`}>Jobs</Link>
              <Link to="/employer/applications" className={`block px-4 py-2.5 rounded-xl text-sm ${activeTab === 'applications' ? 'font-extrabold bg-teal-50 text-teal-700' : 'font-bold text-slate-655 hover:bg-slate-50'}`}>Applications</Link>
              <Link to="/employer/interviews" className={`block px-4 py-2.5 rounded-xl text-sm ${activeTab === 'interviews' ? 'font-extrabold bg-teal-50 text-teal-700' : 'font-bold text-slate-655 hover:bg-slate-50'}`}>Interviews</Link>
              <Link to="/employer/messages" className={`block px-4 py-2.5 rounded-xl text-sm ${activeTab === 'messages' ? 'font-extrabold bg-teal-50 text-teal-700' : 'font-bold text-slate-655 hover:bg-slate-50'}`}>Messages</Link>
              <Link to="/employer/company-profile" className={`block px-4 py-2.5 rounded-xl text-sm ${activeTab === 'profile' ? 'font-extrabold bg-teal-50 text-teal-700' : 'font-bold text-slate-655 hover:bg-slate-50'}`}>Company profile</Link>
            </div>
          )}

          {/* Page Content */}
          {children}

          {/* Mobile Bottom Navigation */}
          <EmployerMobileBottomNav activeTab={activeTab} />

          {/* Mobile Floating Action Button */}
          <EmployerFab />
        </div>
      </div>
    </SidebarCollapseProvider>
  );
}
