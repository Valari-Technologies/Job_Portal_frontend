// Future Django notifications API integration:
// GET /api/v1/notifications/
// GET /api/v1/notifications/unread-count/
// PATCH /api/v1/notifications/{id}/read/
// POST /api/v1/notifications/mark-all-read/
//
// ERD Schema:
// id, user_id, notification_type, title, message, reference_type, reference_id, is_read, created_at

export async function getRecruiterNotifications(params = {}) {
  console.log("Fetching recruiter notifications with params:", params);
  // Boundary for backend response
  return {
    results: [],
    unread_count: 0,
    pagination: {
      current_page: params.page || 1,
      total_pages: 1,
      total_items: 0,
      page_size: params.page_size || 20
    }
  };
}

export async function getUnreadNotificationCount() {
  // Boundary for backend unread count API
  return { unread_count: 0 };
}

export async function markNotificationAsRead(notificationId) {
  console.log("Marking notification as read:", notificationId);
  return { success: true, notification_id: notificationId, is_read: true };
}

export async function markAllNotificationsAsRead() {
  console.log("Marking all recruiter notifications as read");
  return { success: true, unread_count: 0 };
}
