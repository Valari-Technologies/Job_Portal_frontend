// Future Django integration:
// GET /api/admin/recruiters/?search=&status=&page=&page_size=
//
// Return only Employer accounts created by or assigned to
// the authenticated Admin.
//
// Never return Super Admin, Admin, or Candidate accounts here.

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

export async function getAdminRecruiters() {
  await delay();
  
  // Return empty initially until connected to real Django backend endpoint
  return {
    status_counts: null,
    results: [],
    pagination: null
  };
}
