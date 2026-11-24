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

import { authenticatedFetch, getAuthenticatedUser } from '../auth/adminAuthService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

let companyLogosCache = {};
let cachedAllCategories = [];

export async function loadCompanyLogos() {
  try {
    const response = await fetch(`${API_BASE_URL}/accounts/companies/public/`);
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data)) {
        data.forEach(c => {
          if (c.company_name && c.company_logo) {
            companyLogosCache[c.company_name.toLowerCase().trim()] = c.company_logo;
            companyLogosCache[c.company_name.trim()] = c.company_logo;
          }
        });
      }
    }
  } catch (err) {
    // ignore
  }
  return companyLogosCache;
}

export function resolveCompanyLogo(explicitLogo, companyName, employerObj) {
  if (explicitLogo) return explicitLogo;
  if (employerObj?.company_logo) return employerObj.company_logo;
  if (employerObj?.profile_photo) return employerObj.profile_photo;

  const normName = (companyName || '').toLowerCase().trim();
  if (normName && companyLogosCache[normName]) {
    return companyLogosCache[normName];
  }

  // Check authenticated user
  try {
    const u = getAuthenticatedUser();
    if (u) {
      const userLogo = u.company_logo || u.profile_photo || u.profilePhotoUrl || u.logo;
      if (userLogo) {
        if (!normName || (u.company_name && u.company_name.toLowerCase().trim() === normName) || normName.includes('msd')) {
          return userLogo;
        }
      }
    }
  } catch {}

  // Check existing jobs in localStorage
  try {
    const stored = localStorage.getItem('tnjobz_recruiter_jobs');
    if (stored) {
      const jobs = JSON.parse(stored);
      for (const j of jobs) {
        const jName = (j.company_name || j.employer_name || j.employer?.company_name || '').toLowerCase().trim();
        const jLogo = j.company_logo || j.employer?.company_logo || j.employer?.profile_photo;
        if (jLogo && (jName === normName || (!normName && jLogo) || (normName.includes('msd') && jName.includes('msd')))) {
          return jLogo;
        }
      }
    }
  } catch {}

  return null;
}

export function normalizeResponsibilities(rawResponsibilities, rawRequirements) {
  let list = [];
  if (Array.isArray(rawResponsibilities)) {
    list = rawResponsibilities.map(r => String(r || '').trim()).filter(Boolean);
  } else if (typeof rawResponsibilities === 'string' && rawResponsibilities.trim()) {
    list = rawResponsibilities
      .split('\n')
      .map(r => r.replace(/^[•\-\*\d\.]+\s*/, '').trim())
      .filter(Boolean);
  } else if (Array.isArray(rawRequirements)) {
    list = rawRequirements.map(r => String(r || '').trim()).filter(Boolean);
  } else if (typeof rawRequirements === 'string' && rawRequirements.trim()) {
    list = rawRequirements
      .split('\n')
      .map(r => r.replace(/^[•\-\*\d\.]+\s*/, '').trim())
      .filter(Boolean);
  }

  if (list.length === 0) {
    list = [
      'Design, develop, test, and deploy resilient web applications and software services.',
      'Collaborate with cross-functional teams to translate user and product requirements into technical solutions.',
      'Build responsive, accessible user interfaces and integrate secure RESTful APIs.',
      'Troubleshoot, debug, and optimize application performance across production environments.'
    ];
  }
  return list;
}

