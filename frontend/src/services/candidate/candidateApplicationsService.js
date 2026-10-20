/**
 * Candidate Applications Service
 * 
 * Handles authenticated candidate job applications, Django DRF response normalization,
 * summary metrics, resume selection, application details, and application withdrawal.
 * 
 * Django API Boundaries:
 * - GET /accounts/candidate/applications/ -> List applications (supports DRF pagination)
 * - GET /accounts/candidate/applications/summary/ -> Fetch application summary counts
 * - POST /accounts/candidate/applications/ -> Submit new job application
 * - GET /accounts/candidate/applications/{id}/ -> Fetch application details
 * - POST /accounts/candidate/applications/{id}/withdraw/ -> Withdraw application
 */

import { authenticatedFetch, getAuthenticatedUser } from '../auth/adminAuthService';

const API_BASE_URL = 'http://127.0.0.1:8000';

/**
 * Status visual mapping for application status codes
 */
export const APPLICATION_STATUS_MAP = {
  APPLIED: {
    label: 'Applied',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    color: '#1D4ED8'
  },
  UNDER_REVIEW: {
    label: 'Under Review',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-200',
    color: '#78350F'
  },
  SHORTLISTED: {
    label: 'Shortlisted',
    badgeClass: 'bg-indigo-100 text-[#3B00FF] border-indigo-200',
    color: '#3B00FF'
  },
  INTERVIEW: {
    label: 'Interview Scheduled',
    badgeClass: 'bg-purple-100 text-[#3B00FF] border-purple-200',
    color: '#3B00FF'
  },
  INTERVIEW_SCHEDULED: {
    label: 'Interview Scheduled',
    badgeClass: 'bg-purple-100 text-[#3B00FF] border-purple-200',
    color: '#3B00FF'
  },
  ACCEPTED: {
    label: 'Selected',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    color: '#065F46'
  },
  SELECTED: {
    label: 'Selected',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    color: '#065F46'
  },
  REJECTED: {
    label: 'Rejected',
    badgeClass: 'bg-red-100 text-red-700 border-red-200',
    color: '#B91C1C'
  },
  WITHDRAWN: {
    label: 'Withdrawn',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    color: '#334155'
  }
};

/**
 * Safe status configuration resolver with neutral fallback for unknown status codes
 */
export function getStatusConfig(status) {
  if (!status) {
    return {
      label: 'Applied',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
      color: '#1D4ED8'
    };
  }

  const normalized = String(status).toUpperCase().replace(/\s+/g, '_');
  if (APPLICATION_STATUS_MAP[normalized]) {
    return APPLICATION_STATUS_MAP[normalized];
  }

  const safeLabel = String(status)
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

  return {
    label: safeLabel,
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    color: '#475569'
  };
}

/**
 * Centralized date formatter
 */
export function formatApplicationDate(dateStr) {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return String(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return '';
  }
}

/**
 * Normalization boundary converting raw Django DRF application data to UI model
 */
