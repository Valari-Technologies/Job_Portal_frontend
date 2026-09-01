// Future Django integration:
// GET  /api/super-admin/admins/?search=&status=&page=
// POST /api/super-admin/admins/
// POST /api/v1/candidates/
// POST /api/v1/companies/
// POST /api/v1/job-categories/
// POST /api/v1/locations/
// POST /api/v1/skills/

export async function fetchAdminsService() {
  return [];
}

export async function createAdminService(payload) {
  console.log("Future Create Admin POST payload:", payload);
  return { success: true };
}

export async function createCandidateService(payload) {
  console.log("Future Create Candidate POST payload:", payload);
  return { success: true };
}

export async function createEmployerService(payload) {
  console.log("Future Create Employer POST payload:", payload);
  return { success: true };
}

export async function createCategoryService(payload) {
  console.log("Future Create Category POST payload:", payload);
  return { success: true };
}

export async function createLocationService(payload) {
  console.log("Future Create Location POST payload:", payload);
  return { success: true };
}

export async function createSkillService(payload) {
  console.log("Future Create Skill POST payload:", payload);
  return { success: true };
}
