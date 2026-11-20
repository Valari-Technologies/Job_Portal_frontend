import { getAuthenticatedUser } from '../auth/adminAuthService';

const NOTIF_STORAGE_PREFIX = 'tnjobz_recruiter_notifications';

function getNotificationStorageKey() {
  try {
    const user = getAuthenticatedUser();
    const email = (user?.email || '').toLowerCase().trim();
    return email ? `${NOTIF_STORAGE_PREFIX}_${email}` : NOTIF_STORAGE_PREFIX;
  } catch {
    return NOTIF_STORAGE_PREFIX;
  }
}

function getDefaultNotifications() {
  return [
    {
      id: 'notif_welcome',
      title: 'Welcome to TN Jobz Recruiter Portal',
      message: 'Your account is active. Free Starter Plan with 10 job credits is enabled.',
      notification_type: 'SYSTEM',
      reference_type: 'payment',
      reference_id: null,
      is_read: false,
      created_at: new Date(Date.now() - 3600000 * 24).toISOString()
    }
  ];
}

function getStoredNotifications() {
  const key = getNotificationStorageKey();
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  const defaults = getDefaultNotifications();
  try {
    localStorage.setItem(key, JSON.stringify(defaults));
  } catch {}
  return defaults;
}

function saveNotifications(items) {
  const key = getNotificationStorageKey();
  try {
    localStorage.setItem(key, JSON.stringify(items));
    window.dispatchEvent(new Event('recruiter_notifications_updated'));
  } catch {}
}

export async function getRecruiterNotifications(params = {}) {
  const items = getStoredNotifications();
  const unreadCount = items.filter(n => !n.is_read).length;

  return {
    results: items,
    unread_count: unreadCount,
    pagination: {
      current_page: params.page || 1,
      total_pages: 1,
      total_items: items.length,
      page_size: params.page_size || 20
    }
  };
}

export async function addRecruiterNotification({
  title,
  message,
  notification_type = 'SYSTEM',
  reference_type = 'payment',
  reference_id = null
}) {
  const items = getStoredNotifications();
  const newNotif = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    title,
    message,
    notification_type,
    reference_type,
    reference_id,
    is_read: false,
    created_at: new Date().toISOString()
  };

  const updated = [newNotif, ...items];
  saveNotifications(updated);
  return newNotif;
}

export async function getUnreadNotificationCount() {
  const items = getStoredNotifications();
  const unreadCount = items.filter(n => !n.is_read).length;
  return { unread_count: unreadCount };
}

export async function markNotificationAsRead(notificationId) {
  const items = getStoredNotifications();
  const updated = items.map(n => n.id === notificationId ? { ...n, is_read: true } : n);
  saveNotifications(updated);
  return { success: true, notification_id: notificationId, is_read: true };
}

export async function markAllNotificationsAsRead() {
  const items = getStoredNotifications();
  const updated = items.map(n => ({ ...n, is_read: true }));
  saveNotifications(updated);
  return { success: true, unread_count: 0 };
}