export function normalizeApplicationRecord(raw) {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const id = String(raw.id || raw.pk || '');
  const rawStatus = raw.status || 'APPLIED';
  const statusConfig = getStatusConfig(rawStatus);

  const rawJob = raw.job || {};
  const jobId = String(rawJob.id || raw.job_id || '');
  const jobTitle = rawJob.title || raw.job_title || 'Position';

  const companyName = rawJob.company_name || raw.company_name || 'Employer';
  const companyLogo = rawJob.company_logo || null;
  const companyInitials = companyName ? companyName.charAt(0).toUpperCase() : 'E';

  const rawAppliedAt = raw.applied_at || raw.created_at;
  const appliedAtFormatted = formatApplicationDate(rawAppliedAt);

  const rawInterview = raw.interview || null;
  let interviewObj = null;
  if (rawInterview && typeof rawInterview === 'object') {
    const rawDate = rawInterview.scheduled_date || rawInterview.scheduled_at;
    let isPast = false;
    if (rawDate) {
      const interviewTime = new Date(rawDate).getTime();
      const now = Date.now();
      if (!isNaN(interviewTime) && (now - interviewTime) > 90 * 60 * 1000) {
        isPast = true;
      }
    }
    const rawStatus = String(rawInterview.status || '').toUpperCase();
    if (rawStatus === 'COMPLETED') {
      isPast = true;
    }

    interviewObj = {
      id: String(rawInterview.id || ''),
      scheduledAt: rawDate || rawInterview.scheduled_at_formatted,
      scheduledAtFormatted: rawInterview.scheduled_at_formatted || formatApplicationDate(rawDate || rawInterview.scheduled_date),
      mode: rawInterview.interview_type || 'Online',
      meetingUrl: rawInterview.meeting_link || '#',
      status: isPast && rawStatus !== 'CANCELLED' ? 'COMPLETED' : (rawInterview.status || 'SCHEDULED'),
      isPast
    };
  }

  const rawResume = raw.resume || null;
  let resumeObj = null;
  if (rawResume && typeof rawResume === 'object') {
    resumeObj = {
      id: String(rawResume.id || ''),
      fileName: rawResume.file_name || 'Resume.pdf',
      fileUrl: rawResume.file_path || '#'
    };
  }

  const statusHistory = Array.isArray(raw.status_history) ? raw.status_history.map(sh => ({
    status: sh.status,
    date: sh.created_at,
    label: getStatusConfig(sh.status).label,
    notes: sh.notes
  })) : [];

  return {
    id,
    status: String(rawStatus).toUpperCase(),
    statusConfig,
    applicationType: raw.application_type || rawJob.application_type || 'PROFILE_RESUME',
    appliedAt: rawAppliedAt || null,
    appliedAtFormatted: appliedAtFormatted ? `Applied ${appliedAtFormatted}` : 'Applied recently',
    updatedAt: raw.updated_at || null,
    job: {
      id: jobId,
      title: jobTitle,
      location: rawJob.location_name || '',
      workMode: rawJob.work_mode_name || '',
      description: rawJob.description || ''
    },
    jobId,
    jobTitle,
    company: {
      id: String(rawJob.employer_id || ''),
      name: companyName,
      logoUrl: companyLogo,
      initials: companyInitials
    },
    companyName,
    companyInitials,
    interview: interviewObj,
    resume: resumeObj,
    remarks: raw.remarks || '',
    timeline: statusHistory
  };
}

/**
 * Fetch Candidate Applications list from Django API
 */
export async function getCandidateApplications(params = {}) {
  const { tab = 'all', search = '', status = '', page = 1, pageSize = 10 } = params;

  let backendApps = [];
  let hasNext = false;
  let hasPrevious = false;
  let backendSuccess = false;

  try {
    const query = new URLSearchParams();
    if (tab && tab !== 'all') query.append('tab', tab);
    if (search) query.append('search', search);
    if (status) query.append('status', status);
    if (page) query.append('page', page);

    const url = `${API_BASE_URL}/accounts/candidate/applications/?${query.toString()}`;
    const response = await authenticatedFetch(url);

    if (response.ok) {
      backendSuccess = true;
      const data = await response.json();
      const rawList = Array.isArray(data) ? data : (data.results || []);
      backendApps = rawList.map(normalizeApplicationRecord).filter(Boolean);
      hasNext = Boolean(data.next);
      hasPrevious = Boolean(data.previous);
    }
  } catch (err) {
    console.warn("Backend getCandidateApplications warning:", err);
  }

  // If backend responded, it is the authoritative source for this authenticated candidate
  if (backendSuccess) {
    return {
      applications: backendApps,
      totalCount: backendApps.length,
      page,
      totalPages: Math.ceil(backendApps.length / pageSize) || 1,
      hasNext,
      hasPrevious
    };
  }

  // Fallback ONLY when backend is unreachable, scoped strictly to the current candidate
  const user = getAuthenticatedUser();
  const userEmail = (user?.email || '').toLowerCase().trim();
  const userId = String(user?.id || '');

  const localApps = (function() {
    try {
      const stored = localStorage.getItem('tnjobz_candidate_applications');
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return parsed
        .filter(a => {
          const candEmail = (a.candidate?.email || a.email || '').toLowerCase().trim();
          const candId = String(a.candidate?.id || a.candidate_id || '');
          return (userEmail && candEmail === userEmail) || (userId && candId === userId);
        })
        .map(a => ({
          id: a.id,
          status: a.status || 'APPLIED',
          statusConfig: getStatusConfig(a.status || 'APPLIED'),
          appliedAt: a.applied_at || new Date().toISOString(),
          candidateNote: a.candidate_note || '',
          jobId: a.job_id,
          jobTitle: a.job_title || 'Software Developer',
          companyName: a.company_name || 'MSD Tech',
          companyInitials: (a.company_name || 'M').charAt(0).toUpperCase(),
          location: a.location || 'Chennai',
          workMode: a.work_mode || 'On-site',
          description: a.description || 'Applied position'
        }));
    } catch { return []; }
  })();

  return {
    applications: localApps,
    totalCount: localApps.length,
    page,
    totalPages: Math.ceil(localApps.length / pageSize) || 1,
    hasNext: false,
    hasPrevious: false
  };
}

