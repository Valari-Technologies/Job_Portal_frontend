import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CandidateLayout from '../../components/candidate/layout/CandidateLayout';
import { useCandidateUser } from '../../context/CandidateUserContext';
import { 
  getCandidateApplications, 
  getCandidateApplicationSummary,
  getStatusConfig 
} from '../../services/candidate/candidateApplicationsService';
import { getCandidateOnboardingStatus } from '../../services/candidate/candidateOnboardingService';
import { 
  ArrowLeft, 
  FolderKanban, 
  Video, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw,
  Building2,
  ExternalLink
} from 'lucide-react';

export default function CandidateApplicationsPage() {
  const navigate = useNavigate();
  const { profile } = useCandidateUser();

  const [activeTab, setActiveTab] = useState('all');

  const [summary, setSummary] = useState(null); // null means uninitialized/loading, object holds count
  const [summaryError, setSummaryError] = useState(false);

  const [applications, setApplications] = useState([]);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Check Onboarding Guard (Allow direct access)
  useEffect(() => {
    let isMounted = true;
    async function checkGuard() {
      try {
        await getCandidateOnboardingStatus();
        if (isMounted) setIsCheckingOnboarding(false);
      } catch (err) {
        console.error('Failed to verify candidate onboarding status:', err);
        if (isMounted) setIsCheckingOnboarding(false);
      }
    }
    checkGuard();
    return () => { isMounted = false; };
  }, []);

  // 2. Fetch Applications & Summary Metrics from Service Layer
  const loadApplicationsData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setSummaryError(false);

    try {
      const [sumData, appData] = await Promise.all([
        getCandidateApplicationSummary(),
        getCandidateApplications({ tab: activeTab })
      ]);

      if (sumData) {
        setSummary(sumData);
      } else {
        setSummaryError(true);
      }

      setApplications(appData.applications || []);
    } catch (err) {
      console.error('Failed to load candidate applications:', err);
      setError("We couldn't load your applications. Please try again.");
      setSummaryError(true);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    let isMounted = true;
    if (isCheckingOnboarding) return;

    async function loadData() {
      setIsLoading(true);
      setError(null);
      setSummaryError(false);
      try {
        const [sumData, appData] = await Promise.all([
          getCandidateApplicationSummary(),
          getCandidateApplications({ tab: activeTab })
        ]);
        if (isMounted) {
          if (sumData) {
            setSummary(sumData);
          } else {
            setSummaryError(true);
          }
          setApplications(appData.applications || []);
        }
      } catch (err) {
        console.error('Failed to load candidate applications:', err);
        if (isMounted) {
          setError("We couldn't load your applications. Please try again.");
          setSummaryError(true);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, [isCheckingOnboarding, activeTab]);

  // Render Status Badge using central normalized statusConfig
  const renderStatusBadge = (status) => {
    const config = getStatusConfig(status);
    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${config.badgeClass}`}>
        {config.label}
      </span>
    );
  };

  if (isCheckingOnboarding) {
    return (
      <CandidateLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 font-sans">
          <div className="h-12 w-12 rounded-full border-4 border-[#3B00FF] border-t-transparent animate-spin" />
          <span className="text-xs font-black text-slate-500">Loading your applications...</span>
        </div>
      </CandidateLayout>
    );
  }

  const firstName = profile?.firstName || 'Candidate';
  const userAvatar = profile?.avatarUrl;

  return (
    <CandidateLayout>
      <div className="space-y-6 sm:space-y-8 animate-fadeIn font-sans pb-12">
        
        {/* --- MOBILE COMPACT HEADER (Visible on sm:hidden matching Figma/Mobile references) --- */}
        <div className="sm:hidden flex items-center justify-between py-2 border-b border-slate-150">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/candidate/dashboard')}
              aria-label="Go back to dashboard"
              className="p-1.5 text-slate-700 hover:text-[#3B00FF] rounded-xl hover:bg-indigo-50 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5 stroke-[2.5]" />
            </button>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              My Applications
            </h1>
          </div>

          <button
            type="button"
            onClick={() => navigate('/candidate/profile')}
            className="h-9 w-9 rounded-full bg-white border border-black overflow-hidden flex items-center justify-center shrink-0 cursor-pointer"
          >
            {userAvatar ? (
              <img src={userAvatar} alt={firstName} className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs font-black text-slate-900">{firstName.charAt(0)}</span>
            )}
          </button>
        </div>

        {/* --- DESKTOP TITLE HEADER (Visible on sm: and up matching Desktop Reference Image 1) --- */}
        <div className="hidden sm:block space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Applications
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-500">
            Track and manage your job hunt progress.
          </p>
        </div>

        {/* --- SUMMARY METRIC CARDS GRID (Matching Desktop Image 1 & Mobile Figma) --- */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Card 1: TOTAL APPLICATIONS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-2xs space-y-2">
            <span className="text-[10px] sm:text-xs font-black text-indigo-900/60 uppercase tracking-wider">
              Total Applications
            </span>
            {isLoading ? (
              <div className="h-8 w-16 bg-slate-200 animate-pulse rounded-lg" />
            ) : summaryError ? (
              <p className="text-2xl sm:text-4xl font-black text-slate-400">—</p>
            ) : (
              <p className="text-2xl sm:text-4xl font-black text-[#3B00FF]">
                {summary ? summary.totalApplications : 0}
              </p>
            )}
          </div>

          {/* Card 2: INTERVIEWS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-2xs space-y-2">
            <span className="text-[10px] sm:text-xs font-black text-indigo-900/60 uppercase tracking-wider">
              Interviews
            </span>
            {isLoading ? (
              <div className="h-8 w-16 bg-slate-200 animate-pulse rounded-lg" />
            ) : summaryError ? (
              <p className="text-2xl sm:text-4xl font-black text-slate-400">—</p>
            ) : (
              <p className="text-2xl sm:text-4xl font-black text-emerald-600">
                {summary ? summary.interviewsCount : 0}
              </p>
            )}
          </div>

          {/* Card 3: SELECTED */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-2xs space-y-2">
            <span className="text-[10px] sm:text-xs font-black text-indigo-900/60 uppercase tracking-wider">
              Selected
            </span>
            {isLoading ? (
              <div className="h-8 w-16 bg-slate-200 animate-pulse rounded-lg" />
            ) : summaryError ? (
              <p className="text-2xl sm:text-4xl font-black text-slate-400">—</p>
            ) : (
              <p className="text-2xl sm:text-4xl font-black text-[#3B00FF]">
                {summary ? (summary.selectedCount !== undefined ? summary.selectedCount : summary.offersCount) : 0}
              </p>
            )}
          </div>

          {/* Card 4: REJECTED */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-2xs space-y-2">
            <span className="text-[10px] sm:text-xs font-black text-indigo-900/60 uppercase tracking-wider">
              Rejected
            </span>
            {isLoading ? (
              <div className="h-8 w-16 bg-slate-200 animate-pulse rounded-lg" />
            ) : summaryError ? (
              <p className="text-2xl sm:text-4xl font-black text-slate-400">—</p>
            ) : (
              <p className="text-2xl sm:text-4xl font-black text-rose-500">
                {summary ? summary.rejectedCount : 0}
              </p>
            )}
          </div>

        </div>

        {/* --- MOBILE TABS BAR (Matching Mobile Figma/Image 3) --- */}
        <div className="sm:hidden border-b border-slate-200">
          <nav aria-label="Applications filter tabs" className="flex items-center space-x-6 overflow-x-auto scrollbar-none">
            {[
              { id: 'all', label: 'All' },
              { id: 'active', label: 'Active' },
              { id: 'interview', label: `Interview ${summary?.interviewsCount > 0 ? `(${summary.interviewsCount})` : ''}` },
              { id: 'offered', label: 'Offered' }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 text-xs font-black transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'border-[#3B00FF] text-[#3B00FF]'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* --- APPLICATIONS LIST / GRID --- */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-48 rounded-2xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-white border border-red-200 shadow-sm text-center space-y-4 max-w-md mx-auto my-8">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
            <h3 className="text-base font-extrabold text-slate-900">We couldn't load your applications</h3>
            <p className="text-xs font-semibold text-slate-500">{error}</p>
            <button
              type="button"
              onClick={loadApplicationsData}
              className="px-5 py-2.5 rounded-xl bg-[#3B00FF] text-white text-xs font-extrabold flex items-center justify-center gap-2 hover:bg-[#3000E0] mx-auto cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Retry</span>
            </button>
          </div>
        ) : applications.length === 0 ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-4 max-w-lg mx-auto my-8 shadow-2xs">
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-[#3B00FF] flex items-center justify-center mx-auto">
              <FolderKanban className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-black text-slate-900">No applications yet</h3>
              <p className="text-xs font-semibold text-slate-500">
                Jobs you apply for will appear here so you can track your application status.
              </p>
            </div>
            <Link
              to="/candidate/jobs"
              className="inline-block px-5 py-2.5 rounded-xl bg-[#3B00FF] text-white text-xs font-extrabold shadow-md shadow-[#3B00FF]/20 cursor-pointer"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          /* Applications Cards Grid: 3 cols on Desktop (Image 1), 1 col on Mobile (Image 3) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {applications.map((app) => {
              const isInterview = ['INTERVIEW', 'INTERVIEW_SCHEDULED'].includes(app.status) || Boolean(app.interview);
              const isHired = ['HIRED', 'OFFER_ACCEPTED'].includes(app.status);

              return (
                <div
                  key={app.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 transition-all duration-200 hover:shadow-md hover:border-[#3B00FF]/40 flex flex-col justify-between select-none font-sans space-y-4"
                >
                  {/* Top Row: Title + Status Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <h3 className="text-base font-black text-slate-900 leading-snug truncate">
                        {app.jobTitle}
                      </h3>
                      <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5 truncate">
                        <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{app.companyName}</span>
                      </p>
                    </div>

                    <div className="shrink-0 pt-0.5 flex flex-col items-end gap-1">
                      {renderStatusBadge(app.status)}
                      {app.applicationType === 'AI_COPILOT' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[9px] font-black text-amber-700">
                          ✨ AI Copilot
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Interview Special Callout Card (Matches Image 3 Screen) */}
                  {isInterview && (
                    <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[#3B00FF]">
                          <Video className="h-4 w-4 shrink-0" />
                          <span className="text-xs font-black">
                            {app.interview?.isPast || app.interview?.status === 'COMPLETED' ? 'Interview Completed' : 'Interview Scheduled'}
                          </span>
                        </div>
                        {app.interview?.isPast || app.interview?.status === 'COMPLETED' ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-600">Ended</span>
                        ) : null}
                      </div>
                      <p className="text-[11px] font-bold text-slate-600">
                        {app.interview?.scheduledAtFormatted || 'Scheduled'}
                      </p>
                      {app.interview?.isPast || app.interview?.status === 'COMPLETED' ? (
                        <button
                          type="button"
                          onClick={() => navigate('/candidate/interviews')}
                          className="w-full py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer border border-slate-200 shadow-2xs flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          <span>View Interview Details</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => navigate('/candidate/interviews')}
                          className="w-full py-2 rounded-lg bg-[#3B00FF] text-white text-xs font-black hover:bg-[#3000E0] transition-colors cursor-pointer"
                        >
                          Join Meeting
                        </button>
                      )}
                    </div>
                  )}

                  {/* Applied Date & View Details Link */}
                  <div className="pt-3 border-t border-slate-150 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Applied</span>
                      <span className="font-extrabold text-slate-700">
                        {app.appliedAtFormatted}
                      </span>
                    </div>

                    {isHired ? (
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Status</span>
                        <span className="font-black text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Offer Accepted</span>
                        </span>
                      </div>
                    ) : (
                      <Link
                        to={`/candidate/jobs/${app.jobId}`}
                        className="text-xs font-extrabold text-[#3B00FF] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>View Details</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </CandidateLayout>
  );
}
