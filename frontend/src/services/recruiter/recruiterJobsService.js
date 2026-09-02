// Future Django integration:
// Return only jobs and job metrics visible to the authenticated
// Recruiter through their linked Company and permissions.
// Never trust a client-supplied company_id for authorization.
//
// Endpoint boundary (when confirmed): GET /api/v1/recruiter/jobs/

export function getRecruiterJobsData() {
  return {
    metrics: {
      active_jobs: 0,
      total_applications: 0,
      interviews_scheduled: 0
    },
    jobs: [],
    pagination: {
      current_page: 1,
      total_pages: 1,
      total_items: 0,
      page_size: 10
    }
  };
}

export async function createJobDraftService(jobPayload) {
  // Future Django integration: POST /api/v1/jobs/
  // All new job postings start in Draft status.
  console.log("Future Job Creation (Draft) POST payload:", jobPayload);
  return { success: true, status: 'Draft' };
}
