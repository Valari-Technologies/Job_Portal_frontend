/**
 * Candidate Jobs Service
 * 
 * Manages job discovery, search, filtering, mobile tabs (For You, Nearby, Recent, Saved),
 * job details retrieval, bookmarking/saving jobs, and quick application logic.
 */

import { getActiveIndustries, getSpecializationsByIndustry } from './candidateOnboardingService';

const STORAGE_JOBS_KEY = 'statejobz_candidate_published_jobs';
const STORAGE_SAVED_JOBS_KEY = 'statejobz_candidate_saved_jobs';
const STORAGE_APPLICATIONS_KEY = 'statejobz_candidate_applications';

function getStoredJobs() {
  try {
    const raw = localStorage.getItem(STORAGE_JOBS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Error reading Candidate jobs storage:', err);
    return [];
  }
}

function getStoredSavedJobIds() {
  try {
    const raw = localStorage.getItem(STORAGE_SAVED_JOBS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredSavedJobIds(ids) {
  try {
    localStorage.setItem(STORAGE_SAVED_JOBS_KEY, JSON.stringify(ids));
  } catch (err) {
    console.error('Error saving stored saved job IDs:', err);
  }
}

function getStoredApplications() {
  try {
    const raw = localStorage.getItem(STORAGE_APPLICATIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredApplications(apps) {
  try {
    localStorage.setItem(STORAGE_APPLICATIONS_KEY, JSON.stringify(apps));
  } catch (err) {
    console.error('Error saving stored applications:', err);
  }
}

/**
 * Fetch candidate jobs with search, filtering, and tab controls
 */
export async function getCandidateJobs(params = {}) {
  await new Promise(resolve => setTimeout(resolve, 120));

  const {
    search = '',
    tab = 'for-you',
    industryId = '',
    departmentId = '',
    location = '',
    experience = '',
    jobType = '',
    workMode = ''
  } = params;

  const catalog = getStoredJobs();
  const savedJobIds = getStoredSavedJobIds();
  const applications = getStoredApplications();

  let jobs = catalog.map(job => {
    const app = applications.find(a => a.jobId === job.id);
    return {
      ...job,
      isSaved: savedJobIds.includes(job.id),
      hasApplied: Boolean(app),
      applicationId: app ? app.id : null
    };
  });

  // Tab Filtering
  if (tab === 'saved') {
    jobs = jobs.filter(j => j.isSaved);
  } else if (tab === 'nearby') {
    jobs = jobs.filter(j => (j.location || '').toLowerCase().includes('bengaluru') || (j.location || '').toLowerCase().includes('hyderabad') || (j.location || '').toLowerCase().includes('san francisco'));
  } else if (tab === 'recent') {
    jobs = [...jobs].sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
  } else if (tab === 'for-you') {
    jobs = [...jobs].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }

  // Search Filter
  if (search.trim()) {
    const term = search.trim().toLowerCase();
    jobs = jobs.filter(j => 
      (j.title || '').toLowerCase().includes(term) ||
      (j.company || '').toLowerCase().includes(term) ||
      (j.location || '').toLowerCase().includes(term) ||
      (j.skills || []).some(s => s.toLowerCase().includes(term))
    );
  }

  // Industry Filter
  if (industryId) {
    jobs = jobs.filter(j => j.industryId === industryId);
  }

  // Department Filter
  if (departmentId) {
    jobs = jobs.filter(j => j.departmentId === departmentId);
  }

  // Location Filter
  if (location) {
    const locTerm = location.toLowerCase();
    jobs = jobs.filter(j => (j.location || '').toLowerCase().includes(locTerm));
  }

  // Work Mode Filter
  if (workMode) {
    jobs = jobs.filter(j => (j.workMode || '').toLowerCase() === workMode.toLowerCase());
  }

  // Job Type / Employment Type Filter
  if (jobType) {
    jobs = jobs.filter(j => (j.employmentType || '').toLowerCase().includes(jobType.toLowerCase()));
  }

  // Experience Filter
  if (experience) {
    if (experience === 'entry') jobs = jobs.filter(j => j.experienceMin <= 2);
    else if (experience === 'mid') jobs = jobs.filter(j => j.experienceMin >= 3 && j.experienceMin <= 5);
    else if (experience === 'senior') jobs = jobs.filter(j => j.experienceMin >= 6);
  }

  return {
    jobs,
    totalCount: jobs.length
  };
}

/**
 * Fetch Filter Options taxonomy for Industry, Department, Locations, etc.
 */
export async function getJobFilterOptions() {
  const industries = await getActiveIndustries();
  return {
    industries,
    locations: [
      { id: 'loc_sf', name: 'San Francisco, CA' },
      { id: 'loc_ny', name: 'New York, NY' },
      { id: 'loc_blr', name: 'Bengaluru, India' },
      { id: 'loc_hyd', name: 'Hyderabad, India' },
      { id: 'loc_pune', name: 'Pune, India' },
      { id: 'loc_sea', name: 'Seattle, WA' }
    ],
    experienceRanges: [
      { id: 'entry', label: '0–2 Years' },
      { id: 'mid', label: '3–5 Years' },
      { id: 'senior', label: '6+ Years' }
    ],
    jobTypes: [
      { id: 'Full-Time', label: 'Full-Time' },
      { id: 'Part-Time', label: 'Part-Time' },
      { id: 'Contract', label: 'Contract' },
      { id: 'Internship', label: 'Internship' }
    ],
    workModes: [
      { id: 'Remote', label: 'Remote' },
      { id: 'Hybrid', label: 'Hybrid' },
      { id: 'On-site', label: 'On-site' }
    ]
  };
}

/**
 * Fetch departments/specializations for a given industry ID
 */
export async function getDepartmentsForIndustry(industryId) {
  if (!industryId) return [];
  return getSpecializationsByIndustry(industryId);
}

/**
 * Fetch Job Details by ID
 */
export async function getCandidateJobDetails(jobId) {
  await new Promise(resolve => setTimeout(resolve, 100));
  const catalog = getStoredJobs();
  const job = catalog.find(j => j.id === jobId);
  if (!job) return null;

  const savedIds = getStoredSavedJobIds();
  const applications = getStoredApplications();
  const app = applications.find(a => a.jobId === job.id);

  return {
    ...job,
    isSaved: savedIds.includes(job.id),
    hasApplied: Boolean(app),
    applicationId: app ? app.id : null
  };
}

/**
 * Toggle Save/Bookmark state for job
 */
export async function toggleSavedCandidateJob(jobId) {
  await new Promise(resolve => setTimeout(resolve, 100));
  const current = getStoredSavedJobIds();
  let updated;
  if (current.includes(jobId)) {
    updated = current.filter(id => id !== jobId);
  } else {
    updated = [...current, jobId];
  }
  saveStoredSavedJobIds(updated);
  return { isSaved: updated.includes(jobId), savedJobIds: updated };
}

/**
 * Apply to candidate job
 */
export async function applyCandidateJob(jobId, payload = {}) {
  await new Promise(resolve => setTimeout(resolve, 200));
  const catalog = getStoredJobs();
  const job = catalog.find(j => j.id === jobId);
  const apps = getStoredApplications();

  const existing = apps.find(a => a.jobId === jobId);
  if (existing) {
    return { success: false, message: 'You have already applied for this position.' };
  }

  const newApp = {
    id: `app_${Date.now()}`,
    jobId: jobId,
    jobTitle: job ? job.title : (payload.title || 'Job Application'),
    company: job ? job.company : (payload.company || 'Employer'),
    companyInitials: (job ? job.company : (payload.company || 'E')).charAt(0),
    status: 'APPLIED',
    appliedAt: new Date().toISOString().split('T')[0]
  };

  const updated = [newApp, ...apps];
  saveStoredApplications(updated);
  return { success: true, application: newApp };
}
