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
    let startDate = new Date(startsAtStr);
    if (isNaN(startDate.getTime())) {
      const cleaned = String(startsAtStr).trim().replace(' ', 'T');
      startDate = new Date(cleaned);
    }
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
  let statusConfig = getInterviewStatusConfig(raw.status || 'SCHEDULED');

  let combinedDateTime = raw.scheduled_date || raw.scheduled_at || '';
  if (raw.scheduled_date && raw.scheduled_time) {
    const timeVal = String(raw.scheduled_time).trim();
    if (timeVal.includes('T')) {
      combinedDateTime = timeVal;
    } else {
      combinedDateTime = `${raw.scheduled_date}T${timeVal}`;
    }
  }
  const dateInfo = formatInterviewDate(combinedDateTime, null);

  const rawType = String(raw.interview_type || raw.mode || 'ONLINE').toUpperCase();
  const isOnline = rawType.includes('ONLINE') || rawType.includes('MEET') || rawType.includes('ZOOM');
  const mode = isOnline ? 'ONLINE' : 'IN_PERSON';
  const meetingLink = raw.meeting_link || 'https://meet.google.com/abc-jobz-portal';
  const provider = meetingLink.includes('meet.google')
    ? 'Google Meet Video Call'
    : (meetingLink.includes('zoom') ? 'Zoom Video Call' : 'Online Video Call');

  const companyName = raw.company_name || 'Employer';
  const roundName = raw.round_name || raw.roundName || raw.notes || 'Technical Interview - Round 1';

  let isLive = false;
  let isPast = false;

  if (combinedDateTime && (raw.status === 'SCHEDULED' || raw.status === 'UPCOMING' || !raw.status)) {
    const scheduledTimeMs = new Date(combinedDateTime).getTime();
    const nowMs = Date.now();
    if (!isNaN(scheduledTimeMs)) {
      const diffMinutes = (scheduledTimeMs - nowMs) / (1000 * 60);

      // If within 15 minutes before scheduled start time, up to 90 minutes after:
      if (diffMinutes <= 15 && diffMinutes >= -90) {
        isLive = true;
        statusConfig = {
          label: '● Live Now',
          badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-400/20 font-black animate-pulse',
          color: '#10B981'
        };
      } else if (diffMinutes < -90) {
        isPast = true;
        statusConfig = {
          label: 'Past Session',
          badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
          color: '#475569'
        };
      }
    }
  }

  return {
    id,
    applicationId: String(raw.application || ''),
    jobId: String(raw.job || ''),
    jobTitle: raw.job_title || 'Position',
    roundName,
    companyName,
    companyInitials: companyName.charAt(0).toUpperCase(),
    interviewType: rawType,
    mode,
    isOnline,
    isLive,
    isPast,
    status: isLive ? 'LIVE' : (raw.status || 'SCHEDULED'),
    statusConfig,
    provider,
    scheduledDate: raw.scheduled_date || '',
    scheduledTime: raw.scheduled_time || '',
    startsAt: combinedDateTime,
    scheduledAtFormatted: raw.scheduled_at_formatted || dateInfo.fullFormatted,
    dateInfo,
    location: typeof raw.location === 'object' ? raw.location : { address: raw.location || 'Company Office' },
    meetingLink,
    joinUrl: meetingLink,
    canJoin: true,
    phoneNumber: raw.phone_number || '',
    notes: raw.notes || '',
    result: raw.result || 'PENDING',
    canReschedule: !isPast && raw.status !== 'COMPLETED'
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

  let backendList = [];
  let backendSuccess = false;
  try {
    const url = `${API_BASE_URL}/accounts/candidate/interviews/?${query.toString()}`;
    const response = await authenticatedFetch(url);
    if (response.ok) {
      backendSuccess = true;
      const data = await response.json();
      const rawList = Array.isArray(data) ? data : (data.results || []);
      backendList = rawList.map(normalizeInterviewRecord).filter(Boolean);
    }
  } catch (err) {
    console.warn("Backend candidate interviews fetch notice:", err);
  }

  // If backend responded, it is the authoritative source for this candidate
  if (backendSuccess) {
    let list = backendList;
    if (search && search.trim()) {
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

  // Fallback ONLY when backend is unreachable, scoped strictly to the current candidate
  const user = getAuthenticatedUser();
  const userEmail = (user?.email || '').toLowerCase().trim();
  const userId = String(user?.id || '');

  const localList = [];
  try {
    const localIntStr = localStorage.getItem('tnjobz_candidate_interviews');
    if (localIntStr) {
      const parsed = JSON.parse(localIntStr);
      if (Array.isArray(parsed)) {
        parsed.forEach(i => {
          const candEmail = (i.candidate_email || i.candidate?.email || '').toLowerCase().trim();
          const candId = String(i.candidate_id || i.candidate?.id || '');
          if ((userEmail && candEmail === userEmail) || (userId && candId === userId)) {
            const norm = normalizeInterviewRecord(i);
            if (norm) localList.push(norm);
          }
        });
      }
    }
    const localAppsStr = localStorage.getItem('tnjobz_candidate_applications');
    if (localAppsStr) {
      const parsed = JSON.parse(localAppsStr);
      if (Array.isArray(parsed)) {
        parsed.forEach(a => {
          const candEmail = (a.candidate?.email || a.email || '').toLowerCase().trim();
          const candId = String(a.candidate?.id || a.candidate_id || '');
          if ((userEmail && candEmail === userEmail) || (userId && candId === userId)) {
            if (a.interview && typeof a.interview === 'object') {
              const norm = normalizeInterviewRecord({
                id: a.interview.id || `app_int_${a.id}`,
                application: a.id,
                job: a.job_id,
                job_title: a.job_title || a.job?.title,
                company_name: a.company_name || a.job?.company_name,
                scheduled_date: a.interview.scheduled_date,
                scheduled_time: a.interview.scheduled_time,
                interview_type: a.interview.interview_type || 'ONLINE',
                meeting_link: a.interview.meeting_link,
                location: a.interview.location,
                status: a.interview.status || 'SCHEDULED'
              });
              if (norm) localList.push(norm);
            }
          }
        });
      }
    }
  } catch {}

  let list = localList;
  if (search && search.trim()) {
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
  try {
    const url = `${API_BASE_URL}/accounts/candidate/interviews/summary/`;
    const response = await authenticatedFetch(url);
    if (response.ok) {
      const data = await response.json();
      return {
        totalInterviews: data.totalInterviews || 0,
        scheduledCount: data.upcomingCount ?? data.scheduledCount ?? data.totalInterviews ?? 0,
        upcomingCount: data.upcomingCount || 0,
        completedCount: data.completedCount || 0,
        cancelledCount: data.cancelledCount || 0
      };
    }
  } catch (err) {
    console.warn("Interview summary fetch notice:", err);
  }

  const { interviews } = await getCandidateInterviews();
  return {
    totalInterviews: interviews.length,
    scheduledCount: interviews.length,
    upcomingCount: interviews.length,
    completedCount: 0,
    cancelledCount: 0
  };
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
  const buildResult = (days, hours, minutes, isPast, formattedCountdown) => {
    return {
      days,
      hours,
      minutes,
      isPast,
      formattedCountdown,
      toString() {
        return formattedCountdown;
      }
    };
  };

  if (!startsAtStr) return buildResult(0, 0, 0, true, 'Completed');
  try {
    const diff = new Date(startsAtStr).getTime() - Date.now();
    const diffMinutes = diff / (1000 * 60);
    if (diffMinutes <= 0 && diffMinutes >= -90) {
      return buildResult(0, 0, 0, true, 'Live Now / In Progress');
    }
    if (diffMinutes < -90) {
      return buildResult(0, 0, 0, true, 'Completed');
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    if (days === 0 && hours === 0) {
      return buildResult(days, hours, minutes, false, `${minutes}m remaining`);
    }
    return buildResult(days, hours, minutes, false, `${days > 0 ? `${days}d ` : ''}${hours}h ${minutes}m`);
  } catch {
    return buildResult(0, 0, 0, true, 'Live Now');
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
