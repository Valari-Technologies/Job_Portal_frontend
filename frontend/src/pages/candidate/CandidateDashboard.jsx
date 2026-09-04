import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CandidateLayout from '../../components/candidate/layout/CandidateLayout';
import CandidateGreeting from '../../components/candidate/dashboard/CandidateGreeting';
import CandidateSearch from '../../components/candidate/dashboard/CandidateSearch';
import CandidateProfileCompletion from '../../components/candidate/dashboard/CandidateProfileCompletion';
import RecommendedJobs from '../../components/candidate/dashboard/RecommendedJobs';
import ResumeOptimizationCard from '../../components/candidate/dashboard/ResumeOptimizationCard';
import RecentApplications from '../../components/candidate/dashboard/RecentApplications';
import { getCandidateOnboardingStatus } from '../../services/candidate/candidateOnboardingService';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function CandidateDashboard() {
  const navigate = useNavigate();
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);
  const [onboardingError, setOnboardingError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function checkGuard() {
      try {
        const status = await getCandidateOnboardingStatus();
        if (!isMounted) return;

        // If mandatory onboarding is incomplete, redirect to last incomplete step
        if (!status.isCompleted) {
          if (!status.industry) {
            navigate('/candidate/onboarding/industry', { replace: true });
          } else if (!status.specialization) {
            navigate('/candidate/onboarding/specialization', { replace: true });
          } else {
            navigate('/candidate/onboarding/industry', { replace: true });
          }
          return;
        }

        setIsCheckingOnboarding(false);
      } catch (err) {
        console.error('Failed to check onboarding guard:', err);
        if (isMounted) {
          setOnboardingError('Unable to verify account onboarding status.');
          setIsCheckingOnboarding(false);
        }
      }
    }

    checkGuard();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  if (isCheckingOnboarding) {
    return (
      <CandidateLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
          <div className="h-12 w-12 rounded-full border-4 border-[#3B00FF] border-t-transparent animate-spin" />
          <span className="text-xs font-black text-slate-500">Loading candidate dashboard...</span>
        </div>
      </CandidateLayout>
    );
  }

  if (onboardingError) {
    return (
      <CandidateLayout>
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 rounded-3xl bg-white border border-red-200 shadow-sm text-center space-y-4 max-w-md mx-auto my-12">
          <AlertCircle className="h-10 w-10 text-red-500" />
          <h2 className="text-base font-extrabold text-slate-900">We couldn't load your dashboard</h2>
          <p className="text-xs font-semibold text-slate-500">{onboardingError}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-xl bg-[#3B00FF] text-white text-xs font-extrabold flex items-center gap-2 hover:bg-[#3000E0] transition-colors cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Retry</span>
          </button>
        </div>
      </CandidateLayout>
    );
  }

  return (
    <CandidateLayout>
      <div className="space-y-6 sm:space-y-8 animate-fadeIn font-sans">
        
        {/* Top Header Row on Desktop: Candidate Greeting on Left */}
        <div className="hidden lg:flex lg:flex-row lg:items-center justify-between gap-4">
          <CandidateGreeting />
        </div>

        {/* Responsive Content Grid: Desktop 2 Columns (8 / 4), Mobile Stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          
          {/* Main Left Column (Desktop 8 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6 sm:space-y-8">
            {/* Search Control */}
            <CandidateSearch />

            {/* Mobile Only: Profile Completion Card shown right after search on Mobile as per Mobile reference */}
            <div className="lg:hidden">
              <CandidateProfileCompletion />
            </div>

            {/* Recommended Jobs Section */}
            <RecommendedJobs />
          </div>

          {/* Right Supporting Column (Desktop 4 cols) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6 sm:space-y-8">
            {/* Desktop Only: Profile Completion Card */}
            <div className="hidden lg:block">
              <CandidateProfileCompletion />
            </div>

            {/* Resume Optimization Promotion Card */}
            <ResumeOptimizationCard />

            {/* Recent Applications Card */}
            <RecentApplications />
          </div>

        </div>

      </div>
    </CandidateLayout>
  );
}
