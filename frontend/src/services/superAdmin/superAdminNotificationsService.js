/**
 * Super Admin Notifications Service
 * 
 * Manages notification state, unread counts, and read markers for Super Admin.
 * Conforms to Django backend Notification ERD structure:
 * - id
 * - user_id
 * - notification_type
 * - title
 * - message
 * - reference_type (admin, employer_verification, job_review, query, report, security)
 * - reference_id
 * - is_read
 * - created_at
 * 
 * Django Integration Boundary:
 * - GET /api/v1/notifications/ -> Paginated notifications list for authenticated user
 * - PATCH /api/v1/notifications/{id}/read/ -> Mark single notification as read
 * - POST /api/v1/notifications/mark-all-read/ -> Mark all notifications as read
 */

const NOTIFICATIONS_STORAGE_KEY = 'statejobz_super_admin_notifications';

const DEFAULT_SUPER_ADMIN_NOTIFICATIONS = [
  {
    id: 'notif_001',
    user_id: 'sa_usr_001',
    notification_type: 'EMPLOYER_VERIFICATION',
    title: 'Employer Verification Request',
    message: 'Coral Systems Pvt Ltd submitted business registration documents for review.',
    reference_type: 'employer_verification',
    reference_id: 'emp_ver_101',
    is_read: false,
    created_at: '2026-09-04T08:30:00Z',
    formatted_time: '10 mins ago'
  },
  {
    id: 'notif_002',
    user_id: 'sa_usr_001',
    notification_type: 'JOB_REVIEW',
    title: 'Job Submitted for Review',
    message: 'New job "Senior React Architect" from Tech Corp is pending moderation.',
    reference_type: 'job_review',
    reference_id: 'job_rev_204',
    is_read: false,
    created_at: '2026-09-04T07:15:00Z',
    formatted_time: '1 hour ago'
  },
  {
    id: 'notif_003',
    user_id: 'sa_usr_001',
    notification_type: 'SECURITY_ALERT',
    title: 'Security Alert: New Sign-in',
    message: 'Super Admin login confirmed from Chrome on Windows (IP 106.51.72.10).',
    reference_type: 'security',
    reference_id: 'sec_evt_309',
    is_read: false,
    created_at: '2026-09-04T06:00:00Z',
    formatted_time: '3 hours ago'
  },
  {
    id: 'notif_004',
    user_id: 'sa_usr_001',
    notification_type: 'JOB_REPORT',
    title: 'Job Report Received',
    message: 'Job listing "Data Entry Operator" was reported for inappropriate content.',
    reference_type: 'report',
    reference_id: 'rep_evt_412',
    is_read: true,
    created_at: '2026-09-03T16:45:00Z',
    formatted_time: 'Yesterday'
  },
  {
    id: 'notif_005',
    user_id: 'sa_usr_001',
    notification_type: 'ADMIN_EVENT',
    title: 'Admin Account Created',
    message: 'Admin profile for Ramesh K (District Coordinator) activated successfully.',
    reference_type: 'admin',
    reference_id: 'adm_usr_505',
    is_read: true,
    created_at: '2026-09-02T11:20:00Z',
    formatted_time: '2 days ago'
  }
];

function loadStoredNotifications() {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(DEFAULT_SUPER_ADMIN_NOTIFICATIONS));
      return [...DEFAULT_SUPER_ADMIN_NOTIFICATIONS];
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading Super Admin notifications storage:', err);
    return [...DEFAULT_SUPER_ADMIN_NOTIFICATIONS];
  }
}

function saveNotificationsToStorage(list) {
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Error saving Super Admin notifications storage:', err);
  }
}

/**
 * Fetch all notifications
 */
export async function getSuperAdminNotifications() {
  await new Promise(resolve => setTimeout(resolve, 150));
  return loadStoredNotifications();
}

/**
 * Mark single notification as read
 */
export async function markNotificationAsRead(id) {
  await new Promise(resolve => setTimeout(resolve, 100));
  const list = loadStoredNotifications();
  const updated = list.map(n => n.id === id ? { ...n, is_read: true } : n);
  saveNotificationsToStorage(updated);
  return updated;
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead() {
  await new Promise(resolve => setTimeout(resolve, 150));
  const list = loadStoredNotifications();
  const updated = list.map(n => ({ ...n, is_read: true }));
  saveNotificationsToStorage(updated);
  return updated;
}

/**
 * Clear or remove single notification
 */
export async function deleteNotification(id) {
  await new Promise(resolve => setTimeout(resolve, 150));
  const list = loadStoredNotifications();
  const updated = list.filter(n => n.id !== id);
  saveNotificationsToStorage(updated);
  return updated;
}
