import { fetchWithAuth } from '../auth/adminAuthService';

const API_BASE_URL = 'http://127.0.0.1:8000';
const STORAGE_RECRUITER_JOBS_KEY = 'tnjobz_recruiter_jobs';

function getAllLocalRecruiterJobs() {
  const allJobs = [];
  const seenIds = new Set();
  const seenKeys = new Set();

  try {
    const globalStr = localStorage.getItem(STORAGE_RECRUITER_JOBS_KEY);
    if (globalStr) {
      const list = JSON.parse(globalStr);
      if (Array.isArray(list)) {
        list.forEach(j => {
          const comp = (j.company_name || j.employer_name || j.employer?.company_name || '').toLowerCase().trim();
          const title = (j.title || '').toLowerCase().trim();
          const combo = `${title}__${comp}`;
          if (j && j.id && !seenIds.has(String(j.id)) && !seenKeys.has(combo)) {
            seenIds.add(String(j.id));
            seenKeys.add(combo);
            allJobs.push(j);
          }
        });
      }
    }

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('tnjobz_recruiter_jobs_')) {
        try {
          const userJobsStr = localStorage.getItem(key);
          if (userJobsStr) {
            const userJobs = JSON.parse(userJobsStr);
            if (Array.isArray(userJobs)) {
              userJobs.forEach(j => {
                const comp = (j.company_name || j.employer_name || j.employer?.company_name || '').toLowerCase().trim();
                const title = (j.title || '').toLowerCase().trim();
                const combo = `${title}__${comp}`;
                if (j && j.id && !seenIds.has(String(j.id)) && !seenKeys.has(combo)) {
                  seenIds.add(String(j.id));
                  seenKeys.add(combo);
                  allJobs.push(j);
                }
              });
            }
          }
        } catch {}
      }
    }
  } catch {}
  return allJobs;
}

export async function fetchJobReviewsService(params = {}) {
  let apiResults = [];
  let apiCount = 0;

  try {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.status && params.status !== 'ALL') query.append('status', params.status);
    if (params.category_id) query.append('category_id', params.category_id);
    if (params.employer_id) query.append('employer_id', params.employer_id);
    if (params.page) query.append('page', params.page);

    const url = `${API_BASE_URL}/accounts/admin/job-reviews/?${query.toString()}`;
    const response = await fetchWithAuth(url);
    if (response.ok) {
      const data = await response.json();
      apiResults = data.results || (Array.isArray(data) ? data : []);
      apiCount = data.count || apiResults.length;
    }
  } catch (error) {
    console.warn("fetchJobReviewsService API call warning, using storage fallback:", error);
  }

  try {
    let localJobs = getAllLocalRecruiterJobs();
    if (localJobs.length === 0) {
      localJobs = [
        {
          id: 'job_rec_01',
          title: 'Senior Full-Stack Developer',
          company_name: 'MSD Tech',
          employer_name: 'MSD Tech',
          category: 'Engineering',
          workMode: 'On-site',
          location: 'Chennai, TN',
          status: 'PENDING_REVIEW',
          status_label: 'Pending Review',
          submitted_date: new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString().split('T')[0]
        }
      ];
    }

    if (params.status && params.status !== 'ALL' && params.status !== 'All') {
      const target = params.status.toUpperCase();
      localJobs = localJobs.filter(j => {
        const s = (j.status || j.status_label || '').toUpperCase();
        return s === target;
      });
    }

    if (params.search) {
      const q = params.search.toLowerCase();
      localJobs = localJobs.filter(j => 
        (j.title && j.title.toLowerCase().includes(q)) ||
        (j.company_name && j.company_name.toLowerCase().includes(q)) ||
        (j.employer_name && j.employer_name.toLowerCase().includes(q)) ||
        (j.category && j.category.toLowerCase().includes(q))
      );
    }

    // Merge API results and local recruiter jobs without duplicates
    const apiIds = new Set(apiResults.map(j => String(j.id)));
    const apiKeys = new Set(apiResults.map(j => {
      const comp = (j.company_name || j.employer?.company_name || '').toLowerCase().trim();
      const title = (j.title || '').toLowerCase().trim();
      return `${title}__${comp}`;
    }));

    const unmergedLocal = localJobs.filter(j => {
      const comp = (j.company_name || j.employer_name || j.employer?.company_name || '').toLowerCase().trim();
      const title = (j.title || '').toLowerCase().trim();
      const combo = `${title}__${comp}`;
      return !apiIds.has(String(j.id)) && !apiKeys.has(combo);
    });

    const combined = [...apiResults, ...unmergedLocal];

    return {
      results: combined,
      count: combined.length,
      totalPages: Math.max(1, Math.ceil(combined.length / 10)),
    };
  } catch {
    return { results: apiResults, count: apiCount || apiResults.length, totalPages: 1 };
  }
}

