import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { SignOutProvider } from './context/SignOutContext';
import { CandidateUserProvider } from './context/CandidateUserContext';
import { RecruiterUserProvider } from './context/RecruiterUserContext';
import { SuperAdminUserProvider } from './context/SuperAdminUserContext';
import SuperAdminRouteGuard from './components/auth/superAdmin/SuperAdminRouteGuard';
import CandidateRouteGuard from './components/auth/candidate/CandidateRouteGuard';
import RecruiterRouteGuard from './components/auth/recruiter/RecruiterRouteGuard';
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
import SuperAdminProfile from './pages/superAdmin/superAdminProfile/SuperAdminProfile';
import SuperAdminAccountSettings from './pages/superAdmin/superAdminAccountSettings/SuperAdminAccountSettings';
import SuperAdminAnalytics from './pages/superAdmin/superAdminAnalytics/SuperAdminAnalytics';
import SuperAdminAuditSecurity from './pages/superAdmin/superAdminAuditSecurity/SuperAdminAuditSecurity';
import SuperAdminAdmins from './pages/superAdmin/SuperAdminAdmins';
import SuperAdminCreateAdmin from './pages/superAdmin/SuperAdminCreateAdmin';
import SuperAdminAddCandidate from './pages/superAdmin/SuperAdminAddCandidate';
import SuperAdminAddEmployer from './pages/superAdmin/SuperAdminAddEmployer';
import SuperAdminAddCategory from './pages/superAdmin/SuperAdminAddCategory';
import SuperAdminAddLocation from './pages/superAdmin/SuperAdminAddLocation';
import SuperAdminAddSkill from './pages/superAdmin/SuperAdminAddSkill';
import AdminPortalLogin from './pages/auth/AdminPortalLogin';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import EmployerOverview from './pages/employer/employerOverview/EmployerOverview';
import EmployerJobs from './pages/employer/employerJobs/EmployerJobs';
import EmployerApplications from './pages/employer/employerApplications/EmployerApplications';
import EmployerInterviews from './pages/employer/employerInterviews/EmployerInterviews';
import EmployerMessages from './pages/employer/employerMessages/EmployerMessages';
import EmployerCompanyProfile from './pages/employer/employerCompanyProfile/EmployerCompanyProfile';
import AdminLayout from './components/admin/common/AdminLayout';
import AdminRouteGuard from './components/auth/admin/AdminRouteGuard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRecruiters from './pages/admin/AdminRecruiters';
import AdminCreateRecruiter from './pages/admin/AdminCreateRecruiter';
import AdminActivity from './pages/admin/AdminActivity';
import AdminProfile from './pages/admin/AdminProfile';
import AdminSettings from './pages/admin/AdminSettings';
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import RecruiterJobs from './pages/recruiter/RecruiterJobs';
import RecruiterCreateJob from './pages/recruiter/RecruiterCreateJob';
import RecruiterSelectPostingPlan from './pages/recruiter/RecruiterSelectPostingPlan';
import RecruiterJobCheckout from './pages/recruiter/RecruiterJobCheckout';
import RecruiterApplications from './pages/recruiter/RecruiterApplications';
import RecruiterApplicationDetails from './pages/recruiter/RecruiterApplicationDetails';
import RecruiterCandidates from './pages/recruiter/RecruiterCandidates';
import RecruiterCandidateDetails from './pages/recruiter/RecruiterCandidateDetails';
import RecruiterInterviews from './pages/recruiter/RecruiterInterviews';
import RecruiterScheduleInterview from './pages/recruiter/RecruiterScheduleInterview';
import RecruiterInterviewDetails from './pages/recruiter/RecruiterInterviewDetails';
import RecruiterPayments from './pages/recruiter/RecruiterPayments';
import RecruiterPaymentPlans from './pages/recruiter/RecruiterPaymentPlans';
import RecruiterPaymentUsage from './pages/recruiter/RecruiterPaymentUsage';
import RecruiterTransactionDetails from './pages/recruiter/RecruiterTransactionDetails';
import RecruiterCompanyProfile from './pages/recruiter/RecruiterCompanyProfile';
import RecruiterEditCompanyProfile from './pages/recruiter/RecruiterEditCompanyProfile';
import RecruiterSettings from './pages/recruiter/RecruiterSettings';
import RecruiterNotifications from './pages/recruiter/RecruiterNotifications';
import RecruiterProfile from './pages/recruiter/RecruiterProfile';
import CandidateOnboardingPage from './pages/candidate/CandidateOnboardingPage';
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import CandidateJobsPage from './pages/candidate/CandidateJobsPage';
import CandidateJobDetailsPage from './pages/candidate/CandidateJobDetailsPage';
import CandidateQuickApplyPage from './pages/candidate/CandidateQuickApplyPage';
import CandidateApplicationsPage from './pages/candidate/CandidateApplicationsPage';
import CandidateInterviewsPage from './pages/candidate/CandidateInterviewsPage';
import CandidateResumePage from './pages/candidate/CandidateResumePage';
import CandidateProfilePage from './pages/candidate/CandidateProfilePage';
import CandidateSettingsPage from './pages/candidate/CandidateSettingsPage';
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
      {/* Super Admin Routes */}
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
        path="/super-admin/profile" 
        element={<SuperAdminProfile />} 
      />
      <Route 
        path="/super-admin/account-settings" 
        element={<SuperAdminAccountSettings />} 
      />
      <Route 
        path="/super-admin/my-profile" 
        element={<Navigate to="/super-admin/profile" replace />} 
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

      {/* Candidate Portal Routes */}
      <Route element={<CandidatePortalWrapper />}>
        <Route path="/candidate" element={<Navigate to="/candidate/dashboard" replace />} />
        <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
        <Route path="/candidate/overview" element={<Navigate to="/candidate/dashboard" replace />} />
        <Route path="/candidate/jobs" element={<CandidateJobsPage />} />
        <Route path="/candidate/jobs/:jobId" element={<CandidateJobDetailsPage />} />
        <Route path="/candidate/jobs/:jobId/apply" element={<CandidateQuickApplyPage />} />
        <Route path="/candidate/applications" element={<CandidateApplicationsPage />} />
        <Route path="/candidate/interviews" element={<CandidateInterviewsPage />} />
        <Route path="/candidate/resume" element={<CandidateResumePage />} />
        <Route path="/candidate/profile" element={<CandidateProfilePage />} />
        <Route path="/candidate/settings" element={<CandidateSettingsPage />} />
      </Route>

      {/* Candidate Onboarding Routes */}
      <Route 
        path="/candidate/onboarding" 
        element={<Navigate to="/candidate/onboarding/industry" replace />} 
      />
      <Route 
        path="/candidate/onboarding/industry" 
        element={<CandidateOnboardingPage step={1} />} 
      />
      <Route 
        path="/candidate/onboarding/specialization" 
        element={<CandidateOnboardingPage step={2} />} 
      />

      {/* Auth Routes */}
      <Route 
        path="/login" 
        element={<Login />} 
      />
      <Route 
        path="/signup" 
        element={<Signup />} 
      />
      <Route 
        path="/forgot-password" 
        element={<ForgotPasswordPage />} 
      />
      <Route 
        path="/reset-password/:uid/:token" 
        element={<ResetPasswordPage />} 
      />

      {/* Employer Routes */}
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
      
      {/* Recruiter Portal Routes */}
      <Route element={<RecruiterPortalWrapper />}>
        <Route path="/recruiter" element={<Navigate to="/recruiter/dashboard" replace />} />
        <Route path="/recruiter/" element={<Navigate to="/recruiter/dashboard" replace />} />
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        <Route path="/recruiter/overview" element={<Navigate to="/recruiter/dashboard" replace />} />
        <Route path="/recruiter/jobs" element={<RecruiterJobs />} />
        <Route path="/recruiter/jobs/create" element={<RecruiterCreateJob />} />
        <Route path="/recruiter/jobs/create/plan" element={<RecruiterSelectPostingPlan />} />
        <Route path="/recruiter/jobs/create/payment" element={<RecruiterJobCheckout />} />
        <Route path="/recruiter/applications" element={<RecruiterApplications />} />
        <Route path="/recruiter/applications/:applicationId" element={<RecruiterApplicationDetails />} />
        <Route path="/recruiter/candidates" element={<RecruiterCandidates />} />
        <Route path="/recruiter/candidates/:candidateId/application/:applicationId" element={<RecruiterCandidateDetails />} />
        <Route path="/recruiter/interviews" element={<RecruiterInterviews />} />
        <Route path="/recruiter/interviews/schedule" element={<RecruiterScheduleInterview />} />
        <Route path="/recruiter/interviews/:interviewId" element={<RecruiterInterviewDetails />} />
        <Route path="/recruiter/payments" element={<RecruiterPayments />} />
        <Route path="/recruiter/payments/plans" element={<RecruiterPaymentPlans />} />
        <Route path="/recruiter/payments/usage" element={<RecruiterPaymentUsage />} />
        <Route path="/recruiter/payments/transactions/:transactionId" element={<RecruiterTransactionDetails />} />
        <Route path="/recruiter/company-profile" element={<RecruiterCompanyProfile />} />
        <Route path="/recruiter/company-profile/edit" element={<RecruiterEditCompanyProfile />} />
        <Route path="/recruiter/settings" element={<RecruiterSettings />} />
        <Route path="/recruiter/settings/general" element={<RecruiterSettings />} />
        <Route path="/recruiter/settings/notifications" element={<RecruiterSettings />} />
        <Route path="/recruiter/settings/security" element={<RecruiterSettings />} />
        <Route path="/recruiter/settings/team" element={<RecruiterSettings />} />
        <Route path="/recruiter/notifications" element={<RecruiterNotifications />} />
        <Route path="/recruiter/profile" element={<RecruiterProfile />} />
        <Route path="/recruiter/my-profile" element={<Navigate to="/recruiter/profile" replace />} />
      </Route>

      {/* Admin Portal Login Route */}
      <Route path="/admin" element={<AdminPortalLogin />} />
      <Route path="/admin/login" element={<Navigate to="/admin" replace />} />

      {/* Persistent Admin Layout routing container */}
      <Route 
        path="/admin/*" 
        element={
          <AdminRouteGuard>
            <AdminLayout searchPlaceholder="Search recruiters..." />
          </AdminRouteGuard>
        }
      >
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

      {/* Legacy & Alias Redirect Routes */}
      <Route path="/superadmin-dashboard" element={<Navigate to="/super-admin/overview" replace />} />
      <Route path="/superadmin-dashboard/*" element={<Navigate to="/super-admin/overview" replace />} />
      <Route path="/super-admin" element={<Navigate to="/super-admin/overview" replace />} />
      <Route path="/super-admin/dashboard" element={<Navigate to="/super-admin/overview" replace />} />
      <Route path="/superadmin" element={<Navigate to="/super-admin/overview" replace />} />
      <Route path="/superadmin/overview" element={<Navigate to="/super-admin/overview" replace />} />

      <Route path="/hr-dashboard" element={<Navigate to="/recruiter/dashboard" replace />} />
      <Route path="/hr-dashboard/*" element={<Navigate to="/recruiter/dashboard" replace />} />
      <Route path="/hr" element={<Navigate to="/recruiter/dashboard" replace />} />
      <Route path="/hr/*" element={<Navigate to="/recruiter/dashboard" replace />} />
      <Route path="/hr/dashboard" element={<Navigate to="/recruiter/dashboard" replace />} />
      <Route path="/recruiter-dashboard" element={<Navigate to="/recruiter/dashboard" replace />} />

      <Route path="/employer-dashboard" element={<Navigate to="/employer/overview" replace />} />
      <Route path="/employer/dashboard" element={<Navigate to="/employer/overview" replace />} />

      <Route path="/candidate-dashboard" element={<Navigate to="/candidate/dashboard" replace />} />
      <Route path="/admin-dashboard" element={<Navigate to="/admin/dashboard" replace />} />

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
      <SignOutProvider>
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
      </SignOutProvider>
    </BrowserRouter>
  );
}

function CandidatePortalWrapper() {
  return (
    <CandidateRouteGuard>
      <CandidateUserProvider>
        <Outlet />
      </CandidateUserProvider>
    </CandidateRouteGuard>
  );
}

function RecruiterPortalWrapper() {
  return (
    <RecruiterRouteGuard>
      <RecruiterUserProvider>
        <Outlet />
      </RecruiterUserProvider>
    </RecruiterRouteGuard>
  );
}

function LayoutWrapper({ notifications, setNotifications, setGlobalDetailsRecord, handleToast, routeContent }) {
  const location = useLocation();
  const currentPath = location.pathname;

  const isSuperAdminRoute = currentPath.startsWith('/super-admin');

  if (isSuperAdminRoute) {
    return (
      <SuperAdminUserProvider>
        <SuperAdminRouteGuard>
          <SuperAdminLayout 
            onToast={handleToast} 
            notifications={notifications}
            setNotifications={setNotifications}
            onOpenDrawerDetails={setGlobalDetailsRecord}
          >
            {routeContent}
          </SuperAdminLayout>
        </SuperAdminRouteGuard>
      </SuperAdminUserProvider>
    );
  }

  return routeContent;
}
