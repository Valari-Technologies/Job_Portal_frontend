import { authenticatedFetch } from '../auth/adminAuthService';
import { getRecruiterJobsData, fetchRecruiterJobsFromApi, getAuthenticatedRecruiterInfo } from './recruiterJobsService';
import { getRecruiterApplicationsData, fetchRecruiterApplicationsFromApi } from './recruiterApplicationsService';
import { getRecruiterInterviewsData, fetchRecruiterInterviewsFromApi } from './recruiterInterviewsService';
import { getRecruiterCommerceSummary } from './recruiterCommerceService';

const API_BASE_URL = 'http://127.0.0.1:8000';
const DASHBOARD_CACHE_KEY = 'statejobz_recruiter_dashboard';

export function getRecruiterDashboardData() {
  const auth = getAuthenticatedRecruiterInfo();
  const jobsData = getRecruiterJobsData();
  const appsData = getRecruiterApplicationsData();
  const interviewsData = getRecruiterInterviewsData();
  const commerce = getRecruiterCommerceSummary();

  const jobsList = jobsData.jobs || [];
  const appsList = appsData.applications || [];
  const interviewsList = interviewsData.interviews || [];

  const activeJobs = jobsList.filter(j => {
    const s = String(j.status || '').toUpperCase();
    return s === 'PUBLISHED' || s === 'ACTIVE' || s === 'OPEN';
  }).length;

  const totalApplications = appsList.length;

  const shortlistedCount = appsList.filter(a => {
    const s = String(a.status || '').toUpperCase();
    return s === 'SHORTLISTED';
  }).length;

  const pendingCount = appsList.filter(a => {
    const s = String(a.status || '').toUpperCase();
    return s === 'APPLIED' || s === 'UNDER_REVIEW' || s === 'PENDING';
  }).length;

  const interviewsCount = interviewsList.length;

  const hiredCount = appsList.filter(a => {
    const s = String(a.status || '').toUpperCase();
    return s === 'SELECTED' || s === 'HIRED';
  }).length;

  const jobCredits = commerce?.credits?.balance ?? 10;
  const walletBalance = commerce?.wallet?.formatted_balance || '₹0.00';

  // Recent applications (top 5 sorted by date)
  const recentApplications = [...appsList]
    .sort((a, b) => new Date(b.applied_at || 0) - new Date(a.applied_at || 0))
    .slice(0, 5)
    .map(app => {
      const cand = app.candidate || {};
      const fullName = cand.full_name || app.candidate_name || 'Candidate';
      return {
        id: String(app.id),
        candidate_name: fullName,
        candidate_initials: (fullName.charAt(0) || 'C').toUpperCase(),
        job_title: app.job?.title || app.job_title || 'Position',
        status: app.status || 'APPLIED',
        applied_time: app.applied_time || 'Recently'
      };
    });

  // Interviews today or upcoming
  const todayStr = new Date().toISOString().split('T')[0];
  const interviewsToday = interviewsList
    .filter(i => {
      return i.scheduled_date === todayStr || (!i.isPast && i.status !== 'COMPLETED');
    })
    .slice(0, 5)
    .map(inv => {
      const cand = inv.candidate || {};
      return {
        id: String(inv.id),
        candidate_name: cand.full_name || inv.candidateName || 'Candidate',
        job_title: inv.job?.title || inv.jobTitle || 'Role',
        time: inv.scheduled_time || '10:00 AM',
        type: (inv.interview_type || 'ONLINE').replace('_', ' '),
        date: inv.scheduled_date
      };
    });

  return {
    recruiter: auth,
    company: {
      company_name: auth?.companyName || 'My Company'
    },
    wallet_balance: walletBalance,
    metrics: {
      active_jobs: activeJobs,
      total_applications: totalApplications,
      shortlisted: shortlistedCount,
      pending: pendingCount,
      interviews: interviewsCount,
      hired: hiredCount,
      job_credits: jobCredits
    },
    recent_applications: recentApplications,
    interviews_today: interviewsToday
  };
}

export async function fetchRecruiterDashboardFromApi() {
  try {
    // 1. Fetch live backend jobs, applications, and interviews in parallel
    await Promise.allSettled([
      fetchRecruiterJobsFromApi(),
      fetchRecruiterApplicationsFromApi(),
      fetchRecruiterInterviewsFromApi()
    ]);

    // 2. Fetch aggregated dashboard API
    const response = await authenticatedFetch(`${API_BASE_URL}/accounts/recruiter/dashboard/`);
    if (response.ok) {
      const apiData = await response.json();
      if (apiData && apiData.metrics) {
        localStorage.setItem(DASHBOARD_CACHE_KEY, JSON.stringify(apiData));
      }
    }
  } catch (err) {
    console.warn("fetchRecruiterDashboardFromApi warning:", err);
  }
  return getRecruiterDashboardData();
}

export async function createJobDraftService(jobPayload) {
  console.log("Job Draft payload:", jobPayload);
  return { success: true, status: 'Draft' };
}
