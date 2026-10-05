/**
 * Candidate Jobs Service
 * 
 * Manages job discovery, search, filtering, mobile tabs (For You, Nearby, Recent, Saved),
 * job details retrieval, bookmarking/saving jobs, and application submission logic.
 * 
 * Django API Boundaries:
 * - GET /accounts/candidate/jobs/ -> List published jobs
 * - GET /accounts/candidate/jobs/{id}/ -> Fetch job detail
 * - POST /accounts/candidate/jobs/{id}/save/ -> Toggle save job
 * - GET /accounts/candidate/saved-jobs/ -> List saved jobs
 */

import { authenticatedFetch } from '../auth/adminAuthService';

const API_BASE_URL = 'http://127.0.0.1:8000';

export function normalizeJobRecord(raw) {
  if (!raw || typeof raw !== 'object') return null;

  const id = String(raw.id || raw.pk || '');
  const title = raw.title || 'Position';
  const companyName = raw.company_name || 'Employer';
  const companyLogo = raw.company_logo || null;
  const companyInitials = companyName ? companyName.charAt(0).toUpperCase() : 'E';

  const locationName = raw.location_name || (raw.locations && raw.locations.length > 0 ? raw.locations[0].full_path : 'Location Not Specified');
  const workMode = raw.work_mode_name || 'On-site';
  const applicationType = raw.application_type || 'PROFILE_RESUME';

  const salaryMin = raw.salary_min ? Number(raw.salary_min) : null;
  const salaryMax = raw.salary_max ? Number(raw.salary_max) : null;
  let salaryDisplay = 'Salary not disclosed';
  if (salaryMin && salaryMax) {
    salaryDisplay = `₹${salaryMin.toLocaleString('en-IN')} - ₹${salaryMax.toLocaleString('en-IN')}`;
  } else if (salaryMin) {
    salaryDisplay = `₹${salaryMin.toLocaleString('en-IN')}`;
  }
  if (raw.salary_period) {
    salaryDisplay += `/${raw.salary_period}`;
  }

  const skillsList = Array.isArray(raw.skills) ? raw.skills.map(s => typeof s === 'string' ? s : s.name) : [];

  return {
    id,
    title,
    company: companyName,
    companyName,
    companyLogo,
    companyInitials,
    location: locationName,
    locationName,
    locations: raw.locations || [],
    workMode,
    applicationType,
    salary: salaryDisplay,
    salaryMin,
    salaryMax,
    salaryPeriod: raw.salary_period || '',
    experienceMin: raw.experience_min || 0,
    experienceMax: raw.experience_max || 0,
    educationRequirement: raw.education_requirement || '',
    skills: skillsList,
    description: raw.description || '',
    responsibilities: raw.responsibilities || '',
    isSaved: Boolean(raw.is_saved),
    hasApplied: Boolean(raw.is_applied),
    publishedAt: raw.published_at || raw.created_at || new Date().toISOString()
  };
}

/**
 * Fetch candidate jobs with search, filtering, and tab controls from Django API
 */
export async function getCandidateJobs(params = {}) {
  const {
    search = '',
    tab = 'for-you',
    category = '',
    location = '',
    experience = '',
    jobType = '',
    workMode = ''
  } = params;

  if (tab === 'saved') {
    return getCandidateSavedJobs();
  }

  const query = new URLSearchParams();
  if (search) query.append('search', search);
  if (category) query.append('category', category);
  if (location) query.append('location', location);
  if (workMode) query.append('work_mode', workMode);

  const url = `${API_BASE_URL}/accounts/candidate/jobs/?${query.toString()}`;
  const response = await authenticatedFetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch jobs.');
  }

  const data = await response.json();
  const rawList = Array.isArray(data) ? data : (data.results || []);
  let jobs = rawList.map(normalizeJobRecord).filter(Boolean);

  // Client side extra filter refinements if provided
  if (jobType) {
    jobs = jobs.filter(j => (j.applicationType || '').toLowerCase().includes(jobType.toLowerCase()));
  }
  if (experience === 'entry') {
    jobs = jobs.filter(j => j.experienceMin <= 2);
  } else if (experience === 'mid') {
    jobs = jobs.filter(j => j.experienceMin >= 3 && j.experienceMin <= 5);
  } else if (experience === 'senior') {
    jobs = jobs.filter(j => j.experienceMin >= 6);
  }

  return {
    jobs,
    totalCount: data.count || jobs.length,
    hasRecommendations: Boolean(data.has_recommendations)
  };
}

