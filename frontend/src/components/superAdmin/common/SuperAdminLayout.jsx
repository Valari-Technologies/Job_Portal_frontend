import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SidebarCollapseProvider } from '../../shared/navigation/SidebarCollapseContext';
import SuperAdminSidebar from './SuperAdminSidebar';
import SuperAdminHeader from './SuperAdminHeader';
import SuperAdminMobileDrawer from './SuperAdminMobileDrawer';

export default function SuperAdminLayout({ 
  children, 
  onToast, 
  notifications, 
  setNotifications, 
  onOpenDrawerDetails 
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Find active nav key based on path
  const getActiveItem = () => {
    if (location.pathname.startsWith('/super-admin/admins')) return 'admins';
    if (location.pathname.startsWith('/super-admin/candidates')) return 'candidates';
    if (location.pathname.startsWith('/super-admin/employers')) return 'employers';
    if (location.pathname.startsWith('/super-admin/employer-verification')) return 'employer-verification';
    if (location.pathname.startsWith('/super-admin/job-review')) return 'job-review';
    if (location.pathname.startsWith('/super-admin/categories')) return 'categories';
    if (location.pathname.startsWith('/super-admin/locations')) return 'locations';
    if (location.pathname.startsWith('/super-admin/skills')) return 'skills';
    if (location.pathname.startsWith('/super-admin/reports')) return 'reports';
    if (location.pathname.startsWith('/super-admin/notifications')) return 'notifications';
    if (location.pathname.startsWith('/super-admin/analytics')) return 'analytics';
    if (location.pathname.startsWith('/super-admin/audit-security')) return 'audit';
    return 'overview';
  };

  const activeItem = getActiveItem();

  const handleSidebarItemClick = (id) => {
    if (id === 'overview') {
      navigate('/super-admin/overview');
      return;
    }
    if (id === 'admins') {
      navigate('/super-admin/admins');
      return;
    }
    if (id === 'candidates') {
      navigate('/super-admin/candidates');
      return;
    }
    if (id === 'employers') {
      navigate('/super-admin/employers');
      return;
    }
    if (id === 'employer-verification') {
      navigate('/super-admin/employer-verification');
      return;
    }
    if (id === 'job-review') {
      navigate('/super-admin/job-review');
      return;
    }
    if (id === 'categories') {
      navigate('/super-admin/categories');
      return;
    }
    if (id === 'locations') {
      navigate('/super-admin/locations');
      return;
    }
    if (id === 'skills') {
      navigate('/super-admin/skills');
      return;
    }
    if (id === 'reports') {
      navigate('/super-admin/reports');
      return;
    }
    if (id === 'notifications') {
      navigate('/super-admin/notifications');
      return;
    }
    if (id === 'analytics') {
      navigate('/super-admin/analytics');
      return;
    }
    if (id === 'audit') {
      navigate('/super-admin/audit-security');
      return;
    }
    // Show toast for future modules
    onToast(`This module will be implemented next.`);
  };

  return (
    <SidebarCollapseProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-800 antialiased">
        {/* Desktop Sidebar (Fixed) */}
        <SuperAdminSidebar activeItem={activeItem} onItemClick={handleSidebarItemClick} />

        {/* Mobile Drawer Sidebar */}
        <SuperAdminMobileDrawer 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeItem={activeItem}
          onItemClick={handleSidebarItemClick}
        />

        {/* Main Content Pane */}
        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          {/* Admin Header */}
          <SuperAdminHeader 
            sidebarOpen={sidebarOpen} 
            setSidebarOpen={setSidebarOpen} 
            notifications={notifications}
            setNotifications={setNotifications}
            onOpenDrawerDetails={onOpenDrawerDetails}
          />

          {/* Scrollable View Area */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 py-6 sm:py-8">
            <div className="mx-auto max-w-7xl space-y-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarCollapseProvider>
  );
}
