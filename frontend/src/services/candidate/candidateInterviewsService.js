/**
 * Candidate Interviews Service
 * 
 * Handles candidate interview sessions, DRF API response normalization,
 * date/timezone formatting, live countdown calculations, secured join meeting URL fetching,
 * and reschedule request submission.
 * 
 * Django API Boundaries:
 * - GET /api/v1/candidates/interviews/ -> List scheduled candidate interviews
 * - GET /api/v1/candidates/interviews/summary/ -> Fetch summary counts (total scheduled, upcoming, etc.)
 * - GET /api/v1/candidates/interviews/{id}/ -> Fetch interview details
 * - GET /api/v1/candidates/interviews/{id}/join/ -> Get secured join access link
 * - POST /api/v1/candidates/interviews/{id}/reschedule/ -> Submit reschedule request
 */

const STORAGE_INTERVIEWS_KEY = 'statejobz_candidate_interviews';
const STORAGE_PREPARATION_CHECKLIST_KEY = 'statejobz_candidate_prep_checklist';

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
  NEXT_WEEK: {
    label: 'Next Week',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    color: '#475569'
  },
  STARTING_SOON: {
    label: 'Starting Soon',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-200',
    color: '#78350F'
  },
  IN_PROGRESS: {
    label: 'In Progress',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    color: '#065F46'
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
  PENDING_RESCHEDULE: {
    label: 'Reschedule Requested',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    color: '#92400E'
  },
  CANCELLED: {
    label: 'Cancelled',
    badgeClass: 'bg-red-100 text-red-700 border-red-200',
    color: '#B91C1C'
  }
};

/**
 * Safe status resolver with neutral fallback for unknown backend status codes
 */
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

  // Safe readable label fallback for unknown status
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

/**
 * Centralized date and time formatter for interview cards
 */
export function formatInterviewDate(startsAtStr, endsAtStr, timezoneStr = 'PST') {
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

    if (endsAtStr) {
      const endDate = new Date(endsAtStr);
      if (!isNaN(endDate.getTime())) {
        const endTimeFormatted = endDate.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        timeRange = `${startTimeFormatted} - ${endTimeFormatted} ${timezoneStr}`;
      }
    }

    const fullFormatted = `${startDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })}, ${timeRange}`;

    return {
      month,
      day,
      weekday,
      timeRange,
      fullFormatted
    };
  } catch (err) {
    console.error('Error formatting interview timestamp:', err);
    return {
      month: '—',
      day: '—',
      weekday: '—',
      timeRange: 'Time unavailable',
      fullFormatted: 'Date unavailable'
    };
  }
}

/**
 * Dynamic countdown calculator for Next Session panel
 */
export function calculateCountdown(startsAtStr) {
  if (!startsAtStr) return null;
  const targetTime = new Date(startsAtStr).getTime();
  if (isNaN(targetTime)) return null;

  const now = Date.now();
  const diffMs = targetTime - now;

  if (diffMs <= 0) {
    // If started within last 2 hours
    if (diffMs > -7200000) {
      return 'In progress';
    }
    return 'Session ended';
  }

  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  const remHours = diffHours % 24;
  const remMins = diffMins % 60;

  if (diffDays > 0) {
    return `Starting in ${diffDays} ${diffDays === 1 ? 'day' : 'days'}, ${remHours} ${remHours === 1 ? 'hour' : 'hours'}`;
  }
  if (diffHours > 0) {
    return `Starting in ${diffHours} ${diffHours === 1 ? 'hour' : 'hours'}, ${remMins} ${remMins === 1 ? 'mins' : 'mins'}`;
  }
  if (diffMins > 0) {
    return `Starting in ${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'}`;
  }
  return 'Starting soon';
}

/**
 * Normalization boundary converting raw Django DRF interview data to UI model
 */