/**
 * Fetch Candidate Application Summary Metrics
 */
export async function getCandidateApplicationSummary() {
  const url = `${API_BASE_URL}/accounts/candidate/applications/summary/`;

  try {
    const response = await authenticatedFetch(url);
    if (response.ok) {
      const backendData = await response.json();
      return {
        totalApplications: backendData?.totalApplications || 0,
        interviewsCount: backendData?.interviewsCount || 0,
        selectedCount: backendData?.selectedCount || backendData?.offersCount || 0,
        offersCount: backendData?.selectedCount || backendData?.offersCount || 0,
        rejectedCount: backendData?.rejectedCount || 0
      };
    }
  } catch (err) {
    console.warn("Backend summary fetch warning:", err);
  }

  // Fallback ONLY when backend is unreachable, scoped strictly to the current candidate
  const user = getAuthenticatedUser();
  const userEmail = (user?.email || '').toLowerCase().trim();
  const userId = String(user?.id || '');

  const localApps = (function() {
    try {
      const stored = localStorage.getItem('tnjobz_candidate_applications');
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return parsed.filter(a => {
        const candEmail = (a.candidate?.email || a.email || '').toLowerCase().trim();
        const candId = String(a.candidate?.id || a.candidate_id || '');
        return (userEmail && candEmail === userEmail) || (userId && candId === userId);
      });
    } catch { return []; }
  })();

  const interviewsCount = localApps.filter(a => a.status === 'INTERVIEW' || a.status === 'INTERVIEW_SCHEDULED').length;
  const selectedCount = localApps.filter(a => a.status === 'ACCEPTED' || a.status === 'SELECTED').length;
  const rejectedCount = localApps.filter(a => a.status === 'REJECTED').length;

  return {
    totalApplications: localApps.length,
    interviewsCount,
    selectedCount,
    offersCount: selectedCount,
    rejectedCount
  };
}

/**
 * Fetch candidate's uploaded & tailored AI resumes
 */
export async function getCandidateResumes() {
  let backendResumes = [];
  try {
    const url = `${API_BASE_URL}/accounts/candidate/resumes/`;
    const response = await authenticatedFetch(url);
    if (response.ok) {
      const data = await response.json();
      const rawList = Array.isArray(data) ? data : (data.results || []);
      backendResumes = rawList.map(r => ({
        id: String(r.id),
        fileName: r.file_name,
        fileUrl: r.file_path,
        isPrimary: Boolean(r.is_default),
        uploadedAt: formatApplicationDate(r.created_at || r.uploaded_at)
      }));
    }
  } catch (err) {
    console.warn("Backend getCandidateResumes warning:", err);
  }

  // Merge locally stored AI tailored/edited resume versions
  const localResumes = (function() {
    try {
      const stored = localStorage.getItem('statejobz_candidate_resumes');
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return parsed.map(r => ({
        id: String(r.versionId || r.id),
        fileName: r.title || r.fileName || 'Tailored_Resume.pdf',
        fileUrl: r.fileDataUrl || r.fileUrl || null,
        isPrimary: Boolean(r.isDefault || r.isBase),
        uploadedAt: r.updatedAt ? formatApplicationDate(r.updatedAt) : 'Recently'
      }));
    } catch { return []; }
  })();

  const existingIds = new Set(backendResumes.map(r => String(r.id)));
  const mergedLocal = localResumes.filter(r => !existingIds.has(String(r.id)));
  const list = [...mergedLocal, ...backendResumes];
  return list;
}

/**
 * Fetch detailed application by ID
 */
