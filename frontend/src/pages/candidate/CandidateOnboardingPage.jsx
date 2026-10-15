import { Navigate, Outlet } from 'react-router-dom';
import { getAuthItem } from '../../services/auth/adminAuthService';
import { CandidateOnboardingProvider } from '../../context/CandidateOnboardingContext';
import CandidateOnboardingLayout from '../../components/candidate/onboarding/CandidateOnboardingLayout';
import IndustrySelection from '../../components/candidate/onboarding/IndustrySelection';
import SpecializationSelection from '../../components/candidate/onboarding/SpecializationSelection';

export default function CandidateOnboardingPage({ step }) {
  // If Super Admin is logged in, redirect them to Super Admin portal
  const saToken = getAuthItem('super_admin_access_token');
  const saRole = getAuthItem('super_admin_auth_role');
  if (saToken && saRole === 'SUPER_ADMIN') {
    return <Navigate to="/super-admin/overview" replace />;
  }

  // If Admin is logged in, redirect to Admin portal
  const adminToken = getAuthItem('admin_access_token');
  const adminRole = getAuthItem('admin_auth_role');
  if (adminToken && adminRole === 'ADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // If HR/Recruiter is logged in, redirect to Recruiter dashboard
  const hrToken = getAuthItem('public_access_token');
  const hrRole = getAuthItem('public_auth_role');
  if (hrToken && (hrRole === 'HR' || hrRole === 'RECRUITER')) {
    return <Navigate to="/recruiter/dashboard" replace />;
  }

  const candidateToken = getAuthItem('candidate_access_token');
  const role = getAuthItem('candidate_auth_role');

  // Candidate must be logged in as CANDIDATE to access onboarding
  if (!candidateToken || role !== 'CANDIDATE') {
    return <Navigate to="/login" replace state={{ role: 'candidate' }} />;
  }

  return (
    <CandidateOnboardingProvider initialStep={step || 1}>
      <CandidateOnboardingLayout>
        {step === 1 ? <IndustrySelection /> : step === 2 ? <SpecializationSelection /> : <Outlet />}
      </CandidateOnboardingLayout>
    </CandidateOnboardingProvider>
  );
}
