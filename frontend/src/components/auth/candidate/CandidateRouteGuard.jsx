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
    return <Navigate to="/login" replace state={{ role: 'candidate' }} />;
  }

  // If candidate has not completed Industry & Specialization onboarding, redirect them to onboarding flow
  if (!isCandidateOnboardingCompleted()) {
    return <Navigate to="/candidate/onboarding/industry" replace />;
  }

  return children ? children : <Outlet />;
}
