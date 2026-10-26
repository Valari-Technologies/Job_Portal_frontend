import { Navigate, Outlet } from 'react-router-dom';
import { getAuthItem } from '../../services/auth/adminAuthService';
import { CandidateOnboardingProvider } from '../../context/CandidateOnboardingContext';
import CandidateOnboardingLayout from '../../components/candidate/onboarding/CandidateOnboardingLayout';
import IndustrySelection from '../../components/candidate/onboarding/IndustrySelection';
import SpecializationSelection from '../../components/candidate/onboarding/SpecializationSelection';

export default function CandidateOnboardingPage({ step }) {
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
