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

  const query = new URLSearchParams();
  if (tab && tab !== 'all') query.append('tab', tab);
  if (search) query.append('search', search);
  if (status) query.append('status', status);
  if (page) query.append('page', page);

  const url = `${API_BASE_URL}/accounts/candidate/applications/?${query.toString()}`;
  const response = await authenticatedFetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch candidate applications.');
  }

  const data = await response.json();
  const rawList = Array.isArray(data) ? data : (data.results || []);
  const normalizedList = rawList.map(normalizeApplicationRecord).filter(Boolean);
  const totalCount = data.count !== undefined ? data.count : normalizedList.length;

  return {
    applications: normalizedList,
    totalCount,
    page,
    totalPages: Math.ceil(totalCount / pageSize) || 1,
    hasNext: Boolean(data.next),
    hasPrevious: Boolean(data.previous)
  };
}

/**
 * Fetch Candidate Application Summary Metrics
 */
export async function getCandidateApplicationSummary() {
  const url = `${API_BASE_URL}/accounts/candidate/applications/summary/`;
  const response = await authenticatedFetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch application summary metrics.');
  }

  const data = await response.json();
  return {
    totalApplications: data.totalApplications || 0,
    interviewsCount: data.interviewsCount || 0,
    selectedCount: data.selectedCount || data.offersCount || 0,
    offersCount: data.selectedCount || data.offersCount || 0,
    rejectedCount: data.rejectedCount || 0
  };
}

/**
 * Fetch candidate's uploaded resumes
 */
export async function getCandidateResumes() {
  const url = `${API_BASE_URL}/accounts/candidate/resumes/`;
  const response = await authenticatedFetch(url);

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  const rawList = Array.isArray(data) ? data : (data.results || []);
  return rawList.map(r => ({
    id: String(r.id),
    fileName: r.file_name,
    fileUrl: r.file_path,
    isPrimary: Boolean(r.is_default),
    uploadedAt: formatApplicationDate(r.created_at || r.uploaded_at)
  }));
}

/**
 * Fetch detailed application by ID
 */
export async function getCandidateApplicationDetails(applicationId) {
  const url = `${API_BASE_URL}/accounts/candidate/applications/${applicationId}/`;
  const response = await authenticatedFetch(url);

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return normalizeApplicationRecord(data);
}

/**
 * Submit candidate job application to Django API
 */
export async function submitCandidateApplication(payload) {
  const url = `${API_BASE_URL}/accounts/candidate/applications/`;

  const bodyData = {
    job_id: Number(payload.jobId),
    resume_id: payload.resumeId ? Number(payload.resumeId) : null,
    application_type: payload.applicationType || 'PROFILE_RESUME',
    phone_number: payload.phone || null,
    candidate_note: payload.candidateNote || ''
  };

  const response = await authenticatedFetch(url, {
    method: 'POST',
    body: JSON.stringify(bodyData)
  });

  const resData = await response.json();

  if (!response.ok) {
    const errorMsg = resData.detail || resData.non_field_errors?.[0] || resData.job_id?.[0] || resData.resume_id?.[0] || 'Failed to submit application.';
    return { success: false, message: errorMsg };
  }

  return {
    success: true,
    application: normalizeApplicationRecord(resData)
  };
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
