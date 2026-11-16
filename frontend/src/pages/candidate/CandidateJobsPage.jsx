import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import CandidateLayout from '../../components/candidate/layout/CandidateLayout';
import CandidateJobsHeader from '../../components/candidate/jobs/CandidateJobsHeader';
import CandidateJobsSearch from '../../components/candidate/jobs/CandidateJobsSearch';
import CandidateJobsDesktopFilters from '../../components/candidate/jobs/CandidateJobsDesktopFilters';
import CandidateJobsMobileTabs from '../../components/candidate/jobs/CandidateJobsMobileTabs';
import CandidateJobCard from '../../components/candidate/jobs/CandidateJobCard';
import CandidateJobsMobileFilterSheet from '../../components/candidate/jobs/CandidateJobsMobileFilterSheet';
import CandidateQuickApplyDialog from '../../components/candidate/jobs/CandidateQuickApplyDialog';
import ResumeRequiredModal from '../../components/candidate/jobs/ResumeRequiredModal';
import ProfileCompletionRequiredModal from '../../components/candidate/jobs/ProfileCompletionRequiredModal';
import CandidateJobsEmptyState from '../../components/candidate/jobs/CandidateJobsEmptyState';
import { getCandidateJobs, toggleSavedCandidateJob, applyCandidateJob } from '../../services/candidate/candidateJobsService';
import { getCandidateResumes } from '../../services/candidate/candidateApplicationsService';
import { getCandidateOnboardingStatus } from '../../services/candidate/candidateOnboardingService';
import { useCandidateUser } from '../../context/CandidateUserContext';
import { AlertCircle, RotateCcw, Sparkles, Briefcase, Bookmark } from 'lucide-react';

