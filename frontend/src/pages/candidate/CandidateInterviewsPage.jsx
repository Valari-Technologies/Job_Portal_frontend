import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CandidateLayout from '../../components/candidate/layout/CandidateLayout';
import { useCandidateUser } from '../../context/CandidateUserContext';
import {
  getCandidateInterviews,
  getCandidateInterviewSummary,
  getCandidateNextInterview,
  getInterviewJoinAccess,
  requestInterviewReschedule,
  calculateCountdown,
  getPreparationChecklist,
  togglePreparationItem
} from '../../services/candidate/candidateInterviewsService';
import { getCandidateOnboardingStatus } from '../../services/candidate/candidateOnboardingService';
import {
  ArrowLeft,
  Calendar,
  Video,
  MapPin,
  Clock,
  Building2,
  Timer,
  AlertCircle,
  RotateCcw,
  X,
  Sparkles,
  Check,
  CheckCircle2,
  FileText
} from 'lucide-react';
import ClockTimePicker from '../../components/shared/ClockTimePicker';

export default function CandidateInterviewsPage() {
  const navigate = useNavigate();
  const { profile } = useCandidateUser();

  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [interviews, setInterviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [summaryError, setSummaryError] = useState(false);
  const [nextInterview, setNextInterview] = useState(null);

  // Live countdown ticker
  const [countdownText, setCountdownText] = useState('');

  // Preparation checklist initialized lazily
  const [prepChecklist, setPrepChecklist] = useState(() => getPreparationChecklist());

  // Reschedule Modal state
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [rescheduleForm, setRescheduleForm] = useState({
    preferredDate: '',
    preferredTime: '',
    reason: '',
    notes: ''
  });
  const [isSubmittingReschedule, setIsSubmittingReschedule] = useState(false);
  const [rescheduleSuccessMsg, setRescheduleSuccessMsg] = useState('');
  const [rescheduleErrorMsg, setRescheduleErrorMsg] = useState('');

  // Toast notification
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

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

  // 2. Fetch Interviews Data & Summary
  const loadInterviewsData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setSummaryError(false);

    try {
      const [sumData, intData, nextData] = await Promise.all([
        getCandidateInterviewSummary(),
        getCandidateInterviews(),
        getCandidateNextInterview()
      ]);

      if (sumData) {
        setSummary(sumData);
      } else {
        setSummaryError(true);
      }

      const interviewList = intData.interviews || [];
      const activeUpcomingList = interviewList.filter(i => !i.isPast && i.status !== 'COMPLETED' && i.status !== 'CANCELLED');
      setInterviews(interviewList);
      setNextInterview(nextData || (activeUpcomingList.length > 0 ? activeUpcomingList[0] : null));
    } catch (err) {
      console.error('Failed to load candidate interviews:', err);
      setError("We couldn't load your interviews. Please try again.");
      setSummaryError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (isCheckingOnboarding) return;

    async function loadData() {
      setIsLoading(true);
      setError(null);
      setSummaryError(false);

      try {
        const [sumData, intData, nextData] = await Promise.all([
          getCandidateInterviewSummary(),
          getCandidateInterviews(),
          getCandidateNextInterview()
        ]);

        if (isMounted) {
          if (sumData) {
            setSummary(sumData);
          } else {
            setSummaryError(true);
          }
          const interviewList = intData.interviews || [];
          const activeUpcomingList = interviewList.filter(i => !i.isPast && i.status !== 'COMPLETED' && i.status !== 'CANCELLED');
          setInterviews(interviewList);
          setNextInterview(nextData || (activeUpcomingList.length > 0 ? activeUpcomingList[0] : null));
        }
      } catch (err) {
        console.error('Failed to load candidate interviews:', err);
        if (isMounted) {
          setError("We couldn't load your interviews. Please try again.");
          setSummaryError(true);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, [isCheckingOnboarding]);

  // 3. Live countdown timer interval
  useEffect(() => {
    const startsAt = nextInterview?.startsAt;
    if (!startsAt) {
      return;
    }

    const updateTimer = () => {
      const res = calculateCountdown(startsAt);
      const text = typeof res === 'object' && res !== null 
        ? (res.formattedCountdown || (res.isPast ? 'Live Now / In Progress' : 'Starting soon')) 
        : String(res || 'Starting soon');
      setCountdownText(text);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 30000);
    return () => clearInterval(interval);
  }, [nextInterview?.startsAt]);

  // Action: Join Meeting
  const handleJoinMeeting = async (interview) => {
    const meetUrl = interview.meetingLink || interview.joinUrl;
    if (meetUrl && meetUrl !== '#') {
      window.open(meetUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    try {
      const res = await getInterviewJoinAccess(interview.id);
      if (res && res.joinUrl && res.joinUrl !== '#') {
        window.open(res.joinUrl, '_blank', 'noopener,noreferrer');
      } else {
        triggerToast(res?.message || 'Meeting URL is not available yet.');
      }
    } catch {
      triggerToast('Failed to retrieve join access. Please try again.');
    }
  };

  // Action: View Map for In-Person Interview
  const handleViewMap = (interview) => {
    const address = interview.location?.address;
    if (!address) {
      triggerToast('Location details will be shared by the recruiter.');
      return;
    }
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  // Action: Open Reschedule Modal
  const handleOpenReschedule = (interview) => {
    setRescheduleTarget(interview);
    setRescheduleForm({
      preferredDate: '',
      preferredTime: '',
      reason: '',
      notes: ''
    });
    setRescheduleSuccessMsg('');
    setRescheduleErrorMsg('');
    setRescheduleModalOpen(true);
  };

  // Action: Submit Reschedule Request
  const handleSubmitReschedule = async (e) => {
    e.preventDefault();
    if (!rescheduleTarget) return;

    setIsSubmittingReschedule(true);
    setRescheduleErrorMsg('');
    setRescheduleSuccessMsg('');

    try {
      const res = await requestInterviewReschedule(rescheduleTarget.id, rescheduleForm);
      if (res.success) {
        setRescheduleSuccessMsg('Reschedule request submitted successfully!');
        triggerToast('Reschedule request sent to recruiter.');
        setTimeout(() => {
          setRescheduleModalOpen(false);
          loadInterviewsData();
        }, 1200);
      } else {
        setRescheduleErrorMsg(res.message || 'Failed to submit reschedule request.');
      }
    } catch (err) {
      console.error('Error submitting reschedule:', err);
      setRescheduleErrorMsg('Network error. Please try again.');
    } finally {
      setIsSubmittingReschedule(false);
    }
  };

  // Toggle Preparation Checklist items
  const handleTogglePrep = (key) => {
    const updated = togglePreparationItem(key);
    setPrepChecklist(updated);
  };

  if (isCheckingOnboarding) {
    return (
      <CandidateLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 font-sans">
          <div className="h-12 w-12 rounded-full border-4 border-[#3B00FF] border-t-transparent animate-spin" />
          <span className="text-xs font-black text-slate-500">Loading your interviews...</span>
        </div>
      </CandidateLayout>
    );
  }

  const firstName = profile?.firstName || 'Candidate';
  const userAvatar = profile?.avatarUrl;

  return (
    <CandidateLayout>
      <div className="space-y-6 sm:space-y-8 animate-fadeIn font-sans pb-12">
        
        {/* --- TOAST NOTIFICATION --- */}
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 animate-slideDown">
            <div className="bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* --- MOBILE COMPACT HEADER (sm:hidden matching Mobile Navigation & Figma) --- */}
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
              My Interviews
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

        {/* --- DESKTOP TITLE HEADER (hidden sm:block matching screenshot reference) --- */}
        <div className="hidden sm:block space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Interviews
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-500">
            Track and manage your upcoming interview sessions.
          </p>
        </div>

        {/* --- MAIN 2-COLUMN LAYOUT (Left list + Right side panels) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          
          {/* ================= LEFT COLUMN: INTERVIEW SESSIONS LIST ================= */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header row: Green "Upcoming Sessions" + "X Scheduled" count */}
            <div className="flex items-center justify-between pt-1">
              <h2 className="text-xl sm:text-2xl font-black text-[#00C853] tracking-tight">
                Upcoming Sessions
              </h2>

              <span className="text-xs font-bold text-slate-400">
                {isLoading ? (
                  <span className="inline-block h-4 w-16 bg-slate-200 animate-pulse rounded" />
                ) : summaryError ? (
                  '— Scheduled'
                ) : (
                  `${interviews.filter(i => !i.isPast && i.status !== 'COMPLETED' && i.status !== 'CANCELLED').length} Scheduled`
                )}
              </span>
            </div>

            {/* Loading Skeleton */}
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map((n) => (
                  <div key={n} className="h-44 rounded-2xl bg-slate-200 animate-pulse" />
                ))}
              </div>
            ) : error ? (
              /* Error State */
              <div className="p-8 rounded-3xl bg-white border border-red-200 shadow-sm text-center space-y-4 my-4">
                <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
                <h3 className="text-base font-extrabold text-slate-900">We couldn't load your interviews</h3>
                <p className="text-xs font-semibold text-slate-500">{error}</p>
                <button
                  type="button"
                  onClick={loadInterviewsData}
                  className="px-5 py-2.5 rounded-xl bg-[#3B00FF] text-white text-xs font-extrabold flex items-center justify-center gap-2 hover:bg-[#3000E0] mx-auto cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Retry</span>
                </button>
              </div>
            ) : (
              (() => {
                const upcoming = interviews.filter(i => !i.isPast && i.status !== 'COMPLETED' && i.status !== 'CANCELLED');
                const past = interviews.filter(i => i.isPast || i.status === 'COMPLETED');

                const renderCard = (interview, isPastSession) => {
                  const isOnline = interview.isOnline !== undefined 
                    ? interview.isOnline 
                    : (interview.mode === 'ONLINE' || interview.interviewType === 'ONLINE' || Boolean(interview.meetingLink));
                  const dateInfo = interview.dateInfo || {};
                  const isLive = interview.isLive;

                  return (
                    <div
                      key={interview.id}
                      className={`rounded-2xl border p-5 sm:p-6 transition-all duration-200 flex flex-col sm:flex-row items-start gap-4 sm:gap-6 font-sans ${
                        isLive 
                          ? 'border-emerald-400 ring-2 ring-emerald-400/20 shadow-md shadow-emerald-500/10 bg-white' 
                          : isPastSession
                          ? 'border-slate-200 bg-white/90 shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:shadow-md'
                      }`}
                    >
                      {/* Date Badge Box */}
                      <div className={`w-16 sm:w-20 rounded-2xl border p-2.5 sm:p-3 text-center flex flex-col items-center justify-center shrink-0 self-start sm:self-auto ${
                        isLive 
                          ? 'bg-emerald-50/60 border-emerald-200' 
                          : isPastSession
                          ? 'bg-slate-100/70 border-slate-200 text-slate-400'
                          : 'bg-slate-50 border-slate-200/80'
                      }`}>
                        <span className={`text-[10px] font-black uppercase tracking-wider block ${isLive ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {dateInfo.month || 'OCT'}
                        </span>
                        <span className={`text-2xl sm:text-3xl font-black leading-none my-1 block ${isPastSession ? 'text-slate-600' : 'text-slate-900'}`}>
                          {dateInfo.day || '24'}
                        </span>
                        <span className={`text-[11px] font-bold block ${isLive ? 'text-emerald-700 font-black' : isPastSession ? 'text-slate-400' : 'text-slate-500'}`}>
                          {dateInfo.weekday || 'Tue'}
                        </span>
                      </div>

                      {/* Right Details Container */}
                      <div className="space-y-3 min-w-0 flex-1 w-full">
                        
                        {/* Top Line: Round Name + Status Badge */}
                        <div className="flex items-start justify-between gap-3">
                          <h3 className={`text-lg sm:text-xl font-black leading-snug truncate ${isPastSession ? 'text-slate-700' : 'text-slate-900'}`}>
                            {interview.roundName || 'Technical Interview - Round 1'}
                          </h3>

                          <span className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 border ${
                            isPastSession 
                              ? 'bg-slate-100 text-slate-600 border-slate-200' 
                              : (interview.statusConfig?.badgeClass || 'bg-indigo-50 text-[#3B00FF]')
                          }`}>
                            {isPastSession ? 'Completed' : (interview.statusConfig?.label || 'Upcoming')}
                          </span>
                        </div>

                        {/* Company & Job Title Line */}
                        <p className="text-xs sm:text-sm font-bold text-slate-600 flex items-center gap-1.5 truncate">
                          <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                          <span className="truncate">{interview.companyName} - {interview.jobTitle}</span>
                        </p>

                        {/* Mode & Time Line */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold text-slate-500 pt-0.5">
                          {isOnline ? (
                            <div className="flex items-center gap-1.5 text-slate-700">
                              <Video className={`h-4 w-4 shrink-0 ${isLive ? 'text-emerald-500' : isPastSession ? 'text-slate-400' : 'text-[#3B00FF]'}`} />
                              <span className="font-bold">{interview.provider || 'Google Meet Video Call'}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-slate-700">
                              <MapPin className="h-4 w-4 text-[#3B00FF] shrink-0" />
                              <span className="truncate">{interview.location?.address || 'In-Person Location'}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                            <span>{dateInfo.timeRange}</span>
                          </div>
                        </div>

                        {/* Description Paragraph */}
                        {interview.description && (
                          <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed line-clamp-3 pt-1">
                            {interview.description}
                          </p>
                        )}

                        {/* Action Buttons Row */}
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                          {isPastSession ? (
                            <div className="flex flex-wrap items-center gap-3">
                              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 text-xs sm:text-sm font-bold cursor-not-allowed select-none">
                                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                                <span>Meeting Ended</span>
                              </div>
                              <span className="text-xs font-semibold text-slate-400">
                                Session completed • Awaiting recruiter feedback
                              </span>
                            </div>
                          ) : (
                            <>
                              {isOnline ? (
                                <button
                                  type="button"
                                  onClick={() => handleJoinMeeting(interview)}
                                  className={`px-5 py-2.5 rounded-xl text-white text-xs sm:text-sm font-black transition-all shadow-xs cursor-pointer flex items-center gap-2 ${
                                    isLive
                                      ? 'bg-[#00C853] hover:bg-[#00B048] shadow-md shadow-emerald-500/30 ring-2 ring-emerald-400/40 animate-pulse'
                                      : 'bg-[#3B00FF] hover:bg-[#3000D6]'
                                  }`}
                                >
                                  <Video className="h-4 w-4" />
                                  <span>{isLive ? 'Join Interview Now' : 'Join Meeting'}</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleViewMap(interview)}
                                  className="px-5 py-2.5 rounded-xl border border-[#3B00FF] text-[#3B00FF] hover:bg-purple-50 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                                >
                                  View Map
                                </button>
                              )}

                              {interview.canReschedule && (
                                <button
                                  type="button"
                                  onClick={() => handleOpenReschedule(interview)}
                                  className="px-5 py-2.5 rounded-xl border border-emerald-500 text-emerald-600 hover:bg-emerald-50 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                                >
                                  Reschedule
                                </button>
                              )}
                            </>
                          )}
                        </div>

                      </div>

                    </div>
                  );
                };

                return (
                  <div className="space-y-8">
                    {/* 1. Upcoming Interviews List */}
                    {upcoming.length === 0 ? (
                      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 text-center space-y-3 shadow-2xs">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-[#3B00FF] flex items-center justify-center mx-auto">
                          <Calendar className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-base sm:text-lg font-black text-slate-900">No upcoming interviews scheduled</h3>
                          <p className="text-xs font-semibold text-slate-500 max-w-sm mx-auto">
                            You have no pending sessions right now. Recruiter interview invites will appear here.
                          </p>
                        </div>
                        <Link
                          to="/candidate/applications"
                          className="inline-block px-5 py-2.5 rounded-xl bg-[#3B00FF] text-white text-xs font-extrabold shadow-md shadow-[#3B00FF]/20 cursor-pointer"
                        >
                          View Applications
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {upcoming.map(item => renderCard(item, false))}
                      </div>
                    )}

                    {/* 2. Past & Completed Interviews List */}
                    {past.length > 0 && (
                      <div className="pt-4 space-y-4 border-t border-slate-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                              Past Sessions
                            </h2>
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold">
                              {past.length} Completed
                            </span>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {past.map(item => renderCard(item, true))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()
            )}

          </div>

          {/* ================= RIGHT COLUMN: SIDEBAR PANELS ================= */}
          <div className="space-y-6">
            
            {/* --- PANEL 1: NEXT SESSION --- */}
            <div className="rounded-2xl border border-indigo-100 bg-[#EEF2FF]/60 p-5 sm:p-6 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-black text-[#3B00FF]">
                  Next Session
                </h3>
                <Timer className="h-5 w-5 text-[#3B00FF]" />
              </div>

              {nextInterview ? (
                <>
                  {/* Countdown subtitle */}
                  <p className="text-xs font-bold text-slate-600">
                    {typeof countdownText === 'object' && countdownText !== null 
                      ? (countdownText.formattedCountdown || 'Starting soon') 
                      : (countdownText || 'Starting soon')}
                  </p>

                  {/* Preparation checklist items */}
                  <div className="space-y-2.5 pt-1">
                    {/* Item 1: System Check */}
                    <button
                      type="button"
                      onClick={() => handleTogglePrep('systemCheckCompleted')}
                      className="w-full text-left p-3 rounded-xl bg-white border border-slate-200/80 hover:border-slate-300 transition-colors flex items-center justify-between shadow-2xs group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`h-5 w-5 rounded-full flex items-center justify-center text-white shrink-0 ${prepChecklist.systemCheckCompleted ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                          {prepChecklist.systemCheckCompleted ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : null}
                        </div>
                        <span className="text-xs font-bold text-slate-800 group-hover:text-[#3B00FF]">
                          System Check Complete
                        </span>
                      </div>
                    </button>

                    {/* Item 2: Review notes prepared */}
                    <button
                      type="button"
                      onClick={() => handleTogglePrep('reviewNotesPrepared')}
                      className="w-full text-left p-3 rounded-xl bg-white border border-slate-200/80 hover:border-slate-300 transition-colors flex items-center justify-between shadow-2xs group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`h-5 w-5 rounded-full flex items-center justify-center text-white shrink-0 ${prepChecklist.reviewNotesPrepared ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                          {prepChecklist.reviewNotesPrepared ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : <FileText className="h-3 w-3 text-slate-400" />}
                        </div>
                        <span className="text-xs font-bold text-slate-800 group-hover:text-[#3B00FF]">
                          Review notes prepared
                        </span>
                      </div>
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-2 pt-1 text-center py-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-indigo-100 text-slate-700 text-xs font-bold shadow-2xs">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>No upcoming session</span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-500 leading-relaxed px-1">
                    When your next interview is scheduled, live countdown and preparation tasks will activate automatically.
                  </p>
                </div>
              )}
            </div>

            {/* --- PANEL 2: STAY PREPARED --- */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-5 shadow-2xs">
              <div className="flex items-center gap-2 text-slate-900">
                <Sparkles className="h-5 w-5 text-[#3B00FF]" />
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Stay Prepared
                </h3>
              </div>

              <div className="space-y-4">
                {/* Step 1 */}
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-indigo-50 text-[#3B00FF] font-black text-xs flex items-center justify-center shrink-0 mt-0.5 border border-indigo-100">
                    1
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-black text-slate-900">Test your setup</h4>
                    <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">
                      Ensure your camera and microphone are working well before remote calls.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-indigo-50 text-[#3B00FF] font-black text-xs flex items-center justify-center shrink-0 mt-0.5 border border-indigo-100">
                    2
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-black text-slate-900">Review JD carefully</h4>
                    <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">
                      Align your past experiences with the core responsibilities listed.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ================= RESCHEDULE INTERVIEW MODAL ================= */}
        {rescheduleModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-scaleUp border border-slate-100">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-150 pb-3">
                <div className="space-y-0.5">
                  <h3 className="text-lg font-black text-slate-900">
                    Request Reschedule
                  </h3>
                  <p className="text-xs font-bold text-slate-500 truncate">
                    {rescheduleTarget?.roundName} • {rescheduleTarget?.companyName}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setRescheduleModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Feedback messages */}
              {rescheduleSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                  {rescheduleSuccessMsg}
                </div>
              )}
              {rescheduleErrorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-800 text-xs font-bold border border-rose-200">
                  {rescheduleErrorMsg}
                </div>
              )}

              {/* Reschedule Form */}
              <form onSubmit={handleSubmitReschedule} className="space-y-4">
                
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-700 block">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={rescheduleForm.preferredDate}
                    onChange={(e) => setRescheduleForm({ ...rescheduleForm, preferredDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#3B00FF]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-700 block">
                    Preferred Time Slot *
                  </label>
                  <ClockTimePicker
                    value={rescheduleForm.preferredTime || '11:00 AM'}
                    onChange={(newTime) => setRescheduleForm({ ...rescheduleForm, preferredTime: newTime })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-700 block">
                    Reason for Reschedule *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Briefly state why you need to reschedule..."
                    value={rescheduleForm.reason}
                    onChange={(e) => setRescheduleForm({ ...rescheduleForm, reason: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#3B00FF] resize-none"
                  />
                </div>

                {/* Submit Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setRescheduleModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmittingReschedule}
                    className="px-5 py-2 rounded-xl bg-[#3B00FF] text-white text-xs font-extrabold hover:bg-[#3000D6] disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    {isSubmittingReschedule ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

      </div>
    </CandidateLayout>
  );
}
