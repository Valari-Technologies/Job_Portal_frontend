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

import { authenticatedFetch } from '../auth/adminAuthService';

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
    interviewObj = {
      id: String(rawInterview.id || ''),
      scheduledAt: rawInterview.scheduled_date || rawInterview.scheduled_at_formatted,
      scheduledAtFormatted: rawInterview.scheduled_at_formatted || formatApplicationDate(rawInterview.scheduled_date),
      mode: rawInterview.interview_type || 'Online',
      meetingUrl: rawInterview.meeting_link || '#',
      status: rawInterview.status || 'SCHEDULED'
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

  try {
    const query = new URLSearchParams();
    if (tab && tab !== 'all') query.append('tab', tab);
    if (search) query.append('search', search);
    if (status) query.append('status', status);
    if (page) query.append('page', page);

    const url = `${API_BASE_URL}/accounts/candidate/applications/?${query.toString()}`;
    const response = await authenticatedFetch(url);

    if (response.ok) {
      const data = await response.json();
      const rawList = Array.isArray(data) ? data : (data.results || []);
      backendApps = rawList.map(normalizeApplicationRecord).filter(Boolean);
      hasNext = Boolean(data.next);
      hasPrevious = Boolean(data.previous);
    }
  } catch (err) {
    console.warn("Backend getCandidateApplications warning:", err);
  }

  // Merge local fallback applications if present
  const localApps = (function() {
    try {
      const stored = localStorage.getItem('tnjobz_candidate_applications');
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return parsed.map(a => ({
        id: a.id,
        status: a.status || 'APPLIED',
        statusConfig: getStatusConfig(a.status || 'APPLIED'),
        appliedAt: a.applied_at || new Date().toISOString(),
        candidateNote: a.candidate_note || '',
        jobId: a.job_id,
        jobTitle: a.job_title || 'Software Developer',
        companyName: a.company_name || 'MSD Tech',
        companyInitials: (a.company_name || 'M').charAt(0).toUpperCase(),
        location: 'Chennai',
        workMode: 'On-site',
        description: 'Applied position'
      }));
    } catch { return []; }
  })();

  const existingIds = new Set(backendApps.map(a => String(a.id)));
  const mergedLocal = localApps.filter(a => !existingIds.has(String(a.id)));
  const normalizedList = [...backendApps, ...mergedLocal];

  return {
    applications: normalizedList,
    totalCount: normalizedList.length,
    page,
    totalPages: Math.ceil(normalizedList.length / pageSize) || 1,
    hasNext,
    hasPrevious
  };
}

/**
 * Fetch Candidate Application Summary Metrics
 */
export async function getCandidateApplicationSummary() {
  const url = `${API_BASE_URL}/accounts/candidate/applications/summary/`;
  let backendData = null;

  try {
    const response = await authenticatedFetch(url);
    if (response.ok) {
      backendData = await response.json();
    }
  } catch (err) {
    console.warn("Backend summary fetch warning:", err);
  }

  const localApps = (function() {
    try {
      const stored = localStorage.getItem('tnjobz_candidate_applications');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  })();

  const bTotal = backendData?.totalApplications || 0;
  const bInterviews = backendData?.interviewsCount || 0;
  const bSelected = backendData?.selectedCount || backendData?.offersCount || 0;
  const bRejected = backendData?.rejectedCount || 0;

  return {
    totalApplications: bTotal + localApps.length,
    interviewsCount: bInterviews,
    selectedCount: bSelected,
    offersCount: bSelected,
    rejectedCount: bRejected
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

  if (list.length === 0) {
    list.push({
      id: 'res_default',
      fileName: 'Primary_Resume.pdf',
      fileUrl: null,
      isPrimary: true,
      uploadedAt: 'Recently'
    });
  }
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

  const localApps = (function() {
    try {
      const stored = localStorage.getItem('tnjobz_candidate_applications');
      return stored ? JSON.parse(stored) : [];
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
  const parsedJobId = isNaN(Number(payload.jobId)) ? payload.jobId : Number(payload.jobId);
  const url = `${API_BASE_URL}/accounts/candidate/applications/`;

  const bodyData = {
    job_id: parsedJobId,
    resume_id: payload.resumeId && !isNaN(Number(payload.resumeId)) ? Number(payload.resumeId) : null,
    application_type: payload.applicationType || 'PROFILE_RESUME',
    phone_number: payload.phone || null,
    candidate_note: payload.candidateNote || ''
  };

  let candidateUser = null;
  try {
    const userStr = localStorage.getItem('auth_user');
    candidateUser = userStr ? JSON.parse(userStr) : null;
  } catch { candidateUser = null; }

  const candidateProfile = {
    full_name: candidateUser?.fullName || (candidateUser?.first_name || candidateUser?.last_name ? `${candidateUser.first_name || ''} ${candidateUser.last_name || ''}`.trim() : '') || 'Candidate User',
    email: candidateUser?.email || 'candidate@tnjobz.com',
    phone: candidateUser?.mobileNumber || candidateUser?.phone_number || '',
    location: candidateUser?.location || 'Chennai, Tamil Nadu',
    profile_photo: candidateUser?.profilePhotoUrl || candidateUser?.profile_photo || null,
    profile_completion: 95,
    initials: (candidateUser?.fullName || candidateUser?.first_name || 'C').charAt(0).toUpperCase()
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
    }
  } catch (err) {
    console.warn("Backend application submit warning, fallback to local application:", err);
  }

  // Always sync local applications storage so Recruiter HR portal can view applicants seamlessly
  try {
    const stored = localStorage.getItem('tnjobz_candidate_applications') || '[]';
    const apps = JSON.parse(stored);

    const appId = createdAppRecord?.id || `app_${Date.now()}`;
    const newApp = {
      id: appId,
      job_id: payload.jobId,
      job_title: payload.jobTitle || 'Software Developer',
      company_name: payload.company || payload.companyName || 'MSD Tech',
      status: createdAppRecord?.status || 'APPLIED',
      applied_at: new Date().toISOString(),
      candidate_note: payload.candidateNote || '',
      resume_id: payload.resumeId || null,
      resume_filename: payload.resumeFileName || 'Candidate_Resume.pdf',
      resume_url: payload.resumeUrl || null,
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
