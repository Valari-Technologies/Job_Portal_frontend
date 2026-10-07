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

import { authenticatedFetch } from '../auth/adminAuthService';

const API_BASE_URL = 'http://127.0.0.1:8000';

function formatAppTime(dateStr) {
  if (!dateStr) return 'Recently';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Recently';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return 'Recently';
  }
}

export function getRecruiterApplicationsData() {
  let rawApps = [];
  try {
    const stored = localStorage.getItem('tnjobz_candidate_applications');
    rawApps = stored ? JSON.parse(stored) : [];
  } catch {
    rawApps = [];
  }

  // Fallback sample app if none exists yet
  if (rawApps.length === 0) {
    rawApps = [
      {
        id: 'app_sample_1',
        job_id: 'job_rec_01',
        job_title: 'Senior Full-Stack Developer',
        company_name: 'MSD Tech',
        status: 'APPLIED',
        applied_at: new Date().toISOString(),
        candidate_note: 'I have 4+ years of React and Python experience.',
        resume_filename: 'Candidate_Resume.pdf',
        resume_url: null,
        candidate: {
          full_name: 'Kumar V',
          email: 'kumar@tnjobz.com',
          phone: '+91 98765 43210',
          location: 'Chennai, Tamil Nadu',
          profile_photo: null,
          profile_completion: 90,
          initials: 'K'
        }
      }
    ];
  }

  const applications = rawApps.map(app => {
    const cand = app.candidate || {};
    const fullName = cand.full_name || app.candidate_name || 'Candidate User';
    return {
      id: String(app.id),
      job_id: String(app.job_id || ''),
      status: app.status || 'APPLIED',
      applied_at: app.applied_at || new Date().toISOString(),
      applied_time: formatAppTime(app.applied_at),
      candidate_note: app.candidate_note || '',
      resume_id: app.resume_id || null,
      resume_filename: app.resume_filename || 'Candidate_Resume.pdf',
      resume_url: app.resume_url || null,
      job: {
        id: String(app.job_id || ''),
        title: app.job_title || 'Position',
        company_name: app.company_name || 'TN Jobz Employer'
      },
      candidate: {
        id: cand.id || 'cand_1',
        full_name: fullName,
        email: cand.email || 'candidate@tnjobz.com',
        phone: cand.phone || '',
        location: cand.location || 'Chennai, Tamil Nadu',
        profile_photo: cand.profile_photo || null,
        profile_completion: cand.profile_completion || 85,
        initials: fullName.charAt(0).toUpperCase()
      }
    };
  });

  // Unique list of jobs for filter
  const jobMap = new Map();
  applications.forEach(a => {
    if (a.job?.id && a.job?.title) {
      jobMap.set(a.job.id, a.job.title);
    }
  });

  const jobFilters = [
    { value: 'ALL', label: 'All Posted Jobs' },
    ...Array.from(jobMap.entries()).map(([id, title]) => ({ value: id, label: title }))
  ];

  const activeCount = applications.filter(a => a.status !== 'REJECTED' && a.status !== 'WITHDRAWN').length;

  return {
    metrics: {
      total_active: activeCount,
      conversion_rate: applications.length > 0 ? Math.round((activeCount / applications.length) * 100) : 0,
      average_time_to_hire_days: 5
    },
    filters: {
      statuses: [
        { value: 'ALL', label: 'All Statuses' },
        { value: 'APPLIED', label: 'Applied' },
        { value: 'VIEWED', label: 'Under Review' },
        { value: 'SHORTLISTED', label: 'Shortlisted' },
        { value: 'INTERVIEW', label: 'Interview' },
        { value: 'SELECTED', label: 'Selected' },
        { value: 'REJECTED', label: 'Rejected' },
        { value: 'WITHDRAWN', label: 'Withdrawn' }
      ],
      jobs: jobFilters
    },
    applications,
    pagination: {
      current_page: 1,
      total_pages: 1,
      total_items: applications.length,
      page_size: 12
    }
  };
}

export async function updateApplicationStatusService(applicationId, newStatus, note = '') {
  // Update in localStorage
  try {
    const stored = localStorage.getItem('tnjobz_candidate_applications');
    if (stored) {
      const apps = JSON.parse(stored);
      const appIdx = apps.findIndex(a => String(a.id) === String(applicationId));
      if (appIdx !== -1) {
        apps[appIdx].status = newStatus;
        if (note) {
          apps[appIdx].recruiter_notes = apps[appIdx].recruiter_notes || [];
          apps[appIdx].recruiter_notes.push({ text: note, date: new Date().toISOString() });
        }
        localStorage.setItem('tnjobz_candidate_applications', JSON.stringify(apps));
      }
    }
  } catch (err) {
    console.warn("Local application status update error:", err);
  }

  // Also notify backend if application is numeric
  if (!isNaN(Number(applicationId))) {
    try {
      const url = `${API_BASE_URL}/accounts/candidate/applications/${applicationId}/`;
      await authenticatedFetch(url, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
    } catch (backendErr) {
      console.warn("Backend status update notice:", backendErr);
    }
  }

  return { success: true, status: newStatus };
}

