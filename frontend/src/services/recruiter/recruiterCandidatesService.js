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
    const candidateId = String(cand.id || app.id || '1');

    if (!candidateMap.has(candidateId)) {
      const topSkills = cand.skills || cand.top_skills || [];
      const candidateObj = {
        id: candidateId,
        full_name: cand.full_name || 'Candidate',
        email: cand.email || '',
        phone: cand.phone || '',
        location: cand.location || '',
        profile_photo: cand.profile_photo || null,
        initials: cand.initials || (cand.full_name ? cand.full_name.charAt(0).toUpperCase() : 'C'),
        current_title: cand.headline || cand.current_title || '',
        top_skills: topSkills,
        total_experience_years: (cand.experiences && cand.experiences.length > 0) ? cand.experiences.length : 0,
        willing_to_relocate: false,
        experiences: cand.experiences || [],
        education: cand.education || cand.educations || [],
        links: cand.links || {}
      };

      const jobObj = {
        id: String(app.job?.id || ''),
        title: app.job?.title || 'Job Position',
        company_name: app.job?.company_name || 'Company'
      };

      candidateMap.set(candidateId, {
        // Nested properties expected by RecruiterCandidateCard.jsx
        candidate: candidateObj,
        job: jobObj,
        application_id: app.id,
        application_status: app.status || 'APPLIED',

        // Flat properties for backward compatibility
        id: candidateId,
        full_name: candidateObj.full_name,
        email: candidateObj.email,
        phone: candidateObj.phone,
        location: candidateObj.location,
        profile_photo: candidateObj.profile_photo,
        initials: candidateObj.initials,
        headline: candidateObj.current_title,
        applied_job_title: jobObj.title,
        applied_job_id: jobObj.id,
        company_name: jobObj.company_name,
        status: app.status || 'APPLIED',
        applied_at: app.applied_at || new Date().toISOString(),
        applied_time: app.applied_time || 'Recently',
        candidate_note: app.candidate_note,
        resume_filename: app.resume_filename || '',
        resume_url: app.resume_url || '',
        experience: candidateObj.total_experience_years > 0 ? `${candidateObj.total_experience_years} Years` : 'Fresher',
        skills: topSkills,
        experiences: candidateObj.experiences,
        education: candidateObj.education,
        links: candidateObj.links
      });
    }
  });

  const candidates = Array.from(candidateMap.values());

  return {
    candidates,
    filters: {
      jobs: appsData.filters?.jobs || [],
      statuses: appsData.filters?.statuses || ['APPLIED', 'VIEWED', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED']
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
  const item = candidates.find(c => 
    String(c.application_id) === String(applicationId) ||
    String(c.candidate?.id) === String(candidateId) || 
    String(c.id) === String(candidateId)
  ) || candidates[0];

  if (item) {
    const cand = item.candidate || item;
    const candLinks = cand.links || item.links || {};
    return {
      candidate: {
        id: cand.id,
        full_name: cand.full_name || 'Candidate',
        current_title: cand.current_title || cand.headline || '',
        location: cand.location || '',
        willing_to_relocate: false,
        email: cand.email || '',
        phone: cand.phone || '',
        profile_photo: cand.profile_photo || null,
        initials: cand.initials || (cand.full_name ? cand.full_name.charAt(0).toUpperCase() : 'C'),
        linkedin_url: candLinks.linkedin || cand.linkedin_url || '',
        github_url: candLinks.github || cand.github_url || ''
      },
      application_status: item.application_status || item.status || 'APPLIED',
      resume_url: item.resume_url || '',
      resume_filename: item.resume_filename || '',
      skills: cand.skills || cand.top_skills || [],
      experiences: (cand.experiences && cand.experiences.length > 0) ? cand.experiences.map(e => ({
        title: e.roleTitle || e.title || e.designation || '',
        company: e.companyName || e.company || '',
        dates: e.period || e.dates || '',
        description: e.description || ''
      })) : [],
      educations: (cand.education || cand.educations || []).map(e => ({
        degree: e.degree || '',
        institution: e.institution || e.school || e.college || '',
        dates: e.period || e.year || e.dates || ''
      })),
      history: [
        {
          title: 'Application Submitted',
          date: item.applied_time || 'Recently',
          description: `Applied for ${item.job?.title || item.applied_job_title || 'Position'}`
        }
      ],
      feedback: []
    };
  }

  return null;
}

