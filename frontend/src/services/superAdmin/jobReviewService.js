import { fetchWithAuth } from '../auth/adminAuthService';

const API_BASE_URL = 'http://127.0.0.1:8000';

export async function fetchJobReviewsService(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.status && params.status !== 'ALL') query.append('status', params.status);
    if (params.category_id) query.append('category_id', params.category_id);
    if (params.employer_id) query.append('employer_id', params.employer_id);
    if (params.page) query.append('page', params.page);

    const url = `${API_BASE_URL}/accounts/admin/job-reviews/?${query.toString()}`;
    const response = await fetchWithAuth(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch job review queue: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      results: data.results || (Array.isArray(data) ? data : []),
      count: data.count || (Array.isArray(data) ? data.length : 0),
      totalPages: data.count ? Math.ceil(data.count / (data.page_size || 10)) : 1,
    };
  } catch (error) {
    console.error("fetchJobReviewsService error:", error);
    throw error;
  }
}

export async function reviewJobDecisionService(jobId, payload) {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/accounts/admin/jobs/${jobId}/review/`, {
      method: 'POST',
      body: JSON.stringify({
        action: payload.action,
        reason: payload.reason || payload.notes,
        notes: payload.notes || payload.reason,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = data.detail || data.message || 'Failed to submit job review decision.';
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
