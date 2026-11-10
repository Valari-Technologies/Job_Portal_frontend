import { fetchWithAuth } from '../auth/adminAuthService';

const API_BASE_URL = 'http://127.0.0.1:8000';

export async function fetchEmployerVerificationsService(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.status) query.append('status', params.status);
    if (params.page) query.append('page', params.page);

    const url = `${API_BASE_URL}/accounts/admin/employer-verifications/?${query.toString()}`;
    const response = await fetchWithAuth(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch verification queue: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      results: data.results || (Array.isArray(data) ? data : []),
      count: data.count || (Array.isArray(data) ? data.length : 0),
      totalPages: data.count ? Math.ceil(data.count / (data.page_size || 10)) : 1,
    };
  } catch (error) {
    console.error("fetchEmployerVerificationsService error:", error);
    throw error;
  }
}

export async function verifyEmployerDecisionService(employerId, payload) {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/accounts/admin/employers/${employerId}/verify/`, {
      method: 'POST',
      body: JSON.stringify({
        decision: payload.decision,
        rejection_reason: payload.reason || payload.rejection_reason || payload.notes,
        notes: payload.notes || payload.reason,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = data.detail || data.message || 'Failed to submit verification decision.';
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
