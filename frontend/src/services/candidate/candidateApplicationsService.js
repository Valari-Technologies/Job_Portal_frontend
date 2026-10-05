/**
 * Candidate Applications Service
 * 
 * Handles authenticated candidate job applications, Django DRF response normalization,
 * summary metrics, resume selection, application details, and application withdrawal.
 * 
 * Django API Boundaries:
 * - GET /api/v1/candidates/applications/ -> List applications (supports DRF pagination & summary metadata)
 * - GET /api/v1/candidates/applications/summary/ -> Fetch application summary counts
 * - POST /api/v1/candidates/applications/ -> Submit new job application
 * - GET /api/v1/candidates/applications/{id}/ -> Fetch application details
 * - POST /api/v1/candidates/applications/{id}/withdraw/ -> Withdraw application
 */

import { getAuthenticatedUser } from '../auth/adminAuthService';

const STORAGE_APPLICATIONS_KEY = 'statejobz_candidate_applications';
const STORAGE_RESUMES_KEY = 'statejobz_candidate_resumes';

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
  OFFER: {
    label: 'Offer Received',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    color: '#065F46'
  },
  OFFER_RECEIVED: {
    label: 'Offer Received',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    color: '#065F46'
  },
  HIRED: {
    label: 'Hired',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    color: '#065F46'
  },
  OFFER_ACCEPTED: {
    label: 'Offer Accepted',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    color: '#065F46'
  },
  REJECTED: {
    label: 'Rejected',
    badgeClass: 'bg-red-100 text-red-700 border-red-200',
    color: '#B91C1C'
  },
  NOT_SELECTED: {
    label: 'Not Selected',
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

  // Safe readable label fallback for unmapped backend status
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
 * Centralized date formatter avoiding 'Invalid Date', 'undefined', or '[object Object]'
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

  const id = String(raw.id || raw.application_id || raw.pk || `app_${Date.now()}`);
  const rawStatus = raw.status || raw.application_status || 'APPLIED';
  const statusConfig = getStatusConfig(rawStatus);

  const rawJob = raw.job || {};
  const jobId = String(raw.job_id || rawJob.id || raw.jobId || '');
  const jobTitle = rawJob.title || raw.job_title || raw.jobTitle || 'Job Title Unavailable';

  const rawCompany = raw.company || rawJob.company || {};
  const companyId = String(rawCompany.id || raw.company_id || '');
  const companyName = rawCompany.name || raw.company_name || raw.company || 'Company Unavailable';
  const companyLogo = rawCompany.logo_url || rawCompany.logoUrl || raw.company_logo || raw.companyLogo || null;
  const companyInitials = (companyName && companyName !== 'Company Unavailable') 
    ? companyName.charAt(0).toUpperCase() 
    : (raw.companyInitials || 'C');

  const rawAppliedAt = raw.applied_at || raw.appliedAt || raw.created_at || raw.createdAt;
  const appliedAtFormatted = formatApplicationDate(rawAppliedAt);

  const rawInterview = raw.interview || raw.interview_details || null;
  let interviewObj = null;
  if (rawInterview && typeof rawInterview === 'object') {
    const rawSched = rawInterview.scheduled_at || rawInterview.scheduledAt;
    interviewObj = {
      id: String(rawInterview.id || ''),
      scheduledAt: rawSched,
      scheduledAtFormatted: formatApplicationDate(rawSched),
      mode: rawInterview.mode || rawInterview.interview_mode || 'Google Meet',
      meetingUrl: rawInterview.meeting_url || rawInterview.meetingUrl || '#',
      status: rawInterview.status || 'SCHEDULED'
    };
  }

  const rawOffer = raw.offer || raw.offer_details || null;
  let offerObj = null;
  if (rawOffer && typeof rawOffer === 'object') {
    offerObj = {
      id: String(rawOffer.id || ''),
      status: rawOffer.status || 'OFFERED',
      acceptedAt: rawOffer.accepted_at || rawOffer.acceptedAt || null
    };
  }

  const rawResume = raw.resume || null;
  let resumeObj = null;
  if (rawResume && typeof rawResume === 'object') {
    resumeObj = {
      id: String(rawResume.id || ''),
      fileName: rawResume.file_name || rawResume.fileName || 'Resume.pdf',
      fileUrl: rawResume.file_url || rawResume.fileUrl || '#'
    };
  }

  return {
    id,
    status: String(rawStatus).toUpperCase(),
    statusConfig,
    appliedAt: rawAppliedAt || null,
    appliedAtFormatted: appliedAtFormatted ? `Applied ${appliedAtFormatted}` : 'Applied recently',
    updatedAt: raw.updated_at || raw.updatedAt || null,
    job: {
      id: jobId,
      title: jobTitle
    },
    jobId,
    jobTitle,
    company: {
      id: companyId,
      name: companyName,
      logoUrl: companyLogo,
      initials: companyInitials
    },
    companyName,
    companyInitials,
    interview: interviewObj,
    offer: offerObj,
    resume: resumeObj,
    timeline: raw.timeline || []
  };
}