export function normalizeInterviewRecord(raw) {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const id = String(raw.id || raw.interview_id || raw.pk || `int_${Date.now()}`);
  const rawStatus = raw.status || raw.interview_status || 'UPCOMING';
  const statusConfig = getInterviewStatusConfig(rawStatus);

  const roundName = raw.round_name || raw.roundName || raw.title || 'Technical Round';
  const description = raw.description || raw.notes || '';
  const startsAt = raw.starts_at || raw.startsAt || raw.scheduled_at || raw.scheduledAt || null;
  const endsAt = raw.ends_at || raw.endsAt || null;
  const timezone = raw.timezone || 'PST';
  const mode = (raw.mode || raw.interview_mode || 'ONLINE').toUpperCase();
  const provider = raw.provider || raw.meeting_provider || (mode === 'ONLINE' ? 'Zoom Video Call' : 'In-Person Meeting');
  
  const joinUrl = raw.join_url || raw.joinUrl || raw.meeting_url || raw.meetingUrl || null;
  const canJoin = Boolean(raw.can_join ?? raw.canJoin ?? (mode === 'ONLINE'));
  const canReschedule = Boolean(raw.can_reschedule ?? raw.canReschedule ?? true);

  const rawApp = raw.application || raw.application_details || {};
  const applicationId = String(raw.application_id || rawApp.id || '');

  const rawJob = raw.job || rawApp.job || {};
  const jobId = String(raw.job_id || rawJob.id || '');
  const jobTitle = rawJob.title || raw.job_title || raw.jobTitle || 'Job Title Unavailable';

  const rawCompany = raw.company || rawJob.company || rawApp.company || {};
  const companyId = String(rawCompany.id || raw.company_id || '');
  const companyName = rawCompany.name || raw.company_name || raw.company || 'Company Unavailable';
  const companyLogo = rawCompany.logo_url || rawCompany.logoUrl || raw.company_logo || null;
  const companyInitials = (companyName && companyName !== 'Company Unavailable')
    ? companyName.charAt(0).toUpperCase()
    : 'C';

  const rawLocation = raw.location || null;
  let locationObj = null;
  if (rawLocation) {
    if (typeof rawLocation === 'string') {
      locationObj = { address: rawLocation };
    } else if (typeof rawLocation === 'object') {
      locationObj = {
        address: rawLocation.address || rawLocation.formatted_address || '',
        latitude: rawLocation.latitude || null,
        longitude: rawLocation.longitude || null
      };
    }
  } else if (raw.address) {
    locationObj = { address: raw.address };
  }

  const rawInterviewer = raw.interviewer || {};
  const interviewerObj = {
    id: String(rawInterviewer.id || raw.interviewer_id || ''),
    displayName: rawInterviewer.display_name || rawInterviewer.name || raw.interviewer_name || 'Hiring Team'
  };

  const dateInfo = formatInterviewDate(startsAt, endsAt, timezone);

  return {
    id,
    status: String(rawStatus).toUpperCase(),
    statusConfig,
    roundName,
    description,
    startsAt,
    endsAt,
    timezone,
    mode,
    provider,
    joinUrl,
    canJoin,
    canReschedule,
    applicationId,
    jobId,
    jobTitle,
    companyId,
    companyName,
    companyLogo,
    companyInitials,
    location: locationObj,
    interviewer: interviewerObj,
    dateInfo
  };
}

/**
 * Seed initial fallback interview storage matching prompt requirements
 */