export async function getCandidateApplicationDetails(applicationId) {
  try {
    const url = `${API_BASE_URL}/accounts/candidate/applications/${applicationId}/`;
    const response = await authenticatedFetch(url);
    if (response.ok) {
      const data = await response.json();
      return normalizeApplicationRecord(data);
    }
  } catch (err) {
    console.warn("Backend getCandidateApplicationDetails warning:", err);
  }

  const user = getAuthenticatedUser();
  const userEmail = (user?.email || '').toLowerCase().trim();
  const userId = String(user?.id || '');

  const localApps = (function() {
    try {
      const stored = localStorage.getItem('tnjobz_candidate_applications');
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return parsed.filter(a => {
        const candEmail = (a.candidate?.email || a.email || '').toLowerCase().trim();
        const candId = String(a.candidate?.id || a.candidate_id || '');
        return (userEmail && candEmail === userEmail) || (userId && candId === userId);
      });
    } catch { return []; }
  })();

  const found = localApps.find(a => String(a.id) === String(applicationId));
  if (found) {
    return {
      id: found.id,
      status: found.status || 'APPLIED',
      statusConfig: getStatusConfig(found.status || 'APPLIED'),
      appliedAt: found.applied_at || new Date().toISOString(),
      candidateNote: found.candidate_note || '',
      jobId: found.job_id,
      jobTitle: found.job_title || 'Software Developer',
      companyName: found.company_name || 'MSD Tech',
      companyInitials: (found.company_name || 'M').charAt(0).toUpperCase(),
      location: 'Chennai',
      workMode: 'On-site'
    };
  }

  return null;
}

/**
 * Submit candidate job application to Django API & sync local storage for recruiter flow
 */
