import { useState } from 'react';
import { SidebarCollapseProvider } from '../../shared/navigation/SidebarCollapseContext';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminMobileHeader from './AdminMobileHeader';
import AdminMobileNav from './AdminMobileNav';
import AdminLogoutConfirmationModal from './AdminLogoutConfirmationModal';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

export default function AdminLayout({ searchPlaceholder = "Search anything..." }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine activeTab based on pathname
  let activeTab = 'dashboard';
  if (location.pathname.startsWith('/admin/recruiters/create')) {
    activeTab = 'create-recruiter';
  } else if (location.pathname.startsWith('/admin/recruiters')) {
    activeTab = 'recruiters';
  } else if (location.pathname.startsWith('/admin/activity')) {
    activeTab = 'activity';
  } else if (location.pathname.startsWith('/admin/notifications')) {
    activeTab = 'notifications';
  } else if (location.pathname.startsWith('/admin/profile')) {
    activeTab = 'profile';
  } else if (location.pathname.startsWith('/admin/settings')) {
    activeTab = 'settings';
  }

  const handleLogoutInitiate = (e) => {
    e.preventDefault();
    setLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    setIsLoggingOut(true);
    setLogoutError(null);
    // Simulate short timeout for clean logout navigation matching handlers
    setTimeout(() => {
      setIsLoggingOut(false);
      setLogoutModalOpen(false);
      navigate('/login');
    }, 1000);
  };

  return (
    <SidebarCollapseProvider>
      <div className={`flex h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-805 antialiased ${logoutModalOpen ? 'overflow-hidden' : ''}`}>
        {/* Desktop Sidebar (Fixed) */}
        <AdminSidebar activeTab={activeTab} onLogoutClick={handleLogoutInitiate} />

        {/* Mobile Slide-out Drawer Menu */}
        <div className={`fixed inset-0 z-50 flex lg:hidden transition-all duration-300 ${sidebarOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'}`}>
          <div 
            className={`fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex flex-col bg-[#3B15CA] h-full">
            <AdminSidebar activeTab={activeTab} onLogoutClick={handleLogoutInitiate} />
          </div>
        </div>

        {/* Main Content Pane */}
        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          {/* Mobile top bar layout header */}
          <AdminMobileHeader onToggleMenu={() => setSidebarOpen(!sidebarOpen)} />
          
          {/* Desktop Header */}
          <div className="hidden lg:block">
            <AdminHeader onMobileMenuToggle={() => setSidebarOpen(!sidebarOpen)} searchPlaceholder={searchPlaceholder} />
          </div>

          {/* Scrollable body wrapper */}
          <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6 md:py-8 pb-24 lg:pb-8">
            <div className="mx-auto max-w-7xl">
              <Outlet />
            </div>
          </main>

          {/* Mobile Bottom Navigation Toolbar */}
          <AdminMobileNav activeTab={activeTab} />
        </div>

        {/* Centered Destructive confirmation modal */}
        <AdminLogoutConfirmationModal 
          isOpen={logoutModalOpen}
          onClose={() => setLogoutModalOpen(false)}
          onConfirm={handleLogoutConfirm}
          isLoggingOut={isLoggingOut}
          error={logoutError}
        />
      </div>
    </SidebarCollapseProvider>
  );
}
