import { SidebarCollapseProvider } from '../../shared/navigation/SidebarCollapseContext';
import RecruiterSidebar from './RecruiterSidebar';
import RecruiterHeader from './RecruiterHeader';
import RecruiterMobileHeader from './RecruiterMobileHeader';
import RecruiterMobileNavigation from './RecruiterMobileNavigation';

export default function RecruiterLayout({ children, activeTab }) {
  return (
    <SidebarCollapseProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row text-slate-800 font-sans">
        {/* Desktop Sidebar (Left) */}
        <RecruiterSidebar activeTab={activeTab} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Desktop Header */}
          <RecruiterHeader />

          {/* Mobile Header */}
          <RecruiterMobileHeader />

          {/* Page Content */}
          <div className="flex-1 pb-20 lg:pb-8">
            {children}
          </div>

          {/* Mobile Bottom Navigation */}
          <RecruiterMobileNavigation activeTab={activeTab} />
        </div>
      </div>
    </SidebarCollapseProvider>
  );
}
