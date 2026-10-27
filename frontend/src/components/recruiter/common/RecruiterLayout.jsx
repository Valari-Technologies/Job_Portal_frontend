import { SidebarCollapseProvider } from '../../shared/navigation/SidebarCollapseContext';
import RecruiterSidebar from './RecruiterSidebar';
import RecruiterHeader from './RecruiterHeader';
import RecruiterMobileHeader from './RecruiterMobileHeader';
import RecruiterMobileNavigation from './RecruiterMobileNavigation';

export default function RecruiterLayout({ children, activeTab }) {
  return (
    <SidebarCollapseProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-800 antialiased">
        {/* Desktop Sidebar (Left - Fixed) */}
        <RecruiterSidebar activeTab={activeTab} />

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          {/* Desktop Header (Pinned Top) */}
          <RecruiterHeader />

          {/* Mobile Header */}
          <RecruiterMobileHeader />

          {/* Scrollable View Area (Only content scrolls) */}
          <main className="flex-1 overflow-y-auto pb-20 lg:pb-8">
            {children}
          </main>

          {/* Mobile Bottom Navigation */}
          <RecruiterMobileNavigation activeTab={activeTab} />
        </div>
      </div>
    </SidebarCollapseProvider>
  );
}
