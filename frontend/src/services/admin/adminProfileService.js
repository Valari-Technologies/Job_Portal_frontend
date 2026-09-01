// Future Django integration:
// Load the authenticated Admin profile.
// Save only allowed editable fields.
// Update the visible profile and header identity only after
// the backend returns a successful confirmed response.

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

export async function getAdminProfile() {
  await delay();
  return null; // Empty state initially until connected to real backend
}

export async function updateAdminProfile() {
  await delay();
  return null;
}
