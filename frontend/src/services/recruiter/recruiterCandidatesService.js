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

import { getRecruiterApplicationsData } from './recruiterApplicationsService';

export function getRecruiterCandidatesData() {
  const appsData = getRecruiterApplicationsData();
  const applications = appsData.applications || [];

  const candidateMap = new Map();

  applications.forEach(app => {
    const cand = app.candidate || {};
    const candidateId = String(cand.id || app.id);

    if (!candidateMap.has(candidateId)) {
      candidateMap.set(candidateId, {
        id: candidateId,
        application_id: app.id,
        full_name: cand.full_name || 'Candidate User',
        email: cand.email || 'candidate@tnjobz.com',
        phone: cand.phone || '',
        location: cand.location || 'Chennai, Tamil Nadu',
        profile_photo: cand.profile_photo || null,
        initials: cand.initials || 'C',
        headline: cand.headline || 'Software Engineer',
        applied_job_title: app.job?.title || 'Software Developer',
        applied_job_id: app.job?.id || '',
        company_name: app.job?.company_name || 'MSD Tech',
        status: app.status || 'APPLIED',
        applied_at: app.applied_at,
        applied_time: app.applied_time,
        candidate_note: app.candidate_note,
        resume_filename: app.resume_filename,
        resume_url: app.resume_url,
        experience: '4+ Years',
        skills: ['React', 'JavaScript', 'Node.js', 'Python', 'Tailwind CSS']
      });
    }
  });

  const candidates = Array.from(candidateMap.values());

  return {
    candidates,
    filters: {
      jobs: appsData.filters?.jobs || [],
      statuses: appsData.filters?.statuses || []
    },
    pagination: {
      current_page: 1,
      total_pages: 1,
      total_items: candidates.length,
      page_size: 12
    }
  };
}

export async function getCandidateDetailsData(candidateId, applicationId) {
  const { candidates } = getRecruiterCandidatesData();
  const candidate = candidates.find(c => String(c.id) === String(candidateId) || String(c.application_id) === String(applicationId));

  if (candidate) {
    return {
      ...candidate,
      about: candidate.candidate_note || 'Enthusiastic developer looking for opportunities on TN Jobz.',
      timeline: [
        { title: 'Application Submitted', date: candidate.applied_time, status: 'APPLIED' }
      ]
    };
  }

  return null;
}