export default function CandidateJobsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { profile } = useCandidateUser();

  const candidateDistrict = profile?.district || (profile?.location ? profile.location.split(',')[0].trim() : '');
  const candidateState = profile?.state || '';

  // URL state sync
  const currentTab = searchParams.get('tab') || 'for-you';
  const searchQuery = searchParams.get('search') || '';

  const [filters, setFilters] = useState({
    industryId: searchParams.get('industry') || '',
    departmentId: searchParams.get('department') || '',
    location: searchParams.get('location') || '',
    experience: searchParams.get('experience') || '',
    jobType: searchParams.get('jobType') || '',
    workMode: searchParams.get('workMode') || ''
  });

  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [hasRecommendations, setHasRecommendations] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  const [resumeRequiredJob, setResumeRequiredJob] = useState(null);
  const [profileCompletionRequiredData, setProfileCompletionRequiredData] = useState(null);

  // 1. Check Onboarding Guard (Allow direct page access)
  useEffect(() => {
    let isMounted = true;
    async function checkGuard() {
      try {
        await getCandidateOnboardingStatus();
        if (isMounted) setIsCheckingOnboarding(false);
      } catch (err) {
        console.error('Failed to verify onboarding status:', err);
        if (isMounted) setIsCheckingOnboarding(false);
      }
    }
    checkGuard();
    return () => { isMounted = false; };
  }, []);

  // 2. Fetch Jobs based on active tab, search query, and filters
  const fetchJobsData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getCandidateJobs({
        search: searchQuery,
        tab: currentTab,
        candidateDistrict,
        candidateState,
        ...filters
      });
      setJobs(res.jobs || []);
      setHasRecommendations(Boolean(res.hasRecommendations));
    } catch (err) {
      console.error('Failed to fetch candidate jobs:', err);
      setError("We couldn't load jobs. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, currentTab, filters]);

  useEffect(() => {
    let isMounted = true;
    if (isCheckingOnboarding) return;

    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await getCandidateJobs({
          search: searchQuery,
          tab: currentTab,
          candidateDistrict,
          candidateState,
          ...filters
        });
        if (isMounted) {
          setJobs(res.jobs || []);
          setHasRecommendations(Boolean(res.hasRecommendations));
        }
      } catch (err) {
        console.error('Failed to fetch candidate jobs:', err);
        if (isMounted) setError("We couldn't load jobs. Please try again.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, [isCheckingOnboarding, searchQuery, currentTab, filters]);

  // Helper to update URL search params
  const updateUrlParams = (newTab, newSearch, newFilters) => {
    const params = new URLSearchParams();
    if (newTab && newTab !== 'for-you') params.set('tab', newTab);
    if (newSearch) params.set('search', newSearch);
    if (newFilters.industryId) params.set('industry', newFilters.industryId);
    if (newFilters.departmentId) params.set('department', newFilters.departmentId);
    if (newFilters.location) params.set('location', newFilters.location);
    if (newFilters.experience) params.set('experience', newFilters.experience);
    if (newFilters.jobType) params.set('jobType', newFilters.jobType);
    if (newFilters.workMode) params.set('workMode', newFilters.workMode);
    setSearchParams(params, { replace: true });
  };

  const handleSearchChange = (val) => {
    updateUrlParams(currentTab, val, filters);
  };

  const handleTabChange = (tabId) => {
    updateUrlParams(tabId, searchQuery, filters);
  };

  const handleFilterChange = (key, val) => {
    setFilters((prev) => {
      const updated = {
        ...prev,
        [key]: val,
        ...(key === 'industryId' ? { departmentId: '' } : {})
      };
      updateUrlParams(currentTab, searchQuery, updated);
      return updated;
    });
  };

  const handleResetFilters = () => {
    const emptyFilters = {
      industryId: '',
      departmentId: '',
      location: '',
      experience: '',
      jobType: '',
      workMode: ''
    };
    setFilters(emptyFilters);
    updateUrlParams(currentTab, searchQuery, emptyFilters);
  };

  const handleToggleSave = async (jobId) => {
    try {
      const res = await toggleSavedCandidateJob(jobId);
      if (currentTab === 'saved' && !res.isSaved) {
        setJobs(prev => prev.filter(j => String(j.id) !== String(jobId)));
      } else {
        setJobs(prev => prev.map(j => String(j.id) === String(jobId) ? { ...j, isSaved: res.isSaved } : j));
      }
    } catch (err) {
      console.error('Failed to toggle save job:', err);
    }
  };

  const handleInitiateQuickApply = async (job) => {
    // Per PRD Section 7, 9, 23 & 24: Profile completion is NOT required to apply for jobs.
    // Professional jobs require a resume; Simple Local jobs do not require a resume.
    const isSimpleLocal = job?.applicationType === 'SIMPLE_LOCAL';
    if (!isSimpleLocal) {
      try {
        const resumes = await getCandidateResumes();
        if (!resumes || resumes.length === 0) {
          setResumeRequiredJob(job);
          return;
        }
      } catch (err) {
        console.warn('Error checking candidate resumes:', err);
      }
    }
    return await handleQuickApplyConfirm(job);
  };

  const handleQuickApplyConfirm = async (jobOrId) => {
    const jobObj = (typeof jobOrId === 'object' && jobOrId !== null) ? jobOrId : selectedJobForApply;
    const jobId = jobObj?.id || jobOrId;
    const activeResumeId = searchParams.get('resumeId') || sessionStorage.getItem('active_apply_resume_id');
    const payload = {
      jobId,
      resumeId: activeResumeId ? Number(activeResumeId) : undefined,
      jobTitle: jobObj?.title,
      company: jobObj?.company || jobObj?.companyName,
      companyName: jobObj?.company || jobObj?.companyName,
      location: jobObj?.location,
      workMode: jobObj?.workMode,
      salary: jobObj?.salary,
      applicationType: jobObj?.applicationType || 'PROFILE_RESUME'
    };
    const res = await applyCandidateJob(jobId, payload);
    if (res && res.requireResume) {
      setSelectedJobForApply(null);
      setResumeRequiredJob(jobObj);
      return res;
    }
    if (res && res.success) {
      setJobs(prev => prev.map(j => (String(j.id) === String(jobId)) ? { ...j, hasApplied: true } : j));
    }
    return res;
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;
  const hasFilters = activeFilterCount > 0 || Boolean(searchQuery);

  if (isCheckingOnboarding) {
    return (
      <CandidateLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
          <div className="h-12 w-12 rounded-full border-4 border-[#3B00FF] border-t-transparent animate-spin" />
          <span className="text-xs font-black text-slate-500">Loading jobs portal...</span>
        </div>
      </CandidateLayout>
    );
  }

  return (
    <CandidateLayout>
      <div className="space-y-6 sm:space-y-8 animate-fadeIn font-sans pb-8">
        
        {/* Mobile Compact Header with Back Arrow & "Find Your Dream Job" (Visible on sm:hidden) */}
        <div className="sm:hidden">
          <CandidateJobsHeader />
        </div>

        {/* Top Search Control */}
        <CandidateJobsSearch
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onOpenFilterSheet={() => setIsFilterSheetOpen(true)}
          activeFilterCount={activeFilterCount}
        />

        {/* Desktop Filter Panel (Visible on sm: and up matching Desktop Reference Image 1) */}
        <div className="hidden sm:block">
          <CandidateJobsDesktopFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Mobile Discovery Tabs (Visible on sm:hidden matching Mobile Reference Image 2) */}
        <div className="sm:hidden">
          <CandidateJobsMobileTabs
            activeTab={currentTab}
            onTabChange={handleTabChange}
          />
        </div>

        {/* Desktop Discovery Tabs (Visible on sm: and up) */}
        <div className="hidden sm:flex items-center space-x-8 border-b border-slate-200">
          <button
            type="button"
            onClick={() => handleTabChange('for-you')}
            className={`pb-3 text-sm font-black transition-all cursor-pointer border-b-2 flex items-center gap-2 ${
              currentTab !== 'saved'
                ? 'border-[#3B00FF] text-[#3B00FF]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>All Jobs</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('saved')}
            className={`pb-3 text-sm font-black transition-all cursor-pointer border-b-2 flex items-center gap-2 ${
              currentTab === 'saved'
                ? 'border-[#3B00FF] text-[#3B00FF]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bookmark className="h-4 w-4" />
            <span>Saved Jobs</span>
          </button>
        </div>

        {/* Desktop Header & Subtitle (Visible on sm: and up matching Desktop Reference Image 1) */}
        <div className="hidden sm:block space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {currentTab === 'saved'
              ? 'Saved Jobs'
              : hasRecommendations
                ? 'Recommended for You'
                : 'Available Jobs'}
          </h2>
          <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#3B00FF]" />
            <span>
              {currentTab === 'saved'
                ? 'Jobs you have saved to review or apply later'
                : hasRecommendations
                  ? 'Based on your profile match and activity'
                  : candidateDistrict
                    ? `Explore active job opportunities in ${candidateDistrict} and across Tamil Nadu`
                    : 'Explore active job opportunities across Tamil Nadu'}
            </span>
          </p>
        </div>

        {/* Loading Skeleton Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-56 rounded-2xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-white border border-red-200 shadow-sm text-center space-y-4 max-w-md mx-auto my-8">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
            <h3 className="text-base font-extrabold text-slate-900">We couldn't load jobs</h3>
            <p className="text-xs font-semibold text-slate-500">{error}</p>
            <button
              type="button"
              onClick={fetchJobsData}
              className="px-5 py-2.5 rounded-xl bg-[#3B00FF] text-white text-xs font-extrabold flex items-center justify-center gap-2 hover:bg-[#3000E0] mx-auto cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Retry</span>
            </button>
          </div>
        ) : jobs.length === 0 ? (
          <CandidateJobsEmptyState
            tab={currentTab}
            hasFilters={hasFilters}
            onClearFilters={handleResetFilters}
          />
        ) : (
          /* Responsive Job Cards Grid: 1 col on mobile, 2 cols on tablet, 3 cols on large desktop */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job) => (
              <CandidateJobCard
                key={job.id}
                job={job}
                onToggleSave={handleToggleSave}
                onQuickApply={handleInitiateQuickApply}
              />
            ))}
          </div>
        )}

      </div>

      {/* Mobile Bottom Filter Sheet */}
      <CandidateJobsMobileFilterSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        filters={filters}
        onApplyFilters={(newFilters) => {
          setFilters(newFilters);
          updateUrlParams(currentTab, searchQuery, newFilters);
        }}
        onClearFilters={handleResetFilters}
      />

      {/* Quick Apply Confirmation Dialog */}
      <CandidateQuickApplyDialog
        isOpen={Boolean(selectedJobForApply)}
        onClose={() => setSelectedJobForApply(null)}
        job={selectedJobForApply}
        onConfirmApply={handleQuickApplyConfirm}
      />

      {/* Resume Required Centered Modal */}
      <ResumeRequiredModal
        isOpen={Boolean(resumeRequiredJob)}
        onClose={() => setResumeRequiredJob(null)}
        job={resumeRequiredJob}
      />

      {/* Profile Completion Required Centered Modal */}
      <ProfileCompletionRequiredModal
        isOpen={Boolean(profileCompletionRequiredData)}
        onClose={() => setProfileCompletionRequiredData(null)}
        job={profileCompletionRequiredData?.job}
        currentCompletion={profileCompletionRequiredData?.currentCompletion}
      />
    </CandidateLayout>
  );
}