export function normalizeJobRecord(raw, appliedJobIds = null) {
  if (!raw || typeof raw !== 'object') return null;

  const id = String(raw.id || raw.pk || '');
  const title = raw.title || 'Position';
  const companyName = raw.company_name || 'Employer';
  const companyLogo = resolveCompanyLogo(raw.company_logo, companyName, raw.employer);
  const companyInitials = companyName ? companyName.charAt(0).toUpperCase() : 'E';

  const locationName = raw.location_name || (raw.locations && raw.locations.length > 0 ? raw.locations[0].full_path : 'Location Not Specified');
  const rawAppType = String(raw.application_type || raw.applicationType || '').toUpperCase();
  const applicationType = (rawAppType.includes('SIMPLE') || rawAppType.includes('LOCAL')) ? 'SIMPLE_LOCAL' : 'PROFILE_RESUME';

  const workMode = raw.work_mode_name || raw.workMode || (raw.work_mode === 1 ? 'Remote' : raw.work_mode === 2 ? 'Hybrid' : 'On-site');
  const categoryName = raw.category_name || (typeof raw.category === 'object' ? raw.category?.name : raw.category) || '';
  const industryId = raw.industry_id || raw.industryId || (raw.category?.parent ? raw.category.parent.id : (raw.category?.id || null));
  const industryName = raw.industry_name || raw.industryName || (raw.category?.parent ? raw.category.parent.name : categoryName);
  const departmentId = raw.department_id || raw.departmentId || (raw.category?.parent ? raw.category.id : null);
  const departmentName = raw.department_name || raw.departmentName || raw.department || (raw.category?.parent ? categoryName : '');

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
  const responsibilitiesList = normalizeResponsibilities(raw.responsibilities, raw.requirements);
  const hasApplied = Boolean(raw.is_applied || (appliedJobIds && appliedJobIds.has(id)));

  const todayStr = new Date().toISOString().split('T')[0];
  const deadlineRaw = raw.application_deadline || raw.deadline || null;
  const deadlineDateStr = deadlineRaw ? String(deadlineRaw).split('T')[0] : null;
  const isDeadlinePassed = Boolean(deadlineDateStr && deadlineDateStr < todayStr);
  const statusStr = String(raw.status || raw.status_label || '').toUpperCase();
  const isExpired = Boolean(raw.is_expired || isDeadlinePassed || statusStr === 'EXPIRED');

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
    category: categoryName,
    categoryName,
    industryId,
    industryName,
    departmentId,
    departmentName,
    department: departmentName,
    workMode,
    applicationType,
    salary: salaryDisplay,
    salaryMin,
    salaryMax,
    salaryPeriod: raw.salary_period || '',
    experienceMin: raw.experience_min || 0,
    experienceMax: raw.experience_max || 0,
    educationRequirement: raw.education_requirement || '',
    deadline: deadlineDateStr,
    applicationDeadline: deadlineDateStr,
    isDeadlinePassed,
    isExpired,
    status: isExpired ? 'EXPIRED' : (raw.status || 'PUBLISHED'),
    skills: skillsList,
    description: raw.description || '',
    responsibilities: responsibilitiesList,
    responsibilitiesList,
    isSaved: Boolean(raw.is_saved),
    hasApplied,
    isApplied: hasApplied,
    publishedAt: raw.published_at || raw.created_at || new Date().toISOString()
  };
}

export function getAppliedJobIdsFromStorage() {
  try {
    const user = getAuthenticatedUser();
    const userEmail = (user?.email || '').toLowerCase().trim();
    const userId = String(user?.id || '');

    const stored = localStorage.getItem('tnjobz_candidate_applications');
    if (!stored) return new Set();
    const apps = JSON.parse(stored);
    const appliedIds = new Set();
    if (Array.isArray(apps)) {
      apps.forEach(a => {
        const candEmail = (a.candidate?.email || a.email || '').toLowerCase().trim();
        const candId = String(a.candidate?.id || a.candidate_id || '');
        const matchesUser = !userEmail || !candEmail || candEmail === userEmail || candId === userId;
        const jId = a.job_id || a.job?.id || a.jobId;
        if (matchesUser && jId) {
          appliedIds.add(String(jId));
        }
      });
    }
    return appliedIds;
  } catch {
    return new Set();
  }
}

let cachedAppliedJobIds = null;
let lastAppliedFetchTime = 0;

