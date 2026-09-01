// Future Django integration:
// Return only activity records the authenticated Admin is authorized to view.
// The backend must derive the Admin identity from request.user.
// Never accept an admin_id from the frontend to determine activity ownership.
// Super Admin audit access must remain under a separate endpoint/permission.

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

export async function getAdminActivities() {
  await delay();
  
  // Return empty initially until connected to real Django backend endpoint
  return {
    results: [],
    pagination: null
  };
}
