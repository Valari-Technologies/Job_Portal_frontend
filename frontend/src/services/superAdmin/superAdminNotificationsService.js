import { fetchWithAuth } from '../auth/adminAuthService';

const API_BASE_URL = 'http://127.0.0.1:8000';

/**
 * Fetch notifications for authenticated user from backend API.
 */
export async function getSuperAdminNotifications(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.unread_only) query.append('unread_only', 'true');
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.page) query.append('page', params.page);

    const url = `${API_BASE_URL}/accounts/notifications/?${query.toString()}`;
    const response = await fetchWithAuth(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch notifications: ${response.statusText}`);
    }

    const data = await response.json();
    const results = data.results || (Array.isArray(data) ? data : []);
    
    return {
      results,
      count: data.count || results.length,
      totalPages: data.count ? Math.ceil(data.count / (data.page_size || 10)) : 1,
    };
  } catch (error) {
    console.error("getSuperAdminNotifications error:", error);
    throw error;
  }
}

/**
 * Get unread notifications count from backend API.
 */
export async function getUnreadNotificationCountService() {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/accounts/notifications/unread-count/`);
    if (!response.ok) return 0;
    const data = await response.json();
    return data.unread_count || 0;
  } catch (error) {
    console.error("getUnreadNotificationCountService error:", error);
    return 0;
  }
}

/**
 * Mark single notification as read in backend database.
 */
export async function markNotificationAsRead(id) {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/accounts/notifications/${id}/mark-read/`, {
      method: 'POST'
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.detail || 'Failed to mark notification as read');
    }
    const data = await response.json();
    return data.notification;
  } catch (error) {
    console.error("markNotificationAsRead error:", error);
    throw error;
  }
}

/**
 * Mark all notifications as read in backend database.
 */
export async function markAllNotificationsAsRead() {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/accounts/notifications/mark-all-read/`, {
      method: 'POST'
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.detail || 'Failed to mark all notifications as read');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("markAllNotificationsAsRead error:", error);
    throw error;
  }
}

/**
 * Super Admin Broadcast Notification to Candidates, Employers, or All users.
 */
export async function sendBroadcastNotificationService({ targetRole = 'ALL', title, message, notificationType = 'SYSTEM_ANNOUNCEMENT' }) {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/accounts/admin/notifications/broadcast/`, {
      method: 'POST',
      body: JSON.stringify({
        target_role: targetRole,
        title,
        message,
        notification_type: notificationType
      })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const errorMsg = data.detail || data.message || 'Failed to broadcast announcement';
      return { success: false, message: errorMsg, errors: data };
    }
    return { success: true, data };
  } catch (error) {
    console.error("sendBroadcastNotificationService error:", error);
    return { success: false, message: error.message || 'Network error sending broadcast' };
  }
}

/**
 * Delete a single notification from database.
 */
export async function deleteNotificationService(id) {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/accounts/notifications/${id}/delete/`, {
      method: 'POST'
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.detail || 'Failed to delete notification');
    }
    return await response.json();
  } catch (error) {
    console.error("deleteNotificationService error:", error);
    throw error;
  }
}

/**
 * Clear all notifications from database.
 */
export async function clearAllNotificationsService() {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/accounts/notifications/clear-all/`, {
      method: 'POST'
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.detail || 'Failed to clear all notifications');
    }
    return await response.json();
  } catch (error) {
    console.error("clearAllNotificationsService error:", error);
    throw error;
  }
}