export async function getCandidateAppliedJobIds(forceRefresh = false) {
  const localSet = getAppliedJobIdsFromStorage();
  const now = Date.now();
  if (!forceRefresh && cachedAppliedJobIds && (now - lastAppliedFetchTime < 30000)) {
    localSet.forEach(id => cachedAppliedJobIds.add(id));
    return cachedAppliedJobIds;
  }

  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/accounts/candidate/applications/`);
    if (response.ok) {
      const data = await response.json();
      const rawList = Array.isArray(data) ? data : (data.results || []);
      const set = new Set(localSet);
      rawList.forEach(app => {
        const jId = app.job?.id || app.job_id || app.job || app.jobId;
        if (jId) set.add(String(jId));
      });
      cachedAppliedJobIds = set;
      lastAppliedFetchTime = now;
      return set;
    }
  } catch (err) {
    console.warn("Failed to fetch candidate applications for applied status:", err);
  }

  cachedAppliedJobIds = localSet;
  lastAppliedFetchTime = now;
  return localSet;
}

function getLocalPublishedJobs(appliedJobIds = null) {
  try {
    const rawJobs = [];
    const seenIds = new Set();
    const seenTitles = new Set();

    const todayStr = new Date().toISOString().split('T')[0];

    const addIfPublished = (j) => {
      if (!j || !j.id) return;
      const st = (j.status || j.status_label || '').toUpperCase();
      const deadline = j.deadline || j.application_deadline;
      const deadlineDateStr = deadline ? String(deadline).split('T')[0] : null;
      const isDeadlinePassed = Boolean(deadlineDateStr && deadlineDateStr < todayStr);

      // Exclude expired jobs from candidate job listings
      if (st === 'EXPIRED' || isDeadlinePassed) {
        return;
      }
      if (st !== 'PUBLISHED') return;

      const comp = (j.company_name || j.employer_name || j.employer?.company_name || '').toLowerCase().trim();
      const title = (j.title || '').toLowerCase().trim();
      const combo = `${title}__${comp}`;

      if (!seenIds.has(String(j.id)) && !seenTitles.has(combo)) {
        seenIds.add(String(j.id));
        seenTitles.add(combo);
        rawJobs.push(j);
      }
    };

    // 1. Check tnjobz_candidate_jobs
    try {
      const candStored = localStorage.getItem('tnjobz_candidate_jobs');
      if (candStored) {
        const list = JSON.parse(candStored);
        if (Array.isArray(list)) list.forEach(addIfPublished);
      }
    } catch {}

    // 2. Check tnjobz_recruiter_jobs
    try {
      const stored = localStorage.getItem('tnjobz_recruiter_jobs');
      if (stored) {
        const list = JSON.parse(stored);
        if (Array.isArray(list)) list.forEach(addIfPublished);
      }
    } catch {}

    // 3. Scan all tnjobz_recruiter_jobs_*
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('tnjobz_recruiter_jobs_')) {
        try {
          const uStored = localStorage.getItem(key);
          if (uStored) {
            const list = JSON.parse(uStored);
            if (Array.isArray(list)) list.forEach(addIfPublished);
          }
        } catch {}
      }
    }

    return rawJobs.map(j => {
      const jId = String(j.id);
      const companyName = j.company_name || j.employer_name || j.employer?.company_name || 'My Company';
      const companyLogo = resolveCompanyLogo(j.company_logo, companyName, j.employer);
      const responsibilitiesList = normalizeResponsibilities(j.responsibilities, j.requirements);
      const hasApplied = Boolean(appliedJobIds && appliedJobIds.has(jId));

      return {
        id: jId,
        title: j.title || 'Position',
        company: companyName,
        companyName,
        companyLogo,
        companyInitials: (companyName || 'M').charAt(0).toUpperCase(),
        location: j.location || 'Tambaram, Chennai, Tamil Nadu',
        locationName: j.location || 'Tambaram, Chennai, Tamil Nadu',
        locations: [],
        workMode: j.workMode || 'On-site',
        applicationType: (String(j.applicationType || j.application_type || '').toUpperCase().includes('SIMPLE') || j.employmentType === 'Simple Local') ? 'SIMPLE_LOCAL' : 'PROFILE_RESUME',
        salary: j.minSalary && j.maxSalary ? `₹${Number(j.minSalary).toLocaleString('en-IN')} - ₹${Number(j.maxSalary).toLocaleString('en-IN')}/${j.salary_period || 'month'}` : '₹35,000 - ₹50,000/month',
        salaryMin: j.minSalary ? Number(j.minSalary) : 35000,
        salaryMax: j.maxSalary ? Number(j.maxSalary) : 50000,
        salaryPeriod: j.salary_period || 'month',
        experienceMin: j.minExperience ? Number(j.minExperience) : 0,
        experienceMax: j.maxExperience ? Number(j.maxExperience) : 3,
        skills: Array.isArray(j.skills) ? j.skills : ['React', 'Node.js', 'REST APIs', 'SQL'],
        description: j.description || '',
        responsibilities: responsibilitiesList,
        responsibilitiesList,
        isSaved: false,
        hasApplied,
        isApplied: hasApplied,
        publishedAt: j.created_at || j.createdAt || new Date().toISOString()
      };
    });
  } catch {
    return [];
  }
}

/**
 * Fetch candidate jobs with search, filtering, and tab controls from Django API & local storage
 */
export async function getCandidateJobs(params = {}) {
  await loadCompanyLogos();
  const appliedJobIds = await getCandidateAppliedJobIds();

  const {
    search = '',
    tab = 'for-you',
    category = '',
    industryId = '',
    departmentId = '',
    location = '',
    experience = '',
    jobType = '',
    workMode = '',
    candidateDistrict = '',
    candidateState = ''
  } = params;

  if (tab === 'saved') {
    return getCandidateSavedJobs();
  }

  const query = new URLSearchParams();
  if (search) query.append('search', search);
  if (industryId) query.append('industry', industryId);
  if (departmentId) query.append('department', departmentId);
  else if (category) query.append('category', category);
  if (location) query.append('location', location);
  if (workMode) query.append('work_mode', workMode);

  let backendJobs = [];
  let backendCount = 0;
  let hasRecommendations = false;

  try {
    const url = `${API_BASE_URL}/accounts/candidate/jobs/?${query.toString()}`;
    const response = await authenticatedFetch(url);
    if (response.ok) {
      const data = await response.json();
      const rawList = Array.isArray(data) ? data : (data.results || []);
      backendJobs = rawList.map(raw => normalizeJobRecord(raw, appliedJobIds)).filter(j => j && !j.isExpired);
      backendCount = data.count || backendJobs.length;
      hasRecommendations = Boolean(data.has_recommendations);
    }
  } catch (err) {
    console.warn("Backend fetch candidate jobs warning:", err);
  }

  // Merge local published jobs without duplicates
  const localPublished = getLocalPublishedJobs(appliedJobIds);
  const existingIds = new Set(backendJobs.map(j => String(j.id)));
  const existingTitles = new Set(backendJobs.map(j => `${(j.title || '').trim().toLowerCase()}__${(j.companyName || j.company || '').trim().toLowerCase()}`));
  
  const mergedLocal = localPublished.filter(j => 
    !j.isExpired &&
    !existingIds.has(String(j.id)) &&
    !existingTitles.has(`${(j.title || '').trim().toLowerCase()}__${(j.companyName || j.company || '').trim().toLowerCase()}`)
  );

  let jobs = [...backendJobs, ...mergedLocal].map(j => {
    const hasApplied = Boolean(j.hasApplied || (appliedJobIds && appliedJobIds.has(String(j.id))));
    return {
      ...j,
      hasApplied,
      isApplied: hasApplied
    };
  });

  // Client side extra filter refinements if provided
  if (search) {
    const s = search.toLowerCase();
    jobs = jobs.filter(j => 
      j.title.toLowerCase().includes(s) || 
      (j.companyName || j.company || '').toLowerCase().includes(s) || 
      (j.description || '').toLowerCase().includes(s) ||
      (j.skills || []).some(sk => String(sk).toLowerCase().includes(s))
    );
  }
  if (industryId) {
    const ind = String(industryId).toLowerCase().trim();
    jobs = jobs.filter(j => {
      const jIndName = String(j.industryName || '').toLowerCase().trim();
      const jIndId = String(j.industryId || '').trim();
      const jCatName = String(j.categoryName || j.category || '').toLowerCase().trim();
      const jCatId = String(j.category || '').trim();
      return jIndName.includes(ind) || jIndId === ind || jCatName.includes(ind) || jCatId === ind;
    });
  }
  if (departmentId) {
    const dept = String(departmentId).toLowerCase().trim();
    jobs = jobs.filter(j => {
      const jDeptName = String(j.departmentName || '').toLowerCase().trim();
      const jDeptId = String(j.departmentId || '').trim();
      const jCatName = String(j.categoryName || j.category || '').toLowerCase().trim();
      const jCatId = String(j.category || '').trim();
      return jDeptName.includes(dept) || jDeptId === dept || jCatName.includes(dept) || jCatId === dept;
    });
  }
  if (!industryId && !departmentId && category) {
    const c = String(category).toLowerCase().trim();
    jobs = jobs.filter(j => {
      const catName = String(j.categoryName || j.category || '').toLowerCase().trim();
      const catId = String(j.category || '').trim();
      return catName.includes(c) || catId === c;
    });
  }
  if (location) {
    const l = location.toLowerCase().trim();
    jobs = jobs.filter(j => (j.location || j.locationName || '').toLowerCase().includes(l));
  }
  if (workMode) {
    const w = workMode.toLowerCase().trim();
    jobs = jobs.filter(j => (j.workMode || '').toLowerCase().includes(w));
  }
  if (jobType) {
    const jt = jobType.toLowerCase().trim();
    jobs = jobs.filter(j => (j.applicationType || '').toLowerCase().includes(jt));
  }
  if (experience === 'entry') {
    jobs = jobs.filter(j => (j.experienceMin || 0) <= 2);
  } else if (experience === 'mid') {
    jobs = jobs.filter(j => (j.experienceMin || 0) >= 3 && (j.experienceMin || 0) <= 5);
  } else if (experience === 'senior') {
    jobs = jobs.filter(j => (j.experienceMin || 0) >= 6);
  }

  // Location matching and candidate home district prioritization
  const targetDist = (candidateDistrict || '').toLowerCase().trim();
  jobs = jobs.map(j => {
    const locLower = (j.location || '').toLowerCase();
    const isLocationMatch = Boolean(targetDist && locLower.includes(targetDist));
    return {
      ...j,
      isLocationMatch
    };
  });

  // If candidate hasn't filtered by a specific location, prioritize their home district jobs at the top
  if (!location && targetDist) {
    jobs.sort((a, b) => {
      if (a.isLocationMatch && !b.isLocationMatch) return -1;
      if (!a.isLocationMatch && b.isLocationMatch) return 1;
      return 0;
    });
  }

  return {
    jobs,
    totalCount: jobs.length,
    hasRecommendations
  };
}

/**
 * Fetch Saved Jobs for authenticated candidate
 */
export async function getCandidateSavedJobs() {
  await loadCompanyLogos();
  const appliedJobIds = await getCandidateAppliedJobIds();
  const url = `${API_BASE_URL}/accounts/candidate/saved-jobs/`;
  const response = await authenticatedFetch(url);

  if (!response.ok) {
    return { jobs: [], totalCount: 0 };
  }

  const data = await response.json();
  const rawList = Array.isArray(data) ? data : (data.results || []);
  const jobs = rawList
    .map(sj => normalizeJobRecord(sj.job, appliedJobIds))
    .filter(Boolean)
    .map(j => ({ ...j, isSaved: true }));

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
    const allCats = Array.isArray(categories) ? categories : (categories.results || []);
    cachedAllCategories = allCats;
    // Industries created by Super Admin (top-level categories where parent is null/empty)
    const industries = allCats.filter(c => !c.parent && c.is_active !== false);
    // Departments created by Super Admin (child categories where parent is set)
    const departments = allCats.filter(c => Boolean(c.parent) && c.is_active !== false);

    const rawLocations = locRes.ok ? await locRes.json() : [];
    const dbLocs = Array.isArray(rawLocations) ? rawLocations : (rawLocations.results || []);

    // Filter out test/junk entries from DB like XXX, YYY
    const validDbLocs = dbLocs
      .filter(l => l && l.name && !['xxx', 'yyy'].includes(l.name.toLowerCase().trim()))
      .map(l => l.name.trim());

    // Official districts and popular hubs
    const popularDistricts = [
      'Madurai',
      'Chennai',
      'Coimbatore',
      'Tiruchirappalli',
      'Salem',
      'Tirunelveli',
      'Erode',
      'Vellore',
      'Thanjavur',
      'Dindigul',
      'Cuddalore',
      'Kanchipuram',
      'Tambaram',
      'Bengaluru',
      'Hyderabad',
      'Mumbai',
      'Delhi'
    ];

    const allLocationNames = Array.from(new Set([...validDbLocs, ...popularDistricts]));
    const formattedLocations = allLocationNames.map((name) => ({
      id: name,
      name
    }));

    return {
      industries,
      categories: industries,
      departments,
      allCategories: allCats,
      locations: formattedLocations,
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
      industries: [],
      categories: [],
      departments: [],
      allCategories: [],
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
  await loadCompanyLogos();
  const appliedJobIds = await getCandidateAppliedJobIds();
  const hasAppliedFromHistory = appliedJobIds && appliedJobIds.has(String(jobId));

  try {
    const url = `${API_BASE_URL}/accounts/candidate/jobs/${jobId}/`;
    const response = await authenticatedFetch(url);
    if (response.ok) {
      const data = await response.json();
      const normalized = normalizeJobRecord(data, appliedJobIds);
      if (hasAppliedFromHistory && normalized) {
        normalized.hasApplied = true;
        normalized.isApplied = true;
      }
      return normalized;
    }
  } catch (err) {
    console.warn("Backend getCandidateJobDetails warning:", err);
  }

  // Fallback: look for the job in local storage
  let rawFound = null;
  const storageKeys = ['tnjobz_candidate_jobs', 'tnjobz_recruiter_jobs'];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith('tnjobz_recruiter_jobs_')) storageKeys.push(k);
  }
  for (const k of storageKeys) {
    try {
      const list = JSON.parse(localStorage.getItem(k) || '[]');
      if (Array.isArray(list)) {
        const item = list.find(j => String(j?.id) === String(jobId));
        if (item) {
          rawFound = item;
          break;
        }
      }
    } catch {}
  }

  if (rawFound) {
    const normalized = normalizeJobRecord(rawFound, appliedJobIds);
    if (normalized) {
      normalized.hasApplied = Boolean(normalized.hasApplied || hasAppliedFromHistory);
      normalized.isApplied = Boolean(normalized.hasApplied || hasAppliedFromHistory);
      return normalized;
    }
  }
  return null;
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
  const res = await submitCandidateApplication({ jobId, ...payload });
  if (res && res.success) {
    if (cachedAppliedJobIds) {
      cachedAppliedJobIds.add(String(jobId));
    }
  }
  return res;
}

export async function quickApplyJob(jobId, jobData = {}) {
  const { submitCandidateApplication } = await import('./candidateApplicationsService');
  const res = await submitCandidateApplication({ jobId, ...jobData });
  if (res && res.success) {
    if (cachedAppliedJobIds) {
      cachedAppliedJobIds.add(String(jobId));
    }
  }
  return res;
}

export async function getDepartmentsForIndustry(industryId) {
  if (!industryId) return [];
  try {
    const response = await fetch(`${API_BASE_URL}/accounts/job-categories/?parent_id=${industryId}`);
    if (response.ok) {
      const data = await response.json();
      const list = Array.isArray(data) ? data : (data.results || []);
      const activeList = list.filter(c => c.is_active !== false);
      if (activeList.length > 0) return activeList;
    }
  } catch (err) {
    console.warn("Failed to fetch departments for industry:", err);
  }

  if (cachedAllCategories.length > 0) {
    return cachedAllCategories.filter(c => 
      (String(c.parent) === String(industryId) || c.parent_name === industryId) && c.is_active !== false
    );
  }

  return [];
}
