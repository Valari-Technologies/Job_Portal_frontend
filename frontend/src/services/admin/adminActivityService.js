import { fetchWithAuth } from '../auth/adminAuthService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export async function getAdminActivities(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.action && params.action !== 'all') query.append('action', params.action);

    const response = await fetchWithAuth(`${API_BASE_URL}/accounts/admin/audit-events/?${query.toString()}`);
    if (response.ok) {
      const data = await response.json();
      const list = Array.isArray(data) ? data : (data.results || []);
      const results = list.map(evt => ({
        id: evt.id,
        occurred_at: evt.timestamp ? new Date(evt.timestamp).toLocaleString() : '—',
        actor_display_name: evt.actor_email || evt.actor?.username || 'Admin',
        action_label: evt.action || 'Action',
        entity_display_name: evt.target_repr || evt.target_type || 'Recruiter',
        details: evt.description || `${evt.action} recorded`,
        ip_address: evt.ip_address || '—'
      }));
      return {
        results,
        pagination: data.pagination || null
      };
    }
  } catch (err) {
    console.warn("getAdminActivities failed:", err);
  }

  return {
    results: [],
    pagination: null
  };
}
