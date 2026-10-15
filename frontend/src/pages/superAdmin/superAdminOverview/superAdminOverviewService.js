import { fetchWithAuth } from '../../../services/auth/adminAuthService';

const API_BASE_URL = 'http://127.0.0.1:8000';

let pendingPromise = null;
let lastRange = null;

/**
 * Single-flight cached fetch to /accounts/admin/analytics/?range={cleanRange}
 * Guarantees that concurrent calls from Promise.all share a single live backend request.
 */
async function fetchOverviewRawData(range = '7days') {
  const cleanRange = String(range).replace(/[^0-9]/g, '') || '7';

  if (pendingPromise && lastRange === cleanRange) {
    return pendingPromise;
  }

  lastRange = cleanRange;
  pendingPromise = (async () => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/accounts/admin/analytics/?range=${cleanRange}`);
      if (!response.ok) {
        throw new Error(`Analytics API error: status ${response.status}`);
      }
      const json = await response.json();
      return json;
    } catch (err) {
      console.error("Live overview fetch failed:", err);
      return {
        metrics: {
          candidate_registrations: { value: 0, change: "0%" },
          verified_employers: { value: 0, change: "0%" },
          active_jobs: { value: 0, change: "0%" },
          applications: { value: 0, change: "0%" }
        },
        trends: [],
        queues: {
          employerVerifications: { count: 0, list: [] },
          jobsPendingReview: { count: 0, list: [] },
          reportedJobs: { count: 0, list: [] },
          lowQualityProfiles: { count: 0, list: [] }
        },
        job_activity: { live: 0, pendingReview: 0, draft: 0, closed: 0, total: 0 },
        districts: [],
        recent_activities: []
      };
    } finally {
      setTimeout(() => {
        pendingPromise = null;
      }, 300);
    }
  })();

  return pendingPromise;
}

/**
 * Returns dashboard top metrics based on the current date range (100% Live DB).
 */
export async function getOverviewMetrics(range = '7days') {
  const data = await fetchOverviewRawData(range);
  const m = data.metrics || {};
  return {
    candidates: {
      value: m.candidate_registrations?.value ?? 0,
      pctChange: m.candidate_registrations?.change ?? "0%"
    },
    employers: {
      value: m.verified_employers?.value ?? 0,
      pctChange: m.verified_employers?.change ?? "0%"
    },
    liveJobs: {
      value: m.active_jobs?.value ?? 0,
      pctChange: m.active_jobs?.change ?? "0%"
    },
    applications: {
      value: m.applications?.value ?? 0,
      pctChange: m.applications?.change ?? "0%"
    }
  };
}

/**
 * Returns trend series for Applications & New registrations (100% Live DB).
 */
export async function getApplicationsRegistrationTrend(range = '7days') {
  const data = await fetchOverviewRawData(range);
  return data.trends || [];
}

/**
 * Returns queue counts and records for the "Action Required" panel (100% Live DB).
 */
export async function getActionQueues(range = '7days') {
  const data = await fetchOverviewRawData(range);
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
export async function getJobActivity(range = '7days') {
  const data = await fetchOverviewRawData(range);
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
export async function getHiringDistricts(range = '7days') {
  const data = await fetchOverviewRawData(range);
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
export async function getRecentActivity(range = '7days') {
  const data = await fetchOverviewRawData(range);
  return data.recent_activities || [];
}

/**
 * Returns super admin notifications from backend.
 */
export async function getNotifications() {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/accounts/admin/notifications/`);
    if (response.ok) {
      const data = await response.json();
      return data.notifications || data.results || [];
    }
  } catch (err) {
    console.warn("Could not fetch notifications:", err);
  }
  return [];
}
