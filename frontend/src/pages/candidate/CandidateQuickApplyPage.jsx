import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import CandidateLayout from '../../components/candidate/layout/CandidateLayout';
import ResumeRequiredModal from '../../components/candidate/jobs/ResumeRequiredModal';
import ProfileCompletionRequiredModal from '../../components/candidate/jobs/ProfileCompletionRequiredModal';
import CustomDropdown from '../../components/shared/CustomDropdown';
import { getCandidateJobDetails } from '../../services/candidate/candidateJobsService';
import { getCandidateResumes, submitCandidateApplication } from '../../services/candidate/candidateApplicationsService';
import { ArrowLeft, MoreVertical, FileText, ExternalLink, ArrowRight, AlertCircle, CheckCircle2, Upload } from 'lucide-react';

export default function CandidateQuickApplyPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');

  const [currentCtc, setCurrentCtc] = useState('₹8 LPA');
  const [noticePeriod, setNoticePeriod] = useState('30 Days');
  const [candidateNote, setCandidateNote] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showResumeRequiredModal, setShowResumeRequiredModal] = useState(false);
  const [showProfileCompletionModal, setShowProfileCompletionModal] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(40);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      setErrorMsg(null);
      try {
        const [jobData, resumeList] = await Promise.all([
          getCandidateJobDetails(jobId),
          getCandidateResumes()
        ]);

        if (!isMounted) return;

        if (!jobData) {
          setErrorMsg('This job is no longer available.');
        } else {
          setJob(jobData);
        }

        setResumes(resumeList || []);
        if (resumeList && resumeList.length > 0) {
          setSelectedResumeId(resumeList[0].id);
        }
      } catch (err) {
        console.error('Failed to load application data:', err);
        if (isMounted) setErrorMsg('Unable to load application details.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, [jobId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!job || isSubmitting) return;

    if (job.isExpired) {
      setErrorMsg('The application deadline for this job has passed. New applications are no longer being accepted.');
      return;
    }

    const isSimpleLocal = job.applicationType === 'SIMPLE_LOCAL';
    if (!isSimpleLocal && (!selectedResumeId || resumes.length === 0)) {
      setShowResumeRequiredModal(true);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const payload = {
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        companyInitials: job.companyInitials || (job.company ? job.company.charAt(0) : 'J'),
        resumeId: isSimpleLocal ? null : (selectedResumeId || null),
        applicationType: job.applicationType || 'PROFILE_RESUME',
        currentCtc,
        noticePeriod,
        candidateNote: candidateNote.trim()
      };

      const res = await submitCandidateApplication(payload);

      if (res && res.requireResume) {
        setShowResumeRequiredModal(true);
        return;
      }

      if (res && res.success) {
        navigate('/candidate/applications', { replace: true });
      } else {
        setErrorMsg(res?.message || "We couldn't submit your application. Please try again.");
      }
    } catch (err) {
      console.error('Failed to submit application:', err);
      setErrorMsg("We couldn't submit your application. Please review the details and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <CandidateLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
          <div className="h-12 w-12 rounded-full border-4 border-[#3B00FF] border-t-transparent animate-spin" />
          <span className="text-xs font-black text-slate-500">Preparing application...</span>
        </div>
      </CandidateLayout>
    );
  }

  if (errorMsg && !job) {
    return (
      <CandidateLayout>
        <div className="p-8 rounded-3xl bg-white border border-red-200 shadow-sm text-center space-y-4 max-w-md mx-auto my-12 font-sans">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
          <h2 className="text-base font-extrabold text-slate-900">Application Unavailable</h2>
          <p className="text-xs font-semibold text-slate-500">{errorMsg}</p>
          <Link
            to="/candidate/jobs"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3B00FF] text-white text-xs font-extrabold"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Jobs</span>
          </Link>
        </div>
      </CandidateLayout>
    );
  }

  return (
    <CandidateLayout>
      <div className="space-y-6 animate-fadeIn font-sans max-w-xl mx-auto pb-12">
        
        {/* Header matching Image 2 Screen 3 */}
        <div className="flex items-center justify-between py-2 border-b border-slate-150">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(`/candidate/jobs/${jobId}`)}
              aria-label="Back to Job Details"
              className="p-2 text-slate-700 hover:text-[#3B00FF] rounded-xl hover:bg-indigo-50 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5 stroke-[2.5]" />
            </button>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Quick Apply
            </h1>
          </div>

          <button
            type="button"
            aria-label="Options"
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs font-bold text-red-700 flex items-center gap-2.5">
            <AlertCircle className="h-4.5 w-4.5 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {job?.hasApplied ? (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-emerald-200 text-center space-y-4 shadow-sm">
            <div className="h-14 w-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h2 className="text-lg font-black text-slate-900">Application Already Submitted</h2>
              <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                You have already applied for <span className="font-bold text-slate-800">{job.title}</span> at <span className="font-bold text-slate-800">{job.company}</span>. You can track your interview rounds and application progress under My Applications.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/candidate/applications"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#3B00FF] hover:bg-[#3000E0] text-white text-xs font-black transition-colors shadow-xs"
              >
                View My Applications
              </Link>
              <Link
                to={`/candidate/jobs/${job.id}`}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold transition-colors"
              >
                Job Details
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Select Resume */}
          <div className="space-y-3">
            <h2 className="text-sm sm:text-base font-black text-slate-900">
              Select Resume
            </h2>

            {resumes.length === 0 ? (
              <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-center space-y-3">
                <FileText className="h-8 w-8 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-600">No resumes uploaded yet</p>
                <Link
                  to="/candidate/resume"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3B00FF] text-white text-xs font-black"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>Upload Resume</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {resumes.map((res) => {
                  const isSelected = selectedResumeId === res.id;
                  return (
                    <div
                      key={res.id}
                      onClick={() => setSelectedResumeId(res.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 select-none ${
                        isSelected
                          ? 'bg-white border-2 border-[#3B00FF] shadow-xs ring-2 ring-[#3B00FF]/10'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="h-10 w-10 rounded-xl bg-indigo-50 text-[#3B00FF] flex items-center justify-center shrink-0">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <h3 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                            {res.fileName}
                          </h3>
                          <p className="text-[11px] font-bold text-slate-400">
                            Updated on {res.updatedAt}
                          </p>
                          <a
                            href={res.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#3B00FF] hover:underline pt-0.5"
                          >
                            <span>View Resume</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>

                      <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-[#3B00FF] bg-[#3B00FF] text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && <CheckCircle2 className="h-3.5 w-3.5 fill-white text-[#3B00FF]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 2: Additional Information */}
          <div className="space-y-4 pt-2">
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900">
                Additional Information
              </h2>
              <p className="text-xs font-bold text-slate-400 mt-0.5">
                This job requires a few more details.
              </p>
            </div>

            {/* Current CTC */}
            <div className="space-y-1.5">
              <label htmlFor="current_ctc" className="text-xs font-black text-slate-700">
                Current CTC
              </label>
              <CustomDropdown
                id="current_ctc"
                value={currentCtc}
                onChange={(e) => setCurrentCtc(e.target.value)}
                options={['₹6 LPA', '₹8 LPA', '₹10 LPA', '₹12 LPA', '₹15+ LPA', '$100k', '$120k', '$150k']}
              />
            </div>

            {/* Notice Period */}
            <div className="space-y-1.5">
              <label htmlFor="notice_period" className="text-xs font-black text-slate-700">
                Notice Period
              </label>
              <CustomDropdown
                id="notice_period"
                value={noticePeriod}
                onChange={(e) => setNoticePeriod(e.target.value)}
                options={['Immediate', '15 Days', '30 Days', '60 Days', '90 Days']}
              />
            </div>

            {/* Fit Note */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="fit_note" className="text-xs font-black text-slate-700">
                  Why are you a good fit for this role?
                </label>
                <span className="text-[11px] font-bold text-slate-400">(Optional)</span>
              </div>
              <textarea
                id="fit_note"
                rows={4}
                value={candidateNote}
                onChange={(e) => setCandidateNote(e.target.value)}
                placeholder="Write a short note..."
                className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-xs font-medium text-slate-800 focus:border-[#3B00FF] focus:outline-none placeholder-slate-400"
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="space-y-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting || (resumes.length > 0 && !selectedResumeId)}
              className={`w-full py-3.5 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all shadow-md min-h-[48px] ${
                isSubmitting || (resumes.length > 0 && !selectedResumeId)
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-[#3B00FF] hover:bg-[#3000E0] text-white cursor-pointer active:scale-98 shadow-[#3B00FF]/25'
              }`}
            >
              <span>{isSubmitting ? 'Submitting Application...' : 'Confirm & Apply'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <p className="text-[11px] font-bold text-slate-400 text-center">
              Your application will be sent to the recruiter.
            </p>
          </div>

        </form>
        )}

      </div>

      {/* Resume Required Centered Modal */}
      <ResumeRequiredModal
        isOpen={showResumeRequiredModal}
        onClose={() => setShowResumeRequiredModal(false)}
        job={job}
      />

      {/* Profile Completion Required Centered Modal */}
      <ProfileCompletionRequiredModal
        isOpen={showProfileCompletionModal}
        onClose={() => setShowProfileCompletionModal(false)}
        job={job}
        currentCompletion={profileCompletion}
      />
    </CandidateLayout>
  );
}
