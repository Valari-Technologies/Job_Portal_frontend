import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

export default function AdminLayout({ 
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
    if (location.pathname.startsWith('/admin/candidates')) return 'candidates';
    if (location.pathname.startsWith('/admin/employers')) return 'employers';
    if (location.pathname.startsWith('/admin/employer-verification')) return 'employer-verification';
    if (location.pathname.startsWith('/admin/job-review')) return 'job-review';
    if (location.pathname.startsWith('/admin/categories')) return 'categories';
    if (location.pathname.startsWith('/admin/locations')) return 'locations';
    if (location.pathname.startsWith('/admin/skills')) return 'skills';
    if (location.pathname.startsWith('/admin/reports')) return 'reports';
    if (location.pathname.startsWith('/admin/notifications')) return 'notifications';
    if (location.pathname.startsWith('/admin/analytics')) return 'analytics';
    if (location.pathname.startsWith('/admin/audit-security')) return 'audit';
    return 'overview';
  };

  const activeItem = getActiveItem();

  const handleSidebarItemClick = (id) => {
    if (id === 'overview') {
      navigate('/admin/overview');
      return;
    }
    if (id === 'candidates') {
      navigate('/admin/candidates');
      return;
    }
    if (id === 'employers') {
      navigate('/admin/employers');
      return;
    }
    if (id === 'employer-verification') {
      navigate('/admin/employer-verification');
      return;
    }
    if (id === 'job-review') {
      navigate('/admin/job-review');
      return;
    }
    if (id === 'categories') {
      navigate('/admin/categories');
      return;
    }
    if (id === 'locations') {
      navigate('/admin/locations');
      return;
    }
    if (id === 'skills') {
      navigate('/admin/skills');
      return;
    }
    if (id === 'reports') {
      navigate('/admin/reports');
      return;
    }
    if (id === 'notifications') {
      navigate('/admin/notifications');
      return;
    }
    if (id === 'analytics') {
      navigate('/admin/analytics');
      return;
    }
    if (id === 'audit') {
      navigate('/admin/audit-security');
      return;
    }
    // Show toast for future modules
    onToast(`This module will be implemented next.`);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-800 antialiased">
      {/* Desktop Sidebar (Fixed) */}
      <div className="hidden lg:block lg:shrink-0 w-64 h-full">
        <AdminSidebar activeItem={activeItem} onItemClick={handleSidebarItemClick} />
      </div>

      {/* Mobile Drawer Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Overlay background */}
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          />
          
          {/* Slide-out Panel */}
          <div className="relative flex w-64 max-w-xs flex-col bg-white h-full transition-transform duration-300">
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => setSidebarOpen(false)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-50 focus:outline-none"
                aria-label="Close menu"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <AdminSidebar activeItem={activeItem} onItemClick={(id) => {
              setSidebarOpen(false);
              handleSidebarItemClick(id);
            }} />
          </div>
        </div>
      )}

      {/* Main Content Pane */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Admin Header */}
        <AdminHeader 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          notifications={notifications}
          setNotifications={setNotifications}
          onOpenDrawerDetails={onOpenDrawerDetails}
        />

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto px-6 py-8">
          <div className="mx-auto max-w-7xl space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
