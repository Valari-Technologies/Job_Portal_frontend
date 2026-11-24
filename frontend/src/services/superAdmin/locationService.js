import { fetchWithAuth } from '../auth/adminAuthService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export async function fetchLocations(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.location_type) query.append('location_type', params.location_type);
    if (params.parent_id !== undefined && params.parent_id !== null) {
      query.append('parent_id', params.parent_id);
    }

    const url = `${API_BASE_URL}/accounts/locations/?${query.toString()}`;
    const response = await fetchWithAuth(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch locations: ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : (data.results || []);
  } catch (error) {
    console.error("fetchLocations error:", error);
    return [];
  }
}

export async function createLocation(payload) {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/accounts/locations/`, {
      method: 'POST',
      body: JSON.stringify({
        name: payload.name,
        location_type: payload.location_type,
        parent: payload.parent_id || payload.parent || null,
        is_active: payload.is_active !== undefined ? payload.is_active : true,
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      let message = 'Failed to create location.';
      if (typeof data === 'object' && data !== null) {
        if (data.name) message = Array.isArray(data.name) ? data.name[0] : data.name;
        else if (data.parent) message = Array.isArray(data.parent) ? data.parent[0] : data.parent;
        else if (data.detail) message = data.detail;
      }
      return { success: false, message, errors: data };
    }

    return { success: true, data };
  } catch {
    return { success: false, message: 'Network error. Please check server connection.' };
  }
}
