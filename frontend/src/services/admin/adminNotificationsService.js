// Future Django integration:
// Fetch only notifications belonging to the authenticated Admin.
// Use the backend response as the source of truth for unseen/unread counts.
// When this page becomes visible, mark the current notifications as seen
// and update shared badge state only after the backend confirms success.

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

export async function getAdminNotifications() {
  await delay();
  return {
    results: [],
    pagination: null
  };
}
