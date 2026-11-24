import { fetchWithAuth } from '../auth/adminAuthService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

/**
 * Fetch Super Admin Job Reports list with summary counts and filters
 */
export async function fetchJobReportsService(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.status && params.status !== 'ALL') query.append('status', params.status);
    if (params.location) query.append('location', params.location);
    if (params.page) query.append('page', params.page);

    const url = `${API_BASE_URL}/accounts/admin/reports/?${query.toString()}`;
    const response = await fetchWithAuth(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch job reports queue: ${response.statusText}`);
    }

    const data = await response.json();
    const results = data.results || (Array.isArray(data) ? data : []);
    const summary = data.summary || {
      open_count: results.filter(r => r.status === 'PENDING').length,
      reviewed_count: results.filter(r => r.status === 'REVIEWED').length,
      dismissed_count: results.filter(r => r.status === 'REJECTED').length,
      total_count: results.length
    };

    return {
      results,
      summary,
      count: data.count || results.length,
      totalPages: data.count ? Math.ceil(data.count / (data.page_size || 10)) : 1,
    };
  } catch (error) {
    console.error("fetchJobReportsService error:", error);
    throw error;
  }
}

/**
 * Super Admin Decision on Job Report (Mark Reviewed, Dismiss, or Moderate Linked Job)
 */
export async function reportDecisionService(reportId, payload) {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/accounts/admin/reports/${reportId}/decision/`, {
      method: 'POST',
      body: JSON.stringify({
        action: payload.action,
        notes: payload.notes || payload.reason || '',
        reason: payload.reason || payload.notes || '',
        job_action: payload.job_action || '',
        job_reason: payload.job_reason || payload.notes || '',
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = data.detail || data.message || 'Failed to submit report decision.';
      return { success: false, message, errors: data };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Network error. Please check server connection.',
    };
  }
}

/**
 * Submit job report from candidate or user
 */
export async function submitJobReportService(payload) {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/accounts/job-reports/`, {
      method: 'POST',
      body: JSON.stringify({
        job_id: payload.job_id || payload.jobId,
        reason: payload.reason,
        description: payload.description || '',
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = data.detail || data.message || 'Failed to submit job report.';
      return { success: false, message, errors: data };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Network error. Please check server connection.',
    };
  }
}
