import { fetchWithAuth } from '../auth/adminAuthService';

const API_BASE_URL = 'http://127.0.0.1:8000';

export async function fetchAuditEvents(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page);
    if (params.page_size) query.append('page_size', params.page_size);
    if (params.start_date) query.append('start_date', params.start_date);
    if (params.end_date) query.append('end_date', params.end_date);
    if (params.action && params.action !== 'ALL') query.append('action', params.action);
    if (params.outcome && params.outcome !== 'ALL') query.append('outcome', params.outcome);
    if (params.target_type && params.target_type !== 'ALL') query.append('target_type', params.target_type);
    if (params.actor) query.append('actor', params.actor);
    if (params.search) query.append('search', params.search);

    const url = `${API_BASE_URL}/accounts/admin/audit-events/?${query.toString()}`;
    const response = await fetchWithAuth(url);
    
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("Forbidden: Super Admin privileges required.");
      }
      if (response.status === 401) {
        throw new Error("Unauthorized: Please sign in as Super Admin.");
      }
      throw new Error(`Failed to load audit events (${response.status})`);
    }

    const data = await response.json();
    return {
      success: true,
      results: data.results || (Array.isArray(data) ? data : []),
      count: data.count || (Array.isArray(data) ? data.length : 0),
      next: data.next,
      previous: data.previous,
    };
  } catch (error) {
    console.error("fetchAuditEvents error:", error);
    return {
      success: false,
      message: error.message || "Failed to load audit events.",
      results: [],
      count: 0
    };
  }
}

export async function fetchSecurityPosture() {
  try {
    const url = `${API_BASE_URL}/accounts/admin/security-posture/`;
    const response = await fetchWithAuth(url);
    
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("Forbidden: Super Admin privileges required.");
      }
      throw new Error(`Failed to load security posture (${response.status})`);
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("fetchSecurityPosture error:", error);
    return {
      success: false,
      message: error.message || "Failed to load security posture.",
    };
  }
}

export async function fetchAccessReviews(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page);
    if (params.page_size) query.append('page_size', params.page_size);

    const url = `${API_BASE_URL}/accounts/admin/access-reviews/?${query.toString()}`;
    const response = await fetchWithAuth(url);
    
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("Forbidden: Super Admin privileges required.");
      }
      throw new Error(`Failed to load access reviews (${response.status})`);
    }

    const data = await response.json();
    return {
      success: true,
      results: data.results || (Array.isArray(data) ? data : []),
      count: data.count || (Array.isArray(data) ? data.length : 0),
      next: data.next,
      previous: data.previous,
    };
  } catch (error) {
    console.error("fetchAccessReviews error:", error);
    return {
      success: false,
      message: error.message || "Failed to load access reviews.",
      results: [],
      count: 0
    };
  }
}

export async function updateUserStatus(userId, status) {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/accounts/admin/users/${userId}/status/`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return { success: false, message: data.detail || 'Failed to update user status.' };
    }

    return { success: true, data };
  } catch {
    return { success: false, message: 'Network error. Please try again.' };
  }
}
