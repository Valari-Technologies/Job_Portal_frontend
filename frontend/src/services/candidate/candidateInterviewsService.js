/**
 * Candidate Interviews Service
 * 
 * Handles candidate interview sessions, DRF API response normalization,
 * date/timezone formatting, live countdown calculations, secured join meeting URL fetching,
 * and reschedule request submission.
 * 
 * Django API Boundaries:
 * - GET /accounts/candidate/interviews/ -> List scheduled candidate interviews
 * - GET /accounts/candidate/interviews/summary/ -> Fetch summary counts
 * - POST /accounts/candidate/interviews/{id}/reschedule/ -> Submit reschedule request
 */

import { authenticatedFetch } from '../auth/adminAuthService';

const API_BASE_URL = 'http://127.0.0.1:8000';

/**
 * Centralized status visualization configuration mapping
 */
export const INTERVIEW_STATUS_MAP = {
  UPCOMING: {
    label: 'Upcoming',
    badgeClass: 'bg-[#EEF2FF] text-[#3B00FF] border-indigo-200',
    color: '#3B00FF'
  },
  SCHEDULED: {
    label: 'Upcoming',
    badgeClass: 'bg-[#EEF2FF] text-[#3B00FF] border-indigo-200',
    color: '#3B00FF'
  },
  COMPLETED: {
    label: 'Completed',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    color: '#334155'
  },
  RESCHEDULED: {
    label: 'Rescheduled',
    badgeClass: 'bg-indigo-100 text-[#3B00FF] border-indigo-200',
    color: '#3B00FF'
  },
  CANCELLED: {
    label: 'Cancelled',
    badgeClass: 'bg-red-100 text-red-700 border-red-200',
    color: '#B91C1C'
  }
};

export function getInterviewStatusConfig(status) {
  if (!status) {
    return {
      label: 'Upcoming',
      badgeClass: 'bg-[#EEF2FF] text-[#3B00FF] border-indigo-200',
      color: '#3B00FF'
    };
  }

  const normalized = String(status).toUpperCase().replace(/\s+/g, '_');
  if (INTERVIEW_STATUS_MAP[normalized]) {
    return INTERVIEW_STATUS_MAP[normalized];
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

export const getStatusConfig = getInterviewStatusConfig;

export function formatInterviewDate(startsAtStr, endsAtStr, timezoneStr = 'IST') {
  if (!startsAtStr) {
    return {
      month: '—',
      day: '—',
      weekday: '—',
      timeRange: 'Time unavailable',
      fullFormatted: 'Date unavailable'
    };
  }

  try {
    const startDate = new Date(startsAtStr);
    if (isNaN(startDate.getTime())) {
      return {
        month: '—',
        day: '—',
        weekday: '—',
        timeRange: String(startsAtStr),
        fullFormatted: String(startsAtStr)
      };
    }

    const month = startDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const day = startDate.getDate().toString().padStart(2, '0');
    const weekday = startDate.toLocaleDateString('en-US', { weekday: 'short' });

    const startTimeFormatted = startDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    let timeRange = `${startTimeFormatted} ${timezoneStr}`;

    return {
      month,
      day,
      weekday,
      timeRange,
      fullFormatted: `${weekday}, ${month} ${day} at ${startTimeFormatted} (${timezoneStr})`
    };
  } catch {
    return {
      month: '—',
      day: '—',
      weekday: '—',
      timeRange: 'Time unavailable',
      fullFormatted: 'Date unavailable'
    };
  }
}

export function normalizeInterviewRecord(raw) {
  if (!raw || typeof raw !== 'object') return null;

  const id = String(raw.id || raw.pk || '');
  const statusConfig = getInterviewStatusConfig(raw.status || 'SCHEDULED');
  const dateInfo = formatInterviewDate(raw.scheduled_date || raw.scheduled_at, null);

  const companyName = raw.company_name || 'Employer';

  return {
    id,
    applicationId: String(raw.application || ''),
    jobId: String(raw.job || ''),
    jobTitle: raw.job_title || 'Position',
    companyName,
    companyInitials: companyName.charAt(0).toUpperCase(),
    interviewType: raw.interview_type || 'ONLINE',
    status: raw.status || 'SCHEDULED',
    statusConfig,
    scheduledDate: raw.scheduled_date || '',
    scheduledTime: raw.scheduled_time || '',
    scheduledAtFormatted: raw.scheduled_at_formatted || dateInfo.fullFormatted,
    dateInfo,
    location: raw.location || '',
    meetingLink: raw.meeting_link || '',
    phoneNumber: raw.phone_number || '',
    notes: raw.notes || '',
    result: raw.result || 'PENDING'
  };
}

/**
 * Fetch candidate interviews list
 */
export async function getCandidateInterviews(params = {}) {
  const { tab = 'all', status = '', search = '' } = params;

  const query = new URLSearchParams();
  if (tab && tab !== 'all') query.append('tab', tab);
  if (status) query.append('status', status);

  const url = `${API_BASE_URL}/accounts/candidate/interviews/?${query.toString()}`;
  const response = await authenticatedFetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch candidate interviews.');
  }

  const data = await response.json();
  const rawList = Array.isArray(data) ? data : (data.results || []);
  let list = rawList.map(normalizeInterviewRecord).filter(Boolean);

  if (search.trim()) {
    const term = search.trim().toLowerCase();
    list = list.filter(i => 
      i.jobTitle.toLowerCase().includes(term) ||
      i.companyName.toLowerCase().includes(term)
    );
  }

  return {
    interviews: list,
    totalCount: list.length
  };
}

/**
 * Fetch candidate interview summary counts
 */
export async function getCandidateInterviewSummary() {
  const url = `${API_BASE_URL}/accounts/candidate/interviews/summary/`;
  const response = await authenticatedFetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch interview summary.');
  }

  return response.json();
}