function getStoredApplications() {
  try {
    const raw = localStorage.getItem(STORAGE_APPLICATIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error reading Candidate applications storage:', err);
    return [];
  }
}

function saveStoredApplications(apps) {
  try {
    localStorage.setItem(STORAGE_APPLICATIONS_KEY, JSON.stringify(apps));
  } catch (err) {
    console.error('Error saving Candidate applications storage:', err);
  }
}
function getStoredResumes() {
  try {
    const raw = localStorage.getItem(STORAGE_RESUMES_KEY);
    if (raw) return JSON.parse(raw);
    
    const user = getAuthenticatedUser();
    const candidateName = (user?.first_name || user?.fullName?.split(' ')[0] || 'Candidate').replace(/[^a-zA-Z0-9]/g, '_');

    const defaultResume = [
      {
        id: 'res_default_1',
        fileName: `${candidateName}_Resume.pdf`,
        fileUrl: '#',
        updatedAt: new Date().toISOString().split('T')[0],
        isPrimary: true
      }
    ];
    localStorage.setItem(STORAGE_RESUMES_KEY, JSON.stringify(defaultResume));
    return defaultResume;
  } catch {
    return [];
  }
}

/**
 * Fetch Candidate Applications list with tab/status filtering, search, and DRF response parsing
 */
export async function getCandidateApplications(params = {}) {
  await new Promise(resolve => setTimeout(resolve, 120));
  const { tab = 'all', search = '', status = '', page = 1, pageSize = 10 } = params;

  const rawData = getStoredApplications();

  // Handle direct array vs DRF paginated `{ results: [] }` responses
  let list = Array.isArray(rawData) 
    ? rawData 
    : (rawData && Array.isArray(rawData.results) ? rawData.results : []);

  // Normalize raw application objects
  let normalizedList = list.map(normalizeApplicationRecord).filter(Boolean);

  // Tab filtering: 'all', 'active', 'interview', 'offered'
  if (tab === 'active') {
    normalizedList = normalizedList.filter(a => !['REJECTED', 'WITHDRAWN', 'NOT_SELECTED'].includes(a.status));
  } else if (tab === 'interview') {
    normalizedList = normalizedList.filter(a => ['INTERVIEW', 'INTERVIEW_SCHEDULED'].includes(a.status) || Boolean(a.interview));
  } else if (tab === 'offered') {
    normalizedList = normalizedList.filter(a => ['OFFER', 'OFFER_RECEIVED', 'HIRED', 'OFFER_ACCEPTED'].includes(a.status));
  }

  // Status filtering
  if (status) {
    const sNorm = String(status).toUpperCase().replace(/\s+/g, '_');
    normalizedList = normalizedList.filter(a => a.status === sNorm);
  }

  // Search filtering
  if (search.trim()) {
    const term = search.trim().toLowerCase();
    normalizedList = normalizedList.filter(a => 
      a.jobTitle.toLowerCase().includes(term) ||
      a.company.name.toLowerCase().includes(term)
    );
  }

  const totalCount = normalizedList.length;
  const startIndex = (page - 1) * pageSize;
  const paginatedList = normalizedList.slice(startIndex, startIndex + pageSize);

  return {
    applications: paginatedList,
    totalCount,
    page,
    totalPages: Math.ceil(totalCount / pageSize) || 1,
    hasNext: startIndex + pageSize < totalCount,
    hasPrevious: page > 1
  };
}

/**
 * Fetch Candidate Application Summary Metrics (Total, Interviews, Offers, Rejected)
 */
export async function getCandidateApplicationSummary() {
  await new Promise(resolve => setTimeout(resolve, 100));
  try {
    const rawData = getStoredApplications();
    let list = Array.isArray(rawData) 
      ? rawData 
      : (rawData && Array.isArray(rawData.results) ? rawData.results : []);

    const normalizedList = list.map(normalizeApplicationRecord).filter(Boolean);

    const totalApplications = normalizedList.length;
    const interviewsCount = normalizedList.filter(a => ['INTERVIEW', 'INTERVIEW_SCHEDULED'].includes(a.status) || Boolean(a.interview)).length;
    const offersCount = normalizedList.filter(a => ['OFFER', 'OFFER_RECEIVED', 'HIRED', 'OFFER_ACCEPTED'].includes(a.status)).length;
    const rejectedCount = normalizedList.filter(a => ['REJECTED', 'NOT_SELECTED'].includes(a.status)).length;

    return {
      totalApplications,
      interviewsCount,
      offersCount,
      rejectedCount
    };
  } catch (err) {
    console.error('Failed to compute application summary metrics:', err);
    return null; // Return null so UI can render error/unavailable state instead of false 0
  }
}

/**
 * Fetch candidate's uploaded resumes for application selection
 */
export async function getCandidateResumes() {
  await new Promise(resolve => setTimeout(resolve, 100));
  return getStoredResumes();
}

/**
 * Fetch detailed application by ID
 */
export async function getCandidateApplicationDetails(applicationId) {
  await new Promise(resolve => setTimeout(resolve, 100));
  const list = getStoredApplications();
  const rawApp = list.find(a => String(a.id || a.application_id) === String(applicationId));
  return rawApp ? normalizeApplicationRecord(rawApp) : null;
}

/**
 * Submit candidate job application
 */
export async function submitCandidateApplication(payload) {
  await new Promise(resolve => setTimeout(resolve, 250));
  const { jobId, jobTitle, company, companyInitials, resumeId, currentCtc, noticePeriod, candidateNote } = payload;

  const apps = getStoredApplications();
  const existing = apps.find(a => String(a.jobId || a.job_id) === String(jobId));

  if (existing) {
    return { success: false, message: 'You have already applied for this position.' };
  }

  const rawNewApp = {
    id: `app_${Date.now()}`,
    job_id: jobId,
    job_title: jobTitle || 'Specialist Position',
    company_name: company || 'Employer',
    company_initials: companyInitials || (company ? company.charAt(0) : 'E'),
    status: 'APPLIED',
    applied_at: new Date().toISOString(),
    resume_id: resumeId || 'res_default_1',
    current_ctc: currentCtc || '',
    notice_period: noticePeriod || '',
    candidate_note: candidateNote || '',
    timeline: [
      { status: 'APPLIED', date: new Date().toISOString(), label: 'Application Submitted' }
    ]
  };

  const updated = [rawNewApp, ...apps];
  saveStoredApplications(updated);

  return { 
    success: true, 
    application: normalizeApplicationRecord(rawNewApp) 
  };
}

/**
 * Withdraw candidate application
 */
export async function withdrawCandidateApplication(applicationId) {
  await new Promise(resolve => setTimeout(resolve, 150));
  const apps = getStoredApplications();
  const updated = apps.map(a => String(a.id || a.application_id) === String(applicationId) ? { ...a, status: 'WITHDRAWN' } : a);
  saveStoredApplications(updated);
  return { success: true };
}
