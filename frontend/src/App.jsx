import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import SuperAdminLayout from './components/superAdmin/common/SuperAdminLayout';
import SuperAdminOverview from './pages/superAdmin/superAdminOverview/SuperAdminOverview';
import SuperAdminCandidates from './pages/superAdmin/superAdminCandidates/SuperAdminCandidates';
import SuperAdminEmployers from './pages/superAdmin/superAdminEmployers/SuperAdminEmployers';
import SuperAdminEmployerVerification from './pages/superAdmin/superAdminEmployerVerification/SuperAdminEmployerVerification';
import SuperAdminJobReview from './pages/superAdmin/superAdminJobReview/SuperAdminJobReview';
import SuperAdminCategories from './pages/superAdmin/superAdminCategories/SuperAdminCategories';
import SuperAdminLocations from './pages/superAdmin/superAdminLocations/SuperAdminLocations';
import SuperAdminSkills from './pages/superAdmin/superAdminSkills/SuperAdminSkills';
import SuperAdminReports from './pages/superAdmin/superAdminReports/SuperAdminReports';
import SuperAdminNotifications from './pages/superAdmin/superAdminNotifications/SuperAdminNotifications';
import SuperAdminAnalytics from './pages/superAdmin/superAdminAnalytics/SuperAdminAnalytics';
import SuperAdminAuditSecurity from './pages/superAdmin/superAdminAuditSecurity/SuperAdminAuditSecurity';
import SuperAdminAdmins from './pages/superAdmin/SuperAdminAdmins';
import SuperAdminCreateAdmin from './pages/superAdmin/SuperAdminCreateAdmin';
import SuperAdminAddCandidate from './pages/superAdmin/SuperAdminAddCandidate';
import SuperAdminAddEmployer from './pages/superAdmin/SuperAdminAddEmployer';
import SuperAdminAddCategory from './pages/superAdmin/SuperAdminAddCategory';
import SuperAdminAddLocation from './pages/superAdmin/SuperAdminAddLocation';
import SuperAdminAddSkill from './pages/superAdmin/SuperAdminAddSkill';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import EmployerOverview from './pages/employer/employerOverview/EmployerOverview';
import EmployerJobs from './pages/employer/employerJobs/EmployerJobs';
import EmployerApplications from './pages/employer/employerApplications/EmployerApplications';
import EmployerInterviews from './pages/employer/employerInterviews/EmployerInterviews';
import EmployerMessages from './pages/employer/employerMessages/EmployerMessages';
import EmployerCompanyProfile from './pages/employer/employerCompanyProfile/EmployerCompanyProfile';
import AdminLayout from './components/admin/common/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRecruiters from './pages/admin/AdminRecruiters';
import AdminCreateRecruiter from './pages/admin/AdminCreateRecruiter';
import AdminActivity from './pages/admin/AdminActivity';
import AdminProfile from './pages/admin/AdminProfile';
import AdminSettings from './pages/admin/AdminSettings';
import { getNotifications } from './pages/superAdmin/superAdminOverview/superAdminOverviewService';

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

  const routeContent = (
    <Routes>
      <Route 
        path="/super-admin/overview" 
        element={
          <SuperAdminOverview 
            globalDetailsRecord={globalDetailsRecord} 
            setGlobalDetailsRecord={setGlobalDetailsRecord}
            onToast={handleToast}
          />
        } 
      />
      <Route 
        path="/super-admin/candidates" 
        element={<SuperAdminCandidates onToast={handleToast} />} 
      />
      <Route 
        path="/super-admin/employers" 
        element={<SuperAdminEmployers />} 
      />
      <Route 
        path="/super-admin/employer-verification" 
        element={<SuperAdminEmployerVerification />} 
      />
      <Route 
        path="/super-admin/job-review" 
        element={<SuperAdminJobReview />} 
      />
      <Route 
        path="/super-admin/categories" 
        element={<SuperAdminCategories />} 
      />
      <Route 
        path="/super-admin/locations" 
        element={<SuperAdminLocations />} 
      />
      <Route 
        path="/super-admin/skills" 
        element={<SuperAdminSkills />} 
      />
      <Route 
        path="/super-admin/reports" 
        element={<SuperAdminReports />} 
      />
      <Route 
        path="/super-admin/notifications" 
        element={<SuperAdminNotifications />} 
      />
      <Route 
        path="/super-admin/analytics" 
        element={<SuperAdminAnalytics />} 
      />
      <Route 
        path="/super-admin/audit-security" 
        element={<SuperAdminAuditSecurity />} 
      />
      <Route 
        path="/super-admin/admins" 
        element={<SuperAdminAdmins />} 
      />
      <Route 
        path="/super-admin/admins/create" 
        element={<SuperAdminCreateAdmin />} 
      />
      <Route 
        path="/super-admin/candidates/create" 
        element={<SuperAdminAddCandidate />} 
      />
      <Route 
        path="/super-admin/employers/create" 
        element={<SuperAdminAddEmployer />} 
      />
      <Route 
        path="/super-admin/categories/create" 
        element={<SuperAdminAddCategory />} 
      />
      <Route 
        path="/super-admin/locations/create" 
        element={<SuperAdminAddLocation />} 
      />
      <Route 
        path="/super-admin/skills/create" 
        element={<SuperAdminAddSkill />} 
      />
      <Route 
        path="/login" 
        element={<Login />} 
      />
      <Route 
        path="/signup" 
        element={<Signup />} 
      />
      <Route 
        path="/employer/overview" 
        element={<EmployerOverview />} 
      />
      <Route 
        path="/employer/jobs" 
        element={<EmployerJobs />} 
      />
      <Route 
        path="/employer/applications" 
        element={<EmployerApplications />} 
      />
      <Route 
        path="/employer/interviews" 
        element={<EmployerInterviews />} 
      />
      <Route 
        path="/employer/messages" 
        element={<EmployerMessages />} 
      />
      <Route 
        path="/employer/company-profile" 
        element={<EmployerCompanyProfile />} 
      />
      
      {/* Persistent Admin Layout routing container */}
      <Route path="/admin" element={<AdminLayout searchPlaceholder="Search recruiters..." />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="recruiters" element={<AdminRecruiters />} />
        <Route path="recruiters/create" element={<AdminCreateRecruiter />} />
        <Route path="activity" element={<AdminActivity />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="settings" element={<AdminSettings />} />
        {/* Support legacy route redirects */}
        <Route path="create-recruiter" element={<Navigate to="/admin/recruiters/create" replace />} />
        <Route 
          path="*" 
          element={
            <div className="flex h-[300px] w-full flex-col items-center justify-center bg-slate-50 font-sans text-center px-4">
              <h1 className="text-2xl font-black text-slate-805">Coming soon</h1>
              <p className="text-sm font-bold text-slate-500 mt-2 max-w-sm">
                This sub-section of the Admin portal will be designed and built later.
              </p>
            </div>
          } 
        />
      </Route>

      {/* Legacy Redirect Routes */}
      <Route path="/dashboard" element={<Navigate to="/super-admin/overview" replace />} />
      <Route path="/dashboard/" element={<Navigate to="/super-admin/overview" replace />} />
      <Route path="/dashboard/profile" element={<Navigate to="/super-admin/overview" replace />} />
      <Route path="/employer/profile" element={<Navigate to="/employer/company-profile" replace />} />
      
      {/* Fallback unknown paths */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
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

      <LayoutWrapper 
        notifications={notifications}
        setNotifications={setNotifications}
        setGlobalDetailsRecord={setGlobalDetailsRecord}
        handleToast={handleToast}
        routeContent={routeContent}
      />
    </BrowserRouter>
  );
}

function LayoutWrapper({ notifications, setNotifications, setGlobalDetailsRecord, handleToast, routeContent }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const isAuthOrEmployerRoute = currentPath === '/login' || 
                                 currentPath === '/signup' || 
                                 currentPath.startsWith('/employer/') ||
                                 currentPath.startsWith('/dashboard') ||
                                 currentPath.startsWith('/admin') || // matches nested admin layout routes cleanly
                                 currentPath === '/';

  if (isAuthOrEmployerRoute) {
    return routeContent;
  }

  return (
    <SuperAdminLayout 
      onToast={handleToast} 
      notifications={notifications}
      setNotifications={setNotifications}
      onOpenDrawerDetails={setGlobalDetailsRecord}
    >
      {routeContent}
    </SuperAdminLayout>
  );
}
