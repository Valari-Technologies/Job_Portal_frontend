import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/admin/common/AdminLayout';
import AdminOverview from './pages/admin/adminOverview/AdminOverview';
import AdminCandidates from './pages/admin/adminCandidates/AdminCandidates';
import AdminEmployers from './pages/admin/adminEmployers/AdminEmployers';
import AdminEmployerVerification from './pages/admin/adminEmployerVerification/AdminEmployerVerification';
import AdminJobReview from './pages/admin/adminJobReview/AdminJobReview';
import AdminCategories from './pages/admin/adminCategories/AdminCategories';
import AdminLocations from './pages/admin/adminLocations/AdminLocations';
import AdminSkills from './pages/admin/adminSkills/AdminSkills';
import AdminReports from './pages/admin/adminReports/AdminReports';
import AdminNotifications from './pages/admin/adminNotifications/AdminNotifications';
import AdminAnalytics from './pages/admin/adminAnalytics/AdminAnalytics';
import AdminAuditSecurity from './pages/admin/adminAuditSecurity/AdminAuditSecurity';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import { getNotifications } from './pages/admin/adminOverview/overviewService';

export default function App() {
  const [toastMessage, setToastMessage] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications
  useEffect(() => {
    getNotifications().then(setNotifications);
  }, []);

  const handleToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const [globalDetailsRecord, setGlobalDetailsRecord] = useState(null);

  // Helper check to skip sidebar shell layout wrappers on pure Auth targets like /login, /signup
  const isAuthRoute = window.location.pathname === '/login' || window.location.pathname === '/signup';

  const routeContent = (
    <Routes>
      <Route 
        path="/admin/overview" 
        element={
          <AdminOverview 
            globalDetailsRecord={globalDetailsRecord} 
            setGlobalDetailsRecord={setGlobalDetailsRecord}
            onToast={handleToast}
          />
        } 
      />
      <Route 
        path="/admin/candidates" 
        element={<AdminCandidates onToast={handleToast} />} 
      />
      <Route 
        path="/admin/employers" 
        element={<AdminEmployers />} 
      />
      <Route 
        path="/admin/employer-verification" 
        element={<AdminEmployerVerification />} 
      />
      <Route 
        path="/admin/job-review" 
        element={<AdminJobReview />} 
      />
      <Route 
        path="/admin/categories" 
        element={<AdminCategories />} 
      />
      <Route 
        path="/admin/locations" 
        element={<AdminLocations />} 
      />
      <Route 
        path="/admin/skills" 
        element={<AdminSkills />} 
      />
      <Route 
        path="/admin/reports" 
        element={<AdminReports />} 
      />
      <Route 
        path="/admin/notifications" 
        element={<AdminNotifications />} 
      />
      <Route 
        path="/admin/analytics" 
        element={<AdminAnalytics />} 
      />
      <Route 
        path="/admin/audit-security" 
        element={<AdminAuditSecurity />} 
      />
      <Route 
        path="/login" 
        element={<Login />} 
      />
      <Route 
        path="/signup" 
        element={<Signup />} 
      />
      <Route path="/" element={<Navigate to="/admin/overview" replace />} />
      <Route path="*" element={<Navigate to="/admin/overview" replace />} />
    </Routes>
  );

  return (
    <BrowserRouter>
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 transform animate-slideUp">
          <div className="flex items-center gap-2.5 rounded-xl bg-slate-900 px-4.5 py-3 text-xs font-bold text-white shadow-xl">
            <svg className="h-4.5 w-4.5 text-teal-455" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {isAuthRoute ? (
        routeContent
      ) : (
        /* Main Admin router layout mapping */
        <AdminLayout 
          onToast={handleToast} 
          notifications={notifications}
          setNotifications={setNotifications}
          onOpenDrawerDetails={setGlobalDetailsRecord}
        >
          {routeContent}
        </AdminLayout>
      )}
    </BrowserRouter>
  );
}
