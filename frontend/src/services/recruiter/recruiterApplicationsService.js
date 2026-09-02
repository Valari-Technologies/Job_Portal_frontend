// Future Django integration:
// Return only applications for jobs belonging to the authenticated
// Recruiter's authorized company.
//
// Status transitions must be validated by the backend and recorded
// in application_status_history with actor, timestamp and notes.
//
// Resume access must use protected authorization and signed URLs.
//
// Endpoint boundary (when confirmed): GET /api/v1/applications/

export function getRecruiterApplicationsData() {
  return {
    metrics: {
      total_active: 0,
      conversion_rate: null,
      average_time_to_hire_days: null
    },
    filters: {
      statuses: [
        { value: 'ALL', label: 'All Statuses' },
        { value: 'APPLIED', label: 'Applied' },
        { value: 'VIEWED', label: 'Under Review' },
        { value: 'SHORTLISTED', label: 'Shortlisted' },
        { value: 'EMPLOYER_CONTACTED', label: 'Employer Contacted' },
        { value: 'INTERVIEW', label: 'Interview' },
        { value: 'SELECTED', label: 'Selected' },
        { value: 'REJECTED', label: 'Rejected' },
        { value: 'WITHDRAWN', label: 'Withdrawn' }
      ],
      jobs: []
    },
    applications: [],
    pagination: {
      current_page: 1,
      total_pages: 1,
      total_items: 0,
      page_size: 12
    }
  };
}

export async function updateApplicationStatusService(applicationId, newStatus, note = '') {
  // Future Django integration: PATCH /api/v1/applications/:id/
  console.log("Future Application Status Update:", { applicationId, newStatus, note });
  return { success: true, status: newStatus };
}
