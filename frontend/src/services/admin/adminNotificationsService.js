import { fetchWithAuth } from '../auth/adminAuthService';

const API_BASE_URL = 'http://127.0.0.1:8000';

export async function getAdminNotifications(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.unread_only) query.append('unread_only', 'true');

    const response = await fetchWithAuth(`${API_BASE_URL}/accounts/notifications/?${query.toString()}`);
    if (response.ok) {
      const data = await response.json();
      const list = Array.isArray(data) ? data : (data.results || []);
      const results = list.map(n => ({
        id: n.id,
        title: n.title,
        message: n.message,
        notification_type: n.notification_type,
        is_read: n.is_read,
        created_at: n.created_at ? new Date(n.created_at).toLocaleString() : 'Just now'
      }));
      return {
        results,
        pagination: data.pagination || null
      };
    }
  } catch (err) {
    console.warn("getAdminNotifications failed:", err);
  }

  return {
    results: [],
    pagination: null
  };
}
