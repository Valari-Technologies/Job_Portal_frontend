// Future Django integration:
// Load only dashboard data belonging to the authenticated Recruiter's Company.
// Never expose another Company's jobs, applications, candidates,
// interviews, payment records, or company profile.
//
// Endpoint boundary (when confirmed): GET /api/v1/recruiter/dashboard/

export function getRecruiterDashboardData() {
  return {
    recruiter: null,
    company: null,
    wallet_balance: 0.00,
    metrics: {
      active_jobs: 0,
      total_applications: 0,
      shortlisted: 0,
      pending: 0,
      interviews: 0,
      hired: 0,
      job_credits: 0
    },
    recent_applications: [],
    interviews_today: []
  };
}

export async function createJobDraftService(jobPayload) {
  // Future Django integration: POST /api/v1/jobs/
  // New job starts as Draft state.
  console.log("Future Job Creation (Draft) POST payload:", jobPayload);
  return { success: true, status: 'Draft' };
}