/**
 * Fetch Saved Jobs for authenticated candidate
 */
export async function getCandidateSavedJobs() {
  const url = `${API_BASE_URL}/accounts/candidate/saved-jobs/`;
  const response = await authenticatedFetch(url);

  if (!response.ok) {
    return { jobs: [], totalCount: 0 };
  }

  const data = await response.json();
  const rawList = Array.isArray(data) ? data : (data.results || []);
  const jobs = rawList.map(sj => normalizeJobRecord(sj.job)).filter(Boolean).map(j => ({ ...j, isSaved: true }));

  return {
    jobs,
    totalCount: jobs.length
  };
}

/**
 * Fetch Filter Options taxonomy
 */
export async function getJobFilterOptions() {
  try {
    const [catRes, locRes] = await Promise.all([
      fetch(`${API_BASE_URL}/accounts/job-categories/`),
      fetch(`${API_BASE_URL}/accounts/locations/`)
    ]);

    const categories = catRes.ok ? await catRes.json() : [];
    const locations = locRes.ok ? await locRes.json() : [];

    return {
      categories: Array.isArray(categories) ? categories : (categories.results || []),
      locations: Array.isArray(locations) ? locations : (locations.results || []),
      experienceRanges: [
        { id: 'entry', label: '0–2 Years' },
        { id: 'mid', label: '3–5 Years' },
        { id: 'senior', label: '6+ Years' }
      ],
      jobTypes: [
        { id: 'PROFILE_RESUME', label: 'Professional (Resume Required)' },
        { id: 'SIMPLE_LOCAL', label: 'Simple Local (No Resume)' }
      ],
      workModes: [
        { id: 'Remote', label: 'Remote' },
        { id: 'Hybrid', label: 'Hybrid' },
        { id: 'On-site', label: 'On-site' }
      ]
    };
  } catch {
    return {
      categories: [],
      locations: [],
      experienceRanges: [],
      jobTypes: [],
      workModes: []
    };
  }
}

/**
 * Fetch Job Details by ID
 */
export async function getCandidateJobDetails(jobId) {
  const url = `${API_BASE_URL}/accounts/candidate/jobs/${jobId}/`;
  const response = await authenticatedFetch(url);

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return normalizeJobRecord(data);
}

/**
 * Toggle Save/Bookmark state for job in Django API
 */
export async function toggleSavedCandidateJob(jobId) {
  const url = `${API_BASE_URL}/accounts/candidate/jobs/${jobId}/save/`;
  const response = await authenticatedFetch(url, {
    method: 'POST'
  });

  if (!response.ok) {
    const resData = await response.json().catch(() => ({}));
    throw new Error(resData.detail || 'Failed to toggle saved job.');
  }

  const data = await response.json();
  return {
    isSaved: data.isSaved,
    savedJobIds: data.savedJobIds || []
  };
}

export async function applyCandidateJob(jobId, payload = {}) {
  const { submitCandidateApplication } = await import('./candidateApplicationsService');
  return submitCandidateApplication({ jobId, ...payload });
}

export async function quickApplyJob(jobId, jobData = {}) {
  const { submitCandidateApplication } = await import('./candidateApplicationsService');
  return submitCandidateApplication({ jobId, ...jobData });
}

export async function getDepartmentsForIndustry(industryId) {
  return [];
}