function seedInitialInterviews() {
  const now = new Date();
  
  // OCT 24 equivalent: 2 days 14 hours from now
  const date1 = new Date(now.getTime() + (2 * 24 * 3600 * 1000) + (14 * 3600 * 1000));
  const endDate1 = new Date(date1.getTime() + (90 * 60 * 1000));

  // OCT 29 equivalent: 7 days from now
  const date2 = new Date(now.getTime() + (7 * 24 * 3600 * 1000));
  const endDate2 = new Date(date2.getTime() + (120 * 60 * 1000));

  // Additional 3rd interview: 10 days from now
  const date3 = new Date(now.getTime() + (10 * 24 * 3600 * 1000));
  const endDate3 = new Date(date3.getTime() + (45 * 60 * 1000));

  const initialList = [
    {
      id: 'int_01',
      status: 'UPCOMING',
      round_name: 'Technical Round',
      company_name: 'Acme Corp',
      job_title: 'Senior Frontend Engineer',
      job_id: 'job_01',
      application_id: 'app_01',
      mode: 'ONLINE',
      provider: 'Zoom Video Call',
      starts_at: date1.toISOString(),
      ends_at: endDate1.toISOString(),
      timezone: 'PST',
      description: 'Deep dive into React rendering optimization and state management architecture. Prepare to discuss recent project challenges and system design.',
      can_join: true,
      can_reschedule: true,
      join_url: 'https://zoom.us/j/123456789'
    },
    {
      id: 'int_02',
      status: 'NEXT_WEEK',
      round_name: 'Panel Interview',
      company_name: 'Globex Inc',
      job_title: 'UX Designer',
      job_id: 'job_02',
      application_id: 'app_02',
      mode: 'IN_PERSON',
      address: '123 Innovation Drive, SF',
      starts_at: date2.toISOString(),
      ends_at: endDate2.toISOString(),
      timezone: 'PST',
      description: 'Final round presentation with the design leadership team. Please bring your portfolio and be ready to present a case study.',
      can_join: false,
      can_reschedule: true
    },
    {
      id: 'int_03',
      status: 'UPCOMING',
      round_name: 'HR & Cultural Alignment',
      company_name: 'InnovaTech Solutions',
      job_title: 'Backend Developer',
      job_id: 'job_03',
      application_id: 'app_03',
      mode: 'ONLINE',
      provider: 'Google Meet',
      starts_at: date3.toISOString(),
      ends_at: endDate3.toISOString(),
      timezone: 'PST',
      description: 'Discussion on past experience, career growth, team dynamics and compensation expectations.',
      can_join: true,
      can_reschedule: true,
      join_url: 'https://meet.google.com/abc-defg-hij'
    }
  ];

  try {
    localStorage.setItem(STORAGE_INTERVIEWS_KEY, JSON.stringify(initialList));
  } catch (err) {
    console.error('Failed to seed initial interviews:', err);
  }
  return initialList;
}

