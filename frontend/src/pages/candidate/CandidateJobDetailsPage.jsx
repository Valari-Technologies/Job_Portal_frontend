import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import CandidateLayout from '../../components/candidate/layout/CandidateLayout';
import ResumeRequiredModal from '../../components/candidate/jobs/ResumeRequiredModal';
import { getCandidateJobDetails, toggleSavedCandidateJob, applyCandidateJob } from '../../services/candidate/candidateJobsService';
import { getCandidateResumes } from '../../services/candidate/candidateApplicationsService';
import { 
  ArrowLeft, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  Clock, 
  Bookmark, 
  Zap, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export default function CandidateJobDetailsPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [showResumeRequiredModal, setShowResumeRequiredModal] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadJob() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getCandidateJobDetails(jobId);
        if (isMounted) {
          if (!data) {
            setError('This job posting is no longer available or was removed.');
          } else {
            setJob(data);
          }
        }
      } catch (err) {
        console.error('Failed to load job details:', err);
        if (isMounted) setError('Unable to load job details. Please try again.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadJob();
    return () => { isMounted = false; };
  }, [jobId]);

  const handleToggleSave = async () => {
    if (!job || isSaving) return;
    setIsSaving(true);
    try {
      const res = await toggleSavedCandidateJob(job.id);
      setJob(prev => ({ ...prev, isSaved: res.isSaved }));
    } catch (err) {
      console.error('Failed to save job:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleApply = async () => {
    if (!job || job.hasApplied || isApplying) return;

    try {
      const resumes = await getCandidateResumes();
      if (!resumes || resumes.length === 0) {
        setShowResumeRequiredModal(true);
        return;
      }
    } catch (err) {
      console.warn('Resume check warning:', err);
    }

    setIsApplying(true);
    try {
      const res = await applyCandidateJob(job.id, {
        jobTitle: job.title,
        company: job.company || job.companyName,
        companyName: job.company || job.companyName,
        location: job.location,
        workMode: job.workMode,
        salary: job.salary
      });
      if (res && res.requireResume) {
        setShowResumeRequiredModal(true);
        return;
      }
      if (res && res.success) {
        setJob(prev => ({ ...prev, hasApplied: true }));
      }
    } catch (err) {
      console.error('Failed to apply:', err);
    } finally {
      setIsApplying(false);
    }
  };

  const formatSalary = () => {
    if (!job) return '';
    if (!job.salaryMin && !job.salaryMax && (!job.salary || job.salary === 'Competitive Salary')) return 'Competitive Salary';
    if (job.salary && !job.salary.includes('$') && job.salary !== 'Salary not disclosed') {
      return job.salary;
    }
    const minVal = job.salaryMin;
    const maxVal = job.salaryMax;
    const periodStr = job.salaryPeriod ? `/${job.salaryPeriod}` : '';

    if (minVal && maxVal) {
      if (minVal >= 100000) {
        const minLpa = (minVal / 100000).toLocaleString('en-IN');
        const maxLpa = (maxVal / 100000).toLocaleString('en-IN');
        return `₹${minLpa}L - ₹${maxLpa}L${periodStr}`;
      }
      return `₹${Number(minVal).toLocaleString('en-IN')} - ₹${Number(maxVal).toLocaleString('en-IN')}${periodStr}`;
    } else if (minVal) {
      if (minVal >= 100000) {
        return `₹${(minVal / 100000).toLocaleString('en-IN')}L${periodStr}`;
      }
      return `₹${Number(minVal).toLocaleString('en-IN')}${periodStr}`;
    }
    return job.salary || 'Competitive Salary';
  };

  const getResponsibilitiesList = () => {
    if (!job) return [];
    let items = [];
    if (Array.isArray(job.responsibilities) && job.responsibilities.length > 0) {
      items = job.responsibilities;
    } else if (typeof job.responsibilities === 'string' && job.responsibilities.trim()) {
      items = job.responsibilities.split('\n');
    } else if (Array.isArray(job.responsibilitiesList) && job.responsibilitiesList.length > 0) {
      items = job.responsibilitiesList;
    } else if (Array.isArray(job.requirements) && job.requirements.length > 0) {
      items = job.requirements;
    } else if (typeof job.requirements === 'string' && job.requirements.trim()) {
      items = job.requirements.split('\n');
    } else {
      items = [
        'Design, develop, test, and deploy resilient web applications and software services.',
        'Collaborate with cross-functional teams to translate user and product requirements into technical solutions.',
        'Build responsive, accessible user interfaces and integrate secure RESTful APIs.',
        'Troubleshoot, debug, and optimize application performance across production environments.'
      ];
    }

    return items
      .map(item => typeof item === 'string' ? item.replace(/^[•\-\*\d\.]+\s*/, '').trim() : String(item || '').trim())
      .filter(Boolean);
  };

  if (isLoading) {
    return (
      <CandidateLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
          <div className="h-12 w-12 rounded-full border-4 border-[#3B00FF] border-t-transparent animate-spin" />
          <span className="text-xs font-black text-slate-500">Loading job details...</span>
        </div>
      </CandidateLayout>
    );
  }

  if (error || !job) {
    return (
      <CandidateLayout>
        <div className="p-8 rounded-3xl bg-white border border-red-200 shadow-sm text-center space-y-4 max-w-md mx-auto my-12 font-sans">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
          <h2 className="text-base font-extrabold text-slate-900">Job Unavailable</h2>
          <p className="text-xs font-semibold text-slate-500">{error || "We couldn't find this job."}</p>
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
      <div className="space-y-6 sm:space-y-8 animate-fadeIn font-sans pb-12 max-w-4xl mx-auto">
        
        {/* Back Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/candidate/jobs')}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-extrabold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Jobs</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleSave}
              disabled={isSaving}
              aria-label={job.isSaved ? "Remove saved job" : "Save job"}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                job.isSaved
                  ? 'bg-indigo-50 border-[#3B00FF] text-[#3B00FF]'
                  : 'border-slate-200 text-slate-500 hover:text-[#3B00FF]'
              }`}
            >
              <Bookmark className={`h-4.5 w-4.5 ${job.isSaved ? 'fill-[#3B00FF]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Header Job Info Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-full bg-white border-2 border-black flex items-center justify-center text-slate-900 font-black text-2xl shrink-0 overflow-hidden shadow-xs">
                {job.companyLogo ? (
                  <img src={job.companyLogo} alt={job.company} className="h-full w-full object-cover rounded-full" />
                ) : (
                  <span>{job.companyInitials || (job.company ? job.company.charAt(0).toUpperCase() : 'E')}</span>
                )}
              </div>

              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {job.title}
                </h1>
                <p className="text-xs sm:text-sm font-extrabold text-[#3B00FF]">
                  {job.company}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleApply}
              disabled={job.hasApplied || isApplying}
              className={`px-6 py-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-md ${
                job.hasApplied
                  ? 'bg-slate-100 text-slate-500 border border-slate-200 cursor-default'
                  : 'bg-[#3B00FF] hover:bg-[#3000E0] text-white cursor-pointer active:scale-98 shadow-[#3B00FF]/25 min-h-[44px]'
              }`}
            >
              {job.hasApplied ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Applied</span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 fill-white text-white" />
                  <span>{isApplying ? 'Submitting...' : 'Apply Now'}</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Meta Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-150">
            <div className="space-y-0.5">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Location</span>
              <p className="text-xs font-extrabold text-slate-800 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                <span>{job.location}</span>
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Salary</span>
              <p className="text-xs font-extrabold text-slate-800 flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                <span>{formatSalary()}</span>
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Work Mode</span>
              <p className="text-xs font-extrabold text-slate-800 flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                <span>{job.workMode || 'Full-Time'}</span>
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Experience</span>
              <p className="text-xs font-extrabold text-slate-800 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>{job.experienceMin ? `${job.experienceMin}–${job.experienceMax || job.experienceMin + 2} Yrs` : '3–5 Yrs'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-base font-black text-slate-900">Job Description</h3>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Key Responsibilities */}
          {(() => {
            const responsibilitiesList = getResponsibilitiesList();
            if (!responsibilitiesList || responsibilitiesList.length === 0) return null;
            return (
              <div className="space-y-3 pt-4 border-t border-slate-150">
                <h3 className="text-base font-black text-slate-900">Key Responsibilities</h3>
                <ul className="list-disc pl-5 text-xs sm:text-sm font-semibold text-slate-600 space-y-2">
                  {responsibilitiesList.map((resp, idx) => (
                    <li key={idx} className="leading-relaxed">{resp}</li>
                  ))}
                </ul>
              </div>
            );
          })()}

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-slate-150">
              <h3 className="text-base font-black text-slate-900">Requirements</h3>
              <ul className="list-disc pl-5 text-xs sm:text-sm font-semibold text-slate-600 space-y-1.5">
                {job.requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Required Skills */}
          {job.skills && job.skills.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-slate-150">
              <h3 className="text-base font-black text-slate-900">Required Skills</h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {job.skills.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-xl bg-indigo-50 text-[#3B00FF] text-xs font-black">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Resume Required Centered Modal */}
      <ResumeRequiredModal
        isOpen={showResumeRequiredModal}
        onClose={() => setShowResumeRequiredModal(false)}
        job={job}
      />
    </CandidateLayout>
  );
}
