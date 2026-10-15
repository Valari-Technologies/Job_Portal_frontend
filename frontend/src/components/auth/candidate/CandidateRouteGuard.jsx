import { Navigate, Outlet } from 'react-router-dom';
import { getAuthItem } from '../../../services/auth/adminAuthService';
import { isCandidateOnboardingCompleted } from '../../../services/candidate/candidateOnboardingService';

export default function CandidateRouteGuard({ children }) {
  const candidateToken = getAuthItem('candidate_access_token');
  const candidateUserStr = getAuthItem('candidate_auth_user');
  let candidateUser = null;
  if (candidateUserStr) {
    try {
      candidateUser = JSON.parse(candidateUserStr);
    } catch {
      candidateUser = null;
    }
  }

  const token = candidateToken;
  const user = candidateUser;
  const role = user?.role || getAuthItem('candidate_auth_role');

  if (!token || !user || role !== 'CANDIDATE') {
    // If Super Admin is logged in, keep them in Super Admin portal
    const saToken = getAuthItem('super_admin_access_token');
    const saRole = getAuthItem('super_admin_auth_role');
    if (saToken && saRole === 'SUPER_ADMIN') {
      return <Navigate to="/super-admin/overview" replace />;
    }

    // If Admin is logged in, keep them in Admin portal
    const adminToken = getAuthItem('admin_access_token');
    const adminRole = getAuthItem('admin_auth_role');
    if (adminToken && adminRole === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    }

    // If HR/Recruiter is logged in, keep them in Recruiter portal
    const hrToken = getAuthItem('public_access_token');
    const hrRole = getAuthItem('public_auth_role');
    if (hrToken && (hrRole === 'HR' || hrRole === 'RECRUITER')) {
      return <Navigate to="/recruiter/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  // If candidate has not completed Industry & Specialization onboarding, redirect them to onboarding flow
  if (!isCandidateOnboardingCompleted()) {
    return <Navigate to="/candidate/onboarding/industry" replace />;
  }

  return children ? children : <Outlet />;
}