function getStoredInterviews() {
  try {
    const raw = localStorage.getItem(STORAGE_INTERVIEWS_KEY);
    if (!raw) {
      return seedInitialInterviews();
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error reading candidate interviews from storage:', err);
    return [];
  }
}

function saveStoredInterviews(list) {
  try {
    localStorage.setItem(STORAGE_INTERVIEWS_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Error saving candidate interviews to storage:', err);
  }
}

/**
 * Fetch candidate interviews list (supports DRF response contract, pagination, search)
 */
export async function getCandidateInterviews(params = {}) {
  await new Promise(resolve => setTimeout(resolve, 120));
  const { search = '', page = 1, pageSize = 10 } = params;

  const rawData = getStoredInterviews();

  // Support direct array or DRF paginated { results: [] }
  let list = Array.isArray(rawData)
    ? rawData
    : (rawData && Array.isArray(rawData.results) ? rawData.results : []);

  let normalized = list.map(normalizeInterviewRecord).filter(Boolean);

  // Exclude cancelled unless explicitly requested
  normalized = normalized.filter(i => i.status !== 'CANCELLED');

  // Search term filter
  if (search.trim()) {
    const term = search.trim().toLowerCase();
    normalized = normalized.filter(i =>
      i.roundName.toLowerCase().includes(term) ||
      i.jobTitle.toLowerCase().includes(term) ||
      i.companyName.toLowerCase().includes(term)
    );
  }

  // Sort by startsAt ascending (earliest first)
  normalized.sort((a, b) => {
    const tA = a.startsAt ? new Date(a.startsAt).getTime() : Infinity;
    const tB = b.startsAt ? new Date(b.startsAt).getTime() : Infinity;
    return tA - tB;
  });

  const totalCount = normalized.length;
  const startIndex = (page - 1) * pageSize;
  const paginatedList = normalized.slice(startIndex, startIndex + pageSize);

  return {
    interviews: paginatedList,
    totalCount,
    page,
    totalPages: Math.ceil(totalCount / pageSize) || 1
  };
}

/**
 * Fetch Candidate Interview Summary Metrics (Scheduled count, Upcoming, Completed)
 */
export async function getCandidateInterviewSummary() {
  await new Promise(resolve => setTimeout(resolve, 100));
  try {
    const rawData = getStoredInterviews();
    let list = Array.isArray(rawData)
      ? rawData
      : (rawData && Array.isArray(rawData.results) ? rawData.results : []);

    const normalized = list.map(normalizeInterviewRecord).filter(Boolean);
    const activeUpcoming = normalized.filter(i => i.status !== 'CANCELLED' && i.status !== 'COMPLETED');
    const completed = normalized.filter(i => i.status === 'COMPLETED');

    return {
      scheduledCount: activeUpcoming.length,
      upcomingCount: activeUpcoming.length,
      completedCount: completed.length
    };
  } catch (err) {
    console.error('Failed to compute candidate interview summary:', err);
    return null; // Return null so UI renders error/unavailable state instead of false 0
  }
}

/**
 * Fetch Candidate Next Session (earliest upcoming interview)
 */
export async function getCandidateNextInterview() {
  await new Promise(resolve => setTimeout(resolve, 100));
  try {
    const { interviews } = await getCandidateInterviews({ pageSize: 50 });
    const now = Date.now();

    // Filter upcoming future or currently active interviews
    const upcoming = interviews.filter(i => {
      if (i.status === 'COMPLETED' || i.status === 'CANCELLED') return false;
      if (!i.startsAt) return false;
      const t = new Date(i.startsAt).getTime();
      return !isNaN(t) && t + 7200000 > now; // within 2 hrs of start
    });

    return upcoming.length > 0 ? upcoming[0] : null;
  } catch (err) {
    console.error('Failed to fetch next interview:', err);
    return null;
  }
}

/**
 * Get secure join access link for an online interview session
 */
export async function getInterviewJoinAccess(interviewId) {
  await new Promise(resolve => setTimeout(resolve, 150));
  const list = getStoredInterviews();
  const target = list.find(i => String(i.id || i.interview_id) === String(interviewId));
  if (!target) {
    return { success: false, message: 'Interview session not found.' };
  }

  const joinUrl = target.join_url || target.joinUrl || 'https://zoom.us/j/123456789';
  return {
    success: true,
    joinUrl,
    canJoin: true
  };
}

/**
 * Submit candidate reschedule request for an interview session
 */
export async function requestInterviewReschedule(interviewId, payload) {
  await new Promise(resolve => setTimeout(resolve, 200));
  const { reason, preferredDate, preferredTime, notes } = payload;

  const list = getStoredInterviews();
  const index = list.findIndex(i => String(i.id || i.interview_id) === String(interviewId));

  if (index === -1) {
    return { success: false, message: 'Interview session not found.' };
  }

  const updated = [...list];
  updated[index] = {
    ...updated[index],
    status: 'PENDING_RESCHEDULE',
    reschedule_request: {
      reason,
      preferredDate,
      preferredTime,
      notes,
      requestedAt: new Date().toISOString()
    }
  };

  saveStoredInterviews(updated);
  return {
    success: true,
    message: 'Reschedule request submitted successfully. Recruiter will review your requested slots.',
    interview: normalizeInterviewRecord(updated[index])
  };
}

/**
 * Preparation Checklist state management (System Check & Review Notes)
 */
export function getPreparationChecklist() {
  try {
    const raw = localStorage.getItem(STORAGE_PREPARATION_CHECKLIST_KEY);
    if (raw) return JSON.parse(raw);
    
    const defaults = {
      systemCheckCompleted: true,
      reviewNotesPrepared: false
    };
    localStorage.setItem(STORAGE_PREPARATION_CHECKLIST_KEY, JSON.stringify(defaults));
    return defaults;
  } catch {
    return { systemCheckCompleted: true, reviewNotesPrepared: false };
  }
}

export function togglePreparationItem(key) {
  try {
    const current = getPreparationChecklist();
    const updated = { ...current, [key]: !current[key] };
    localStorage.setItem(STORAGE_PREPARATION_CHECKLIST_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return getPreparationChecklist();
  }
}
