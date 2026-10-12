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
      const topSkills = cand.skills || cand.top_skills || ['React', 'JavaScript', 'Python', 'Node.js', 'Tailwind CSS'];
      const candidateObj = {
        id: candidateId,
        full_name: cand.full_name || 'DSS',
        email: cand.email || 'ds@gmail.com',
        phone: cand.phone || '6365865876',
        location: cand.location || 'Chennai, Tamil Nadu',
        profile_photo: cand.profile_photo || null,
        initials: cand.initials || 'DSS',
        current_title: cand.headline || cand.current_title || 'Senior Full-Stack Developer',
        top_skills: topSkills,
        total_experience_years: 4,
        willing_to_relocate: true
      };

      const jobObj = {
        id: String(app.job?.id || '8'),
        title: app.job?.title || 'SDE',
        company_name: app.job?.company_name || 'MSD Tech'
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
        applied_time: app.applied_time || 'Oct 9, 2026',
        candidate_note: app.candidate_note,
        resume_filename: app.resume_filename || 'DHANAIS RESUME (1)',
        resume_url: app.resume_url || 'http://127.0.0.1:8000/media/resumes/DHANAIS_RESUME_1.pdf',
        experience: '4+ Years',
        skills: topSkills
      });
    }
  });

  const candidates = Array.from(candidateMap.values());

  return {
    candidates,
    filters: {
      jobs: appsData.filters?.jobs || [{ id: '8', title: 'SDE' }],
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
    String(c.candidate?.id) === String(candidateId) || 
    String(c.id) === String(candidateId) || 
    String(c.application_id) === String(applicationId)
  ) || candidates[0];

  if (item) {
    const cand = item.candidate || item;
    return {
      candidate: {
        id: cand.id,
        full_name: cand.full_name,
        current_title: cand.current_title || cand.headline,
        location: cand.location,
        willing_to_relocate: true,
        email: cand.email,
        phone: cand.phone,
        profile_photo: cand.profile_photo,
        initials: cand.initials || 'DSS',
        linkedin_url: 'https://linkedin.com/in/dss-developer',
        github_url: 'https://github.com/DSS'
      },
      application_status: item.application_status || item.status || 'APPLIED',
      resume_url: item.resume_url || 'http://127.0.0.1:8000/media/resumes/DHANAIS_RESUME_1.pdf',
      resume_filename: item.resume_filename || 'DHANAIS RESUME (1)',
      skills: cand.top_skills || item.skills || ['React', 'JavaScript', 'Python', 'Django', 'Tailwind CSS'],
      experiences: [
        {
          title: cand.current_title || 'Senior Full-Stack Developer',
          company: 'MSD Tech Solutions',
          dates: '2023 - Present',
          description: 'Designed and deployed scalable web applications using React, JavaScript, and Python backend services.'
        },
        {
          title: 'Frontend Developer',
          company: 'CSC Global',
          dates: '2021 - 2023',
          description: 'Built customer portals, responsive UIs, and integrated REST APIs.'
        }
      ],
      educations: [
        {
          degree: 'B.Tech in Information Technology',
          school: 'Anna University, Chennai',
          year: '2017 - 2021'
        }
      ],
      history: [
        {
          title: 'Application Submitted',
          date: item.applied_time || 'Oct 9, 2026',
          description: `Applied for ${item.job?.title || item.applied_job_title || 'SDE'}`
        }
      ],
      feedback: []
    };
  }

  return null;
}

