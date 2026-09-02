// Future Django integration:
// Return Candidates only through Applications belonging to jobs owned
// by the authenticated Recruiter's authorized company.
//
// Candidate profile access must be validated through the related
// Application. Status belongs to the Application, not the Candidate.
//
// Never return another company's Application history, notes,
// interview feedback, messages or submitted resume.
//
// Endpoint boundary (when confirmed): GET /api/v1/recruiter/candidates/

export function getRecruiterCandidatesData() {
  return {
    candidates: [],
    filters: {
      jobs: [],
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
      ]
    },
    pagination: {
      current_page: 1,
      total_pages: 1,
      total_items: 0,
      page_size: 12
    }
  };
}

export async function getCandidateDetailsData(candidateId, applicationId) {
  // Future Django integration: GET /api/v1/candidates/:candidateId/applications/:applicationId/
  console.log("Future Candidate Details Fetch:", { candidateId, applicationId });
  return null;
}
