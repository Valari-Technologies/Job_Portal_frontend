import { fetchWithAuth } from '../../../services/auth/adminAuthService';

const API_BASE_URL = 'http://127.0.0.1:8000';

let pendingPromise = null;
let lastKey = null;

export function invalidateOverviewCache() {
  pendingPromise = null;
  lastKey = null;
}

/**
 * Builds the location scope (state / district) sent to the backend.
 * "All India" (or nothing) means: no location filter.
 */
function normalizeLocation(location = {}) {
  const state = String(location.state || '').trim();
  const district = String(location.district || '').trim();
  if (!state || state.toLowerCase() === 'all india') {
    return { state: '', district: '' };
  }
  return { state, district };
}

/**
 * Single-flight fetch to /accounts/admin/analytics/?range={cleanRange}&loc_state=..&loc_district=..
 * Guarantees that concurrent calls from Promise.all share a single live backend request.
 * Failures are surfaced (never replaced with fake zero data) so the page can show its error state.
 */
async function fetchOverviewRawData(range = '7days', location = {}) {
  const cleanRange = String(range).replace(/[^0-9]/g, '') || '7';
  const loc = normalizeLocation(location);
  const key = `${cleanRange}|${loc.state}|${loc.district}`;

  if (pendingPromise && lastKey === key) {
    return pendingPromise;
  }

  lastKey = key;
  const query = new URLSearchParams({ range: cleanRange });
  if (loc.state) query.append('loc_state', loc.state);
  if (loc.district) query.append('loc_district', loc.district);

  const promise = (async () => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/accounts/admin/analytics/?${query.toString()}`);
      if (!response.ok) {
        throw new Error(`Analytics API error: status ${response.status}`);
      }
      return await response.json();
    } finally {
      setTimeout(() => {
        if (pendingPromise === promise) {
          pendingPromise = null;
        }
      }, 300);
    }
  })();
  pendingPromise = promise;

  return promise;
}

/**
 * Returns dashboard top metrics based on the current date range and location (100% Live DB).
 */
export async function getOverviewMetrics(range = '7days', location = {}) {
  const data = await fetchOverviewRawData(range, location);
  const m = data.metrics || {};
  return {
    candidates: {
      value: m.candidate_registrations?.value ?? 0,
      pctChange: m.candidate_registrations?.change ?? "0.0%"
    },
    employers: {
      value: m.verified_employers?.value ?? 0,
      pctChange: m.verified_employers?.pct_change ?? "0.0%"
    },
    liveJobs: {
      value: m.active_jobs?.value ?? 0,
      pctChange: m.active_jobs?.change ?? "0.0%"
    },
    applications: {
      value: m.applications?.value ?? 0,
      pctChange: m.applications?.change ?? "0.0%"
    }
  };
}

/**
 * Returns trend series for Applications & New registrations (100% Live DB).
 */
export async function getApplicationsRegistrationTrend(range = '7days', location = {}) {
  const data = await fetchOverviewRawData(range, location);
  return data.trends || [];
}

/**
 * Returns queue counts and records for the "Action Required" panel (100% Live DB).
 */
export async function getActionQueues(range = '7days', location = {}) {
  const data = await fetchOverviewRawData(range, location);
  return data.queues || {
    employerVerifications: { count: 0, list: [] },
    jobsPendingReview: { count: 0, list: [] },
    reportedJobs: { count: 0, list: [] },
    lowQualityProfiles: { count: 0, list: [] }
  };
}

/**
 * Returns breakdown counts for Job statuses (100% Live DB).
 */
export async function getJobActivity(range = '7days', location = {}) {
  const data = await fetchOverviewRawData(range, location);
  return data.job_activity || {
    live: 0,
    pendingReview: 0,
    draft: 0,
    closed: 0,
    total: 0
  };
}

/**
 * Returns live job counts grouped by district (100% Live DB).
 */
export async function getHiringDistricts(range = '7days', location = {}) {
  const data = await fetchOverviewRawData(range, location);
  const rawDistricts = data.districts || [];
  const totalLiveJobs = data.job_activity?.live || rawDistricts.reduce((acc, d) => acc + (d.jobs || d.count || 0), 0);

  return rawDistricts.slice(0, 5).map(d => {
    const jobCount = d.count ?? d.jobs ?? 0;
    const share = totalLiveJobs > 0 ? `${Math.round((jobCount / totalLiveJobs) * 100)}%` : (d.share || "0%");
    return {
      district: d.district || "District",
      count: jobCount,
      share
    };
  });
}

/**
 * Returns recent activity stream entries from live audit log (100% Live DB).
 */
export async function getRecentActivity(range = '7days', location = {}) {
  const data = await fetchOverviewRawData(range, location);
  return data.recent_activities || [];
}

/**
 * Returns super admin notifications from backend.
 */
export async function getNotifications() {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/accounts/notifications/`);
    if (response.ok) {
      const data = await response.json();
      return data.notifications || data.results || (Array.isArray(data) ? data : []);
    }
  } catch (err) {
    console.warn("Could not fetch notifications:", err);
  }
  return [];
}

/**
 * Applies a moderation decision to a record in an "Action required" queue (real backend call).
 * decision: 'APPROVE' | 'REJECT' | 'DISMISS' | 'HIDE'
 */
export async function submitQueueDecision(queueKey, recordId, decision, reason = '') {
  let url;
  let body;

  if (queueKey === 'employerVerifications') {
    url = `${API_BASE_URL}/accounts/admin/employers/${recordId}/verify/`;
    body = decision === 'APPROVE'
      ? { decision: 'APPROVED' }
      : { decision: 'REJECTED', rejection_reason: reason, notes: reason };
  } else if (queueKey === 'jobsPendingReview') {
    url = `${API_BASE_URL}/accounts/admin/jobs/${recordId}/review/`;
    body = decision === 'APPROVE'
      ? { action: 'APPROVED' }
      : { action: 'REJECTED', reason, notes: reason };
  } else if (queueKey === 'reportedJobs') {
    url = `${API_BASE_URL}/accounts/admin/reports/${recordId}/decision/`;
    body = decision === 'DISMISS'
      ? { action: 'REJECTED', notes: reason }
      : { action: 'REVIEWED', notes: reason || 'Job hidden by Super Admin', job_action: 'CLOSED', job_reason: reason || 'Job hidden by Super Admin' };
  } else if (queueKey === 'lowQualityProfiles') {
    url = `${API_BASE_URL}/accounts/admin/candidates/${recordId}/action/`;
    body = { action: decision, notes: reason };
  } else {
    return { success: false, message: 'This queue has no backend action.' };
  }

  try {
    const response = await fetchWithAuth(url, { method: 'POST', body: JSON.stringify(body) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return { success: false, message: data.detail || data.message || 'Action failed. Please try again.' };
    }
    invalidateOverviewCache();
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message || 'Network error. Please check server connection.' };
  }
}
