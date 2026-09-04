import { CandidateOnboardingProvider } from '../../context/CandidateOnboardingContext';
import CandidateOnboardingLayout from '../../components/candidate/onboarding/CandidateOnboardingLayout';
import IndustrySelection from '../../components/candidate/onboarding/IndustrySelection';
import SpecializationSelection from '../../components/candidate/onboarding/SpecializationSelection';

export default function CandidateOnboardingPage({ step = 1 }) {
  return (
    <CandidateOnboardingProvider initialStep={step}>
      <CandidateOnboardingLayout>
        {step === 1 ? <IndustrySelection /> : <SpecializationSelection />}
      </CandidateOnboardingLayout>
    </CandidateOnboardingProvider>
  );
}