/**
 * Request interview reschedule
 */
export async function requestInterviewReschedule(interviewId, payload) {
  const url = `${API_BASE_URL}/accounts/candidate/interviews/${interviewId}/reschedule/`;
  const response = await authenticatedFetch(url, {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  const resData = await response.json();

  if (!response.ok) {
    return { success: false, message: resData.detail || 'Failed to request reschedule.' };
  }

  return { success: true, interview: normalizeInterviewRecord(resData.interview) };
}

export async function getCandidateNextInterview() {
  const { interviews } = await getCandidateInterviews({ tab: 'upcoming' });
  return interviews.length > 0 ? interviews[0] : null;
}

export async function getInterviewJoinAccess(interviewId) {
  const { interviews } = await getCandidateInterviews();
  const found = interviews.find(i => String(i.id) === String(interviewId));
  return { joinUrl: found?.meetingLink || '#', meetingLink: found?.meetingLink || '#' };
}

export function calculateCountdown(startsAtStr) {
  if (!startsAtStr) return { days: 0, hours: 0, minutes: 0, isPast: true, formattedCountdown: 'Completed' };
  try {
    const diff = new Date(startsAtStr).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, isPast: true, formattedCountdown: 'Starting soon' };
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    return { days, hours, minutes, isPast: false, formattedCountdown: `${days}d ${hours}h ${minutes}m` };
  } catch {
    return { days: 0, hours: 0, minutes: 0, isPast: true, formattedCountdown: 'Starting soon' };
  }
}

export function getPreparationChecklist() {
  return [
    { id: 'prep_1', text: 'Test camera and audio equipment', completed: true },
    { id: 'prep_2', text: 'Review job requirements & company notes', completed: false },
    { id: 'prep_3', text: 'Prepare questions for the interviewer', completed: false }
  ];
}

export function togglePreparationItem(id) {
  return getPreparationChecklist();
}
