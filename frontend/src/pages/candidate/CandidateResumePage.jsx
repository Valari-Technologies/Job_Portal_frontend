import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CandidateLayout from '../../components/candidate/layout/CandidateLayout';
import { useCandidateUser } from '../../context/CandidateUserContext';
import {
  getCandidateResumes,
  getJobForResumeTargeting,
  startResumeAnalysis,
  acceptResumeSuggestion,
  rejectResumeSuggestion,
  undoResumeSuggestion,
  createTailoredResumeVersion,
  exportResumeVersion
} from '../../services/candidate/candidateResumeService';
import { getCandidateOnboardingStatus } from '../../services/candidate/candidateOnboardingService';
import {
  ArrowLeft,
  Sparkles,
  Download,
  Edit3,
  RotateCcw,
  X,
  Send,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  FileText,
  Check
} from 'lucide-react';

export default function CandidateResumePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobIdParam = searchParams.get('jobId');

  const { profile } = useCandidateUser();

  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mobile navigation tab ('preview' | 'ai')
  const [activeMobileTab, setActiveMobileTab] = useState('preview');

  // Resume State
  const [resumes, setResumes] = useState([]);
  const [currentResume, setCurrentResume] = useState(null);

  // Job Targeting State
  const [targetJob, setTargetJob] = useState(null);
  const [pastedJd, setPastedJd] = useState('');

  // AI Analysis State
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);

  // Edit Suggestion State
  const [isEditingSuggestion, setIsEditingSuggestion] = useState(false);
  const [editedText, setEditedText] = useState('');

  // Toast State
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // 1. Check Onboarding Guard
  useEffect(() => {
    let isMounted = true;
    async function checkGuard() {
      try {
        const status = await getCandidateOnboardingStatus();
        if (!isMounted) return;
        if (!status.isCompleted) {
          if (!status.industry) {
            navigate('/candidate/onboarding/industry', { replace: true });
          } else {
            navigate('/candidate/onboarding/specialization', { replace: true });
          }
          return;
        }
        setIsCheckingOnboarding(false);
      } catch (err) {
        console.error('Failed to verify candidate onboarding status:', err);
        if (isMounted) setIsCheckingOnboarding(false);
      }
    }
    checkGuard();
    return () => { isMounted = false; };
  }, [navigate]);

  // 2. Fetch Resume & Target Job Data
  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [resumesList, jobData] = await Promise.all([
        getCandidateResumes(),
        jobIdParam ? getJobForResumeTargeting(jobIdParam) : Promise.resolve(null)
      ]);

      setResumes(resumesList || []);
      const selected = resumesList?.[0] || null;
      setCurrentResume(selected);

      if (jobData) {
        setTargetJob(jobData);
      }

      // Initial analysis load
      const initialAnalysisRes = await startResumeAnalysis({
        resumeVersionId: selected?.versionId || 'v1_original',
        jobId: jobData?.id || 'job_techflow_01'
      });

      if (initialAnalysisRes.success) {
        setAnalysis(initialAnalysisRes.analysis);
      }
    } catch (err) {
      console.error('Failed to load candidate resume workspace:', err);
      setError("We couldn't load your resume data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [jobIdParam]);

  useEffect(() => {
    let isMounted = true;
    if (isCheckingOnboarding) return;

    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const [resumesList, jobData] = await Promise.all([
          getCandidateResumes(),
          jobIdParam ? getJobForResumeTargeting(jobIdParam) : Promise.resolve(null)
        ]);

        if (!isMounted) return;
        setResumes(resumesList || []);
        const selected = resumesList?.[0] || null;
        setCurrentResume(selected);

        if (jobData) {
          setTargetJob(jobData);
        }

        const initialAnalysisRes = await startResumeAnalysis({
          resumeVersionId: selected?.versionId || 'v1_original',
          jobId: jobData?.id || 'job_techflow_01'
        });

        if (isMounted && initialAnalysisRes.success) {
          setAnalysis(initialAnalysisRes.analysis);
        }
      } catch (err) {
        console.error('Failed to load candidate resume workspace:', err);
        if (isMounted) setError("We couldn't load your resume data. Please try again.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, [isCheckingOnboarding, jobIdParam]);

  // Action: Trigger new AI analysis
  const handleRunAnalysis = async () => {
    if (!currentResume) return;
    setIsAnalyzing(true);
    try {
      const res = await startResumeAnalysis({
        resumeVersionId: currentResume.versionId,
        jobId: targetJob?.id || null,
        manualJobDescription: pastedJd.trim() || null
      });

      if (res.success) {
        setAnalysis(res.analysis);
        setActiveSuggestionIndex(0);
        triggerToast('AI Resume Analysis updated!');
      }
    } catch (err) {
      console.error('Error running AI analysis:', err);
      triggerToast('Failed to run AI analysis. Please retry.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Action: Apply Suggestion
  const handleApplySuggestion = async (suggestion) => {
    if (!analysis || !currentResume) return;
    const textToApply = isEditingSuggestion ? editedText : suggestion.proposedText;

    try {
      const res = await acceptResumeSuggestion(analysis.analysisId, suggestion.id, textToApply);
      if (res.success) {
        setAnalysis(res.updatedAnalysis);

        // Update current resume draft section text in real time
        const updatedExp = currentResume.sections.experience.map(exp => {
          if (exp.id === suggestion.sectionId) {
            const newBullets = [...exp.bullets];
            newBullets[suggestion.bulletIndex] = textToApply;
            return { ...exp, bullets: newBullets };
          }
          return exp;
        });

        setCurrentResume({
          ...currentResume,
          sections: { ...currentResume.sections, experience: updatedExp }
        });

        setIsEditingSuggestion(false);
        triggerToast('Suggestion applied to Current Draft!');
      }
    } catch (err) {
      console.error('Error applying suggestion:', err);
      triggerToast('Failed to apply suggestion.');
    }
  };

  // Action: Reject Suggestion
  const handleRejectSuggestion = async (suggestionId) => {
    if (!analysis) return;
    try {
      const res = await rejectResumeSuggestion(analysis.analysisId, suggestionId);
      if (res.success) {
        setAnalysis(res.updatedAnalysis);
        triggerToast('Suggestion dismissed.');
      }
    } catch (err) {
      console.error('Error rejecting suggestion:', err);
    }
  };

  // Action: Undo Suggestion
  const handleUndoSuggestion = async (suggestionId) => {
    if (!analysis) return;
    try {
      const res = await undoResumeSuggestion(analysis.analysisId, suggestionId);
      if (res.success) {
        setAnalysis(res.updatedAnalysis);
        triggerToast('Suggestion reset.');
      }
    } catch (err) {
      console.error('Error undoing suggestion:', err);
    }
  };

  // Action: Export Resume
  const handleExport = async () => {
    if (!currentResume) return;
    try {
      await exportResumeVersion(currentResume.versionId);
      triggerToast('Resume document exported successfully!');
    } catch (err) {
      console.error('Error exporting resume:', err);
      triggerToast('Failed to export resume.');
    }
  };

  // Action: Explicit Apply using tailored resume version
  const handleApplyWithTailoredResume = async () => {
    if (!currentResume) return;

    try {
      const targetJobId = targetJob?.id || jobIdParam || 'job_techflow_01';
      const targetJobTitle = targetJob?.title || analysis?.jobTitle || 'Target Role';

      // 1. Create job-specific tailored version
      const tailoredRes = await createTailoredResumeVersion({
        baseVersionId: currentResume.versionId,
        jobId: targetJobId,
        jobTitle: targetJobTitle,
        updatedSections: currentResume.sections
      });

      if (tailoredRes.success) {
        const newVersionId = tailoredRes.tailoredVersion.versionId;
        triggerToast('Tailored resume version saved!');

        // 2. Navigate to Quick Apply page with tailored resume preselected
        navigate(`/candidate/jobs/${targetJobId}/apply?resumeVersionId=${newVersionId}`);
      }
    } catch (err) {
      console.error('Error applying with tailored resume:', err);
      triggerToast('Failed to prepare tailored resume for application.');
    }
  };

  if (isCheckingOnboarding) {
    return (
      <CandidateLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 font-sans">
          <div className="h-12 w-12 rounded-full border-4 border-[#3B00FF] border-t-transparent animate-spin" />
          <span className="text-xs font-black text-slate-500">Loading your resume workspace...</span>
        </div>
      </CandidateLayout>
    );
  }

  const firstName = profile?.firstName || 'Alexandra';
  const userAvatar = profile?.avatarUrl;

  const currentSuggestion = analysis?.suggestions?.[activeSuggestionIndex] || analysis?.suggestions?.[0];

  return (
    <CandidateLayout>
      <div className="space-y-6 sm:space-y-8 animate-fadeIn font-sans pb-12">

        {/* --- TOAST ALERT --- */}
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 animate-slideDown">
            <div className="bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* --- MOBILE COMPACT HEADER (sm:hidden) --- */}
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
              Resume & Portfolio
            </h1>
          </div>

          <button
            type="button"
            onClick={() => navigate('/candidate/profile')}
            className="h-9 w-9 rounded-full bg-indigo-50 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 cursor-pointer"
          >
            {userAvatar ? (
              <img src={userAvatar} alt={firstName} className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs font-black text-[#3B00FF]">{firstName.charAt(0)}</span>
            )}
          </button>
        </div>

        {/* --- DESKTOP TITLE HEADER (hidden sm:block) --- */}
        <div className="hidden sm:block space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Resume & Portfolio
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-500">
            Upload and optimize your resume to get matched with premium job listings.
          </p>
        </div>

        {/* --- MOBILE SEGMENTED CONTROL TABS (sm:hidden) --- */}
        <div className="sm:hidden flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveMobileTab('preview')}
            className={`flex-1 py-2 text-xs font-black rounded-lg transition-all cursor-pointer ${
              activeMobileTab === 'preview'
                ? 'bg-white text-[#3B00FF] shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Current Draft
          </button>

          <button
            type="button"
            onClick={() => setActiveMobileTab('ai')}
            className={`flex-1 py-2 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeMobileTab === 'ai'
                ? 'bg-[#3B00FF] text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Co-pilot</span>
          </button>
        </div>

        {/* --- MAIN 2-COLUMN WORKSPACE GRID --- */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 h-96 bg-slate-200 animate-pulse rounded-2xl" />
            <div className="lg:col-span-5 h-96 bg-slate-200 animate-pulse rounded-2xl" />
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-white border border-red-200 shadow-sm text-center space-y-4 max-w-md mx-auto my-8">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
            <h3 className="text-base font-extrabold text-slate-900">We couldn't load your resume workspace</h3>
            <p className="text-xs font-semibold text-slate-500">{error}</p>
            <button
              type="button"
              onClick={loadInitialData}
              className="px-5 py-2.5 rounded-xl bg-[#3B00FF] text-white text-xs font-extrabold flex items-center justify-center gap-2 hover:bg-[#3000E0] mx-auto cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Retry</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            
            {/* ================= LEFT COLUMN: CURRENT DRAFT PREVIEW ================= */}
            <div className={`lg:col-span-7 space-y-4 ${activeMobileTab === 'preview' ? 'block' : 'hidden sm:block'}`}>
              
              {/* Header: Title + Version Selector + Actions */}
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#3B00FF]" />
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                    Current Draft
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  {/* Version dropdown if multiple */}
                  {resumes.length > 1 && (
                    <select
                      value={currentResume?.versionId || ''}
                      onChange={(e) => {
                        const target = resumes.find(r => r.versionId === e.target.value);
                        if (target) setCurrentResume(target);
                      }}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none"
                    >
                      {resumes.map(r => (
                        <option key={r.versionId} value={r.versionId}>
                          {r.title}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Export Action Button */}
                  <button
                    type="button"
                    onClick={handleExport}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-[#3B00FF] text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Export</span>
                  </button>

                  {/* Edit Action Button */}
                  <button
                    type="button"
                    onClick={() => triggerToast('Structured resume editor opened.')}
                    className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                    title="Edit Resume"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* DOCUMENT PREVIEW SHEET (Matching Reference Screenshot precisely) */}
              <div className="bg-white shadow-md border border-slate-200/80 p-6 sm:p-10 rounded-2xl space-y-6 text-slate-800 font-sans text-xs leading-relaxed max-w-2xl mx-auto overflow-x-hidden">
                
                {/* Resume Header */}
                <div className="text-center space-y-1 border-b border-slate-200 pb-5">
                  <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-widest text-slate-900 uppercase">
                    {currentResume?.candidateName || 'ALEXANDRA CHEN'}
                  </h1>
                  <p className="text-[11px] font-semibold text-slate-500">
                    {currentResume?.contactInfo || 'San Francisco, CA • alex.chen@email.com • (555) 123-4567 • linkedin.com/in/alexc'}
                  </p>
                </div>

                {/* Section: PROFESSIONAL EXPERIENCE */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black tracking-wider text-[#3B00FF] uppercase border-b border-indigo-100 pb-1">
                    PROFESSIONAL EXPERIENCE
                  </h3>

                  {currentResume?.sections?.experience?.map((exp) => (
                    <div key={exp.id} className="space-y-1.5">
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span className="text-sm font-black">{exp.roleTitle}</span>
                        <span className="text-[11px] text-slate-500 font-semibold">{exp.period}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs font-bold text-indigo-700 italic">
                        <span>{exp.companyName}</span>
                        <span className="text-slate-400 not-italic font-normal">{exp.location}</span>
                      </div>

                      <ul className="list-disc list-inside space-y-1.5 text-slate-700 text-xs font-normal pl-1 pt-1">
                        {exp.bullets.map((bullet, idx) => (
                          <li key={idx} className="leading-relaxed">
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Section: CORE COMPETENCIES */}
                <div className="space-y-2 pt-2">
                  <h3 className="text-xs font-black tracking-wider text-[#3B00FF] uppercase border-b border-indigo-100 pb-1">
                    CORE COMPETENCIES
                  </h3>

                  <div className="space-y-1.5 text-xs">
                    <p>
                      <strong className="font-extrabold text-slate-900">Design: </strong>
                      <span className="text-slate-700 font-medium">
                        {currentResume?.sections?.competencies?.design || 'UI/UX Design, Interaction Design, Wireframing, Prototyping, Design Systems, Information Architecture.'}
                      </span>
                    </p>
                    <p>
                      <strong className="font-extrabold text-slate-900">Tools: </strong>
                      <span className="text-slate-700 font-medium">
                        {currentResume?.sections?.competencies?.tools || 'Figma, Sketch, Adobe Creative Suite, Principle, InVision, Basic HTML/CSS/React.'}
                      </span>
                    </p>
                    <p>
                      <strong className="font-extrabold text-slate-900">Research: </strong>
                      <span className="text-slate-700 font-medium">
                        {currentResume?.sections?.competencies?.research || 'Usability Testing, User Interviews, A/B Testing, Persona Development.'}
                      </span>
                    </p>
                  </div>
                </div>

              </div>

            </div>

            {/* ================= RIGHT COLUMN: AI RESUME CO-PILOT ================= */}
            <div className={`lg:col-span-5 space-y-5 ${activeMobileTab === 'ai' ? 'block' : 'hidden sm:block'}`}>
              
              {/* TOP PURPLE BANNER: AI Resume (make it Easy) */}
              <div 
                onClick={handleRunAnalysis}
                className="bg-gradient-to-r from-[#3B00FF] to-[#2E00C7] text-white p-4 sm:p-4.5 rounded-2xl flex items-center justify-between shadow-md cursor-pointer hover:shadow-lg transition-all group"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4.5 w-4.5 text-white" />
                    <h3 className="font-black text-sm sm:text-base tracking-tight">
                      AI Resume (make it Easy)
                    </h3>
                  </div>
                  <p className="text-xs text-white/80 font-medium">
                    Optimize entire document for impact
                  </p>
                </div>

                <div className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0 group-hover:translate-x-0.5 transition-transform">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>

              {/* AI CO-PILOT CARD */}
              <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-2xl space-y-5 shadow-2xs">
                
                {/* Card Header: AI Co-pilot + Context Pill */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4.5 w-4.5 text-[#3B00FF]" />
                    <h3 className="text-base font-black text-slate-900">
                      AI Co-pilot
                    </h3>
                  </div>

                  <span className="bg-indigo-50 text-indigo-700 text-[10px] font-extrabold px-3 py-1 rounded-full border border-indigo-100 truncate max-w-[180px]">
                    Context: {targetJob?.companyName || analysis?.companyName || 'TechFlow'} Role
                  </span>
                </div>

                {/* MATCH SCORE BOX (Matching Screenshot) */}
                <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-2xl flex items-center gap-4">
                  {/* Score SVG Circle Indicator */}
                  <div className="relative h-14 w-14 flex items-center justify-center shrink-0">
                    <svg className="h-full w-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-indigo-200"
                        strokeWidth="3"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-[#3B00FF]"
                        strokeDasharray={`${analysis?.score || 72}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute text-base font-black text-slate-900">
                      {analysis?.score || 72}
                    </span>
                  </div>

                  {/* Score Label & Text */}
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                        MATCH SCORE
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black">
                        {analysis?.scoreLabel || 'Good'}
                      </span>
                    </div>
                    <p className="text-[11px] font-semibold text-slate-500 leading-snug">
                      {analysis?.scoreFeedback || 'Matches standard Senior Designer roles. Add target JD to improve.'}
                    </p>
                  </div>
                </div>

                {/* ACTIVE SUGGESTION SECTION */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-indigo-900/60 uppercase tracking-wider block">
                    ACTIVE SUGGESTION
                  </span>

                  {currentSuggestion ? (
                    <div className="border border-indigo-200 bg-indigo-50/30 p-4 rounded-2xl space-y-3 font-sans">
                      
                      {/* Original Text */}
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-slate-500 block">
                          Original text:
                        </span>
                        <p className="text-xs font-medium text-slate-700 italic bg-white/80 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                          "{currentSuggestion.originalText}"
                        </p>
                      </div>

                      {/* Suggested Improvement */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center gap-1.5 text-[#3B00FF]">
                          <Sparkles className="h-3.5 w-3.5" />
                          <span className="text-xs font-black">Suggested Improvement:</span>
                        </div>

                        {isEditingSuggestion ? (
                          <textarea
                            rows={3}
                            value={editedText}
                            onChange={(e) => setEditedText(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-[#3B00FF] text-xs font-bold text-slate-900 focus:outline-none bg-white"
                          />
                        ) : (
                          <div className="bg-indigo-50/80 p-3 rounded-xl border border-indigo-100 text-xs font-bold text-slate-800 leading-snug">
                            "{currentSuggestion.proposedText}"
                          </div>
                        )}
                      </div>

                      {/* Action Controls */}
                      <div className="flex items-center gap-2 pt-2">
                        {currentSuggestion.status === 'ACCEPTED' ? (
                          <div className="flex items-center justify-between w-full">
                            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                              <Check className="h-4 w-4" /> Applied to Draft
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUndoSuggestion(currentSuggestion.id)}
                              className="text-xs font-bold text-slate-500 hover:text-slate-800 underline cursor-pointer"
                            >
                              Undo
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApplySuggestion(currentSuggestion)}
                              className="flex-1 py-2.5 rounded-xl bg-[#3B00FF] hover:bg-[#3000D6] text-white text-xs font-black transition-colors shadow-xs cursor-pointer text-center"
                            >
                              {isEditingSuggestion ? 'Save & Apply' : 'Apply Change'}
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setIsEditingSuggestion(!isEditingSuggestion);
                                setEditedText(currentSuggestion.proposedText);
                              }}
                              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                              title="Edit proposal before applying"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRunAnalysis()}
                              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                              title="Regenerate suggestion"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRejectSuggestion(currentSuggestion.id)}
                              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                              title="Dismiss suggestion"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>

                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs font-bold text-slate-500">
                      No active suggestions right now.
                    </div>
                  )}

                </div>

                {/* TARGET ROLE / JOB DESCRIPTION TARGETING */}
                <div className="space-y-2 pt-2 border-t border-slate-150">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                    TARGET ROLE
                  </span>

                  <div className="relative">
                    <textarea
                      rows={2}
                      placeholder="Paste Job Description here..."
                      value={pastedJd}
                      onChange={(e) => setPastedJd(e.target.value)}
                      className="w-full p-3 pr-10 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#3B00FF] resize-none bg-slate-50/50"
                    />

                    <button
                      type="button"
                      onClick={handleRunAnalysis}
                      disabled={isAnalyzing}
                      className="absolute right-2.5 bottom-3.5 p-1.5 rounded-lg bg-[#3B00FF] text-white hover:bg-[#3000D6] transition-colors cursor-pointer disabled:opacity-50"
                      title="Analyze Job Description"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Missing Keywords Pills */}
                  {analysis?.missingKeywords && analysis.missingKeywords.length > 0 && (
                    <div className="flex items-center gap-2 pt-1 text-xs">
                      <span className="text-slate-400 font-extrabold text-[11px]">Missing:</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {analysis.missingKeywords.map((kw, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-600 text-[10px] font-extrabold border border-rose-150"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* FINAL ACTION BUTTON */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleApplyWithTailoredResume}
                    className="w-full py-3 rounded-xl bg-[#3B00FF] hover:bg-[#3000D6] text-white text-xs sm:text-sm font-black shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                  >
                    <span>Use This Resume to Apply</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </CandidateLayout>
  );
}