export async function submitCandidateApplication(payload) {
  let parsedJobId = isNaN(Number(payload.jobId)) ? payload.jobId : Number(payload.jobId);
  if (isNaN(Number(parsedJobId))) {
    if (String(payload.jobTitle || '').toLowerCase().includes('sde') || String(parsedJobId).includes('rec_01')) {
      parsedJobId = 8;
    }
  }
  const url = `${API_BASE_URL}/accounts/candidate/applications/`;

  // Retrieve active resume if not provided
  let activeResumeId = payload.resumeId && !isNaN(Number(payload.resumeId)) ? Number(payload.resumeId) : null;
  let activeResumeFilename = payload.resumeFileName || null;
  let activeResumeUrl = payload.resumeUrl || null;

  try {
    const resumes = await getCandidateResumes();
    if (resumes && resumes.length > 0) {
      const defaultRes = resumes.find(r => r.isPrimary || r.is_default) || resumes[0];
      if (defaultRes) {
        if (!activeResumeId && defaultRes.id && !isNaN(Number(defaultRes.id))) {
          activeResumeId = Number(defaultRes.id);
        }
        if (!activeResumeFilename) {
          activeResumeFilename = defaultRes.fileName || defaultRes.file_name || null;
        }
        if (!activeResumeUrl) {
          activeResumeUrl = defaultRes.fileUrl || defaultRes.file_path || null;
        }
      }
    } else {
      // Candidate has zero resumes
      return {
        success: false,
        requireResume: true,
        message: 'A resume is required to apply for this job. Please upload your resume first.'
      };
    }
  } catch (err) {
    console.warn("Resume resolution warning:", err);
  }

  if (!activeResumeId && !activeResumeFilename) {
    return {
      success: false,
      requireResume: true,
      message: 'A resume is required to apply for this job. Please upload your resume first.'
    };
  }

  const bodyData = {
    job_id: parsedJobId,
    resume_id: activeResumeId,
    application_type: payload.applicationType || 'PROFILE_RESUME',
    phone_number: payload.phone || null,
    candidate_note: payload.candidateNote || ''
  };

  let candidateUser = null;
  try {
    candidateUser = getAuthenticatedUser();
  } catch { candidateUser = null; }

  // Fetch full candidate profile to include headline, skills, experience, and education
  let fullProfile = null;
  try {
    const { getCandidateProfile } = await import('./candidateProfileService');
    fullProfile = await getCandidateProfile();
  } catch (err) {
    console.warn("Candidate profile resolution warning:", err);
  }

  // Enforce minimum 70% profile completion rule
  const completionPercentage = fullProfile?.completionPercentage || 0;
  if (completionPercentage < 70) {
    return {
      success: false,
      requireProfileCompletion: true,
      currentCompletion: completionPercentage,
      requiredCompletion: 70,
      message: `Your profile completion is currently ${completionPercentage}%. A minimum profile completion of 70% is required to apply for jobs. Please complete your profile first.`
    };
  }

  const candidateProfile = {
    id: fullProfile?.id || candidateUser?.id || 'cand_1',
    full_name: fullProfile?.fullName || candidateUser?.fullName || (candidateUser?.first_name || candidateUser?.last_name ? `${candidateUser.first_name || ''} ${candidateUser.last_name || ''}`.trim() : '') || 'Candidate',
    headline: fullProfile?.headline || '',
    email: fullProfile?.email || candidateUser?.email || '',
    phone: fullProfile?.phone || candidateUser?.mobileNumber || candidateUser?.phone_number || '',
    location: fullProfile?.location || candidateUser?.location || '',
    profile_photo: fullProfile?.avatarUrl || candidateUser?.profilePhotoUrl || candidateUser?.profile_photo || null,
    profile_completion: completionPercentage,
    initials: (fullProfile?.fullName || candidateUser?.fullName || 'C').charAt(0).toUpperCase(),
    skills: (fullProfile?.skills && fullProfile.skills.length > 0) ? fullProfile.skills : [],
    experiences: (fullProfile?.experiences && fullProfile.experiences.length > 0) ? fullProfile.experiences : [],
    education: (fullProfile?.education && fullProfile.education.length > 0) ? fullProfile.education : []
  };

  let createdAppRecord = null;

  try {
    const response = await authenticatedFetch(url, {
      method: 'POST',
      body: JSON.stringify(bodyData)
    });

    if (response.ok) {
      const resData = await response.json();
      createdAppRecord = normalizeApplicationRecord(resData);
    } else {
      const errData = await response.json().catch(() => ({}));
      if (errData?.require_profile_completion || String(errData?.detail || '').toLowerCase().includes('profile completion')) {
        return {
          success: false,
          requireProfileCompletion: true,
          currentCompletion: errData.profile_completion || completionPercentage,
          requiredCompletion: 70,
          message: errData.detail || `A minimum profile completion of 70% is required to apply for jobs. Please complete your profile first.`
        };
      }
      if (errData?.resume_id) {
        return {
          success: false,
          requireResume: true,
          message: Array.isArray(errData.resume_id) ? errData.resume_id[0] : errData.resume_id
        };
      }
      return {
        success: false,
        message: errData?.detail || 'Failed to submit application. Please check requirements.'
      };
    }
  } catch (err) {
    console.warn("Backend application submit warning:", err);
    return {
      success: false,
      message: 'Failed to connect to application server. Please try again.'
    };
  }

  // Always sync local applications storage so Recruiter HR portal can view applicants seamlessly
  try {
    const stored = localStorage.getItem('tnjobz_candidate_applications') || '[]';
    const apps = JSON.parse(stored);

    const appId = createdAppRecord?.id || `app_${Date.now()}`;
    const newApp = {
      id: appId,
      job_id: String(parsedJobId || payload.jobId || ''),
      job_title: payload.jobTitle || 'Job',
      company_name: payload.company || payload.companyName || 'Company',
      status: createdAppRecord?.status || 'APPLIED',
      applied_at: new Date().toISOString(),
      applied_time: 'Recently',
      candidate_note: payload.candidateNote || '',
      resume_id: activeResumeId || null,
      resume_filename: activeResumeFilename || null,
      resume_url: activeResumeUrl || null,
      job: {
        id: String(parsedJobId || payload.jobId || ''),
        title: payload.jobTitle || 'Job',
        company_name: payload.company || payload.companyName || 'Company',
        location: payload.location || 'Tamil Nadu',
        work_mode: payload.workMode || 'On-site',
        salary: payload.salary || 'Competitive Salary'
      },
      candidate: candidateProfile
    };

    // Replace existing or prepend
    const existingIdx = apps.findIndex(a => String(a.id) === String(appId) || (String(a.job_id) === String(payload.jobId) && a.candidate?.email === candidateProfile.email));
    if (existingIdx !== -1) {
      apps[existingIdx] = newApp;
    } else {
      apps.unshift(newApp);
    }

    localStorage.setItem('tnjobz_candidate_applications', JSON.stringify(apps));

    return {
      success: true,
      application: createdAppRecord || {
        id: newApp.id,
        jobId: payload.jobId,
        status: 'APPLIED',
        statusConfig: getStatusConfig('APPLIED'),
        appliedAt: newApp.applied_at
      }
    };
  } catch (e) {
    if (createdAppRecord) {
      return { success: true, application: createdAppRecord };
    }
    return { success: false, message: 'Failed to submit application.' };
  }
}

/**
 * Withdraw candidate application in Django API
 */
export async function withdrawCandidateApplication(applicationId) {
  const url = `${API_BASE_URL}/accounts/candidate/applications/${applicationId}/withdraw/`;
  const response = await authenticatedFetch(url, {
    method: 'POST'
  });

  if (!response.ok) {
    const resData = await response.json();
    return { success: false, message: resData.detail || 'Failed to withdraw application.' };
  }

  return { success: true };
}