export async function reviewJobDecisionService(jobId, payload) {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/accounts/admin/jobs/${jobId}/review/`, {
      method: 'POST',
      body: JSON.stringify({
        action: payload.action,
        reason: payload.reason || payload.notes,
        notes: payload.notes || payload.reason,
      }),
    });

    if (response.ok) {
      const data = await response.json().catch(() => ({}));
      updateLocalJobStatus(jobId, payload.action);
      return { success: true, data };
    }
  } catch (error) {
    console.warn("reviewJobDecisionService backend warning, updating local storage:", error);
  }

  // Storage sync fallback
  updateLocalJobStatus(jobId, payload.action);
  return { success: true, message: `Job status updated to ${payload.action}` };
}

function updateLocalJobStatus(jobId, action) {
  try {
    const isApprove = action === 'APPROVED' || action === 'APPROVE';
    const newStatus = isApprove ? 'PUBLISHED' : 'REJECTED';
    const newLabel = isApprove ? 'Published' : 'Rejected';

    // 1. Update tnjobz_recruiter_jobs
    let updatedJobObj = null;
    try {
      const stored = localStorage.getItem(STORAGE_RECRUITER_JOBS_KEY);
      if (stored) {
        let jobs = JSON.parse(stored);
        jobs = jobs.map(j => {
          if (String(j.id) === String(jobId) || String(j.pk) === String(jobId)) {
            updatedJobObj = { ...j, status: newStatus, status_label: newLabel };
            return updatedJobObj;
          }
          return j;
        });
        localStorage.setItem(STORAGE_RECRUITER_JOBS_KEY, JSON.stringify(jobs));
      }
    } catch {}

    // 2. Update all tnjobz_recruiter_jobs_* stores
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('tnjobz_recruiter_jobs_')) {
        try {
          const userStored = localStorage.getItem(key);
          if (userStored) {
            let uJobs = JSON.parse(userStored);
            let changed = false;
            uJobs = uJobs.map(j => {
              if (String(j.id) === String(jobId) || String(j.pk) === String(jobId)) {
                changed = true;
                updatedJobObj = { ...j, status: newStatus, status_label: newLabel };
                return updatedJobObj;
              }
              return j;
            });
            if (changed) {
              localStorage.setItem(key, JSON.stringify(uJobs));
            }
          }
        } catch {}
      }
    }

    // 3. Update tnjobz_candidate_jobs so candidates immediately see approved jobs
    try {
      const candStored = localStorage.getItem('tnjobz_candidate_jobs');
      let candJobs = candStored ? JSON.parse(candStored) : [];
      let found = false;
      candJobs = candJobs.map(j => {
        if (String(j.id) === String(jobId) || String(j.pk) === String(jobId)) {
          found = true;
          return { ...j, status: newStatus, status_label: newLabel };
        }
        return j;
      });
      if (!found && isApprove && updatedJobObj) {
        candJobs = [updatedJobObj, ...candJobs];
      }
      localStorage.setItem('tnjobz_candidate_jobs', JSON.stringify(candJobs));
    } catch {}
  } catch (err) {
    console.error("Error updating local job status:", err);
  }
}
