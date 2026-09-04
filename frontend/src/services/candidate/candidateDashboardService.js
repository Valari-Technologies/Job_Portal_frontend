/**
 * Candidate Dashboard Service
 * 
 * Manages dashboard recommendations, candidate profile summary, recent applications,
 * notifications, quick-apply submissions, and saved job relationships.
 */

import { getCandidateProfile } from './candidateProfileService';

const STORAGE_SAVED_JOBS_KEY = 'statejobz_candidate_saved_jobs';
const STORAGE_APPLICATIONS_KEY = 'statejobz_candidate_applications';
const STORAGE_AVATAR_KEY = 'statejobz_candidate_avatar';

const INITIAL_RECOMMENDED_JOBS = [];
const INITIAL_RECENT_APPLICATIONS = [];

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif_01',
    title: 'Application Shortlisted',
    message: 'Your application for React Developer at Vercel has been shortlisted!',
    timestamp: '2 hours ago',
    is_read: false,
    linkUrl: '/candidate/applications'
  },
  {
    id: 'notif_02',
    title: 'New Job Recommendation',
    message: 'TechCorp Inc. posted a new Senior UX Designer role matching your profile.',
    timestamp: '1 day ago',
    is_read: false,
    linkUrl: '/candidate/jobs'
  }
];

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
    console.error('Error saving stored job IDs:', err);
  }
}

function getStoredApplications() {
  try {
    const raw = localStorage.getItem(STORAGE_APPLICATIONS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_RECENT_APPLICATIONS;
  } catch {
    return INITIAL_RECENT_APPLICATIONS;
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
 * Fetch candidate dashboard profile summary
 */
export async function getCandidateDashboardProfile() {
  return getCandidateProfile();
}

/**
 * Fetch candidate recommended jobs
 */
export async function getRecommendedJobs() {
  await new Promise(resolve => setTimeout(resolve, 150));
  const savedIds = getStoredSavedJobIds();
  const applications = getStoredApplications();

  return INITIAL_RECOMMENDED_JOBS.map(job => ({
    ...job,
    isSaved: savedIds.includes(job.id),
    isApplied: applications.some(app => app.jobId === job.id || app.jobTitle === job.title)
  }));
}

/**
 * Fetch candidate recent applications
 */
export async function getRecentApplications() {
  await new Promise(resolve => setTimeout(resolve, 120));
  return getStoredApplications();
}

/**
 * Fetch candidate notification summary
 */
export async function getCandidateNotificationSummary() {
  await new Promise(resolve => setTimeout(resolve, 100));
  const unread = INITIAL_NOTIFICATIONS.filter(n => !n.is_read).length;
  return {
    notifications: INITIAL_NOTIFICATIONS,
    unreadCount: unread
  };
}

/**
 * Toggle saved job state for current candidate
 */
export async function toggleSavedJob(jobId) {
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
 * Quick apply to a job
 */
export async function quickApplyJob(jobId, jobData = {}) {
  await new Promise(resolve => setTimeout(resolve, 200));
  const apps = getStoredApplications();
  const existing = apps.find(a => a.jobId === jobId || a.jobTitle === jobData.title);

  if (existing) {
    return { success: false, message: 'You have already applied for this position.' };
  }

  const newApp = {
    id: `app_${Date.now()}`,
    jobId: jobId,
    jobTitle: jobData.title || 'Specialist Role',
    company: jobData.company || 'Tech Employer',
    companyInitials: (jobData.company || 'T').charAt(0),
    iconType: 'code',
    status: 'APPLIED',
    appliedAt: new Date().toISOString().split('T')[0]
  };

  const updated = [newApp, ...apps];
  saveStoredApplications(updated);
  return { success: true, application: newApp };
}

/**
 * Upload candidate profile photo
 */
export async function updateCandidateProfilePhoto(file) {
  await new Promise(resolve => setTimeout(resolve, 300));
  if (!file) return { success: false };
  const mockUrl = URL.createObjectURL(file);
  localStorage.setItem(STORAGE_AVATAR_KEY, mockUrl);
  return { success: true, avatarUrl: mockUrl };
}

/**
 * Remove candidate profile photo
 */
export async function removeCandidateProfilePhoto() {
  await new Promise(resolve => setTimeout(resolve, 150));
  localStorage.removeItem(STORAGE_AVATAR_KEY);
  return { success: true, avatarUrl: null };
}

/**
 * Mark candidate notification as read
 */
export async function markNotificationAsRead(id) {
  await new Promise(resolve => setTimeout(resolve, 50));
  const target = INITIAL_NOTIFICATIONS.find(n => n.id === id);
  if (target) {
    target.is_read = true;
  }
  return { success: true };
}

/**
 * Mark all candidate notifications as read
 */
export async function markAllNotificationsAsRead() {
  await new Promise(resolve => setTimeout(resolve, 50));
  INITIAL_NOTIFICATIONS.forEach(n => { n.is_read = true; });
  return { success: true };
}
