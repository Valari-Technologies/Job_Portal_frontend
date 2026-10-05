/**
 * Candidate Dashboard Service
 * 
 * Manages dashboard recommendations, candidate profile summary, recent applications,
 * notifications, quick-apply submissions, and saved job relationships.
 * 
 * Django DRF API Boundaries:
 * - GET /accounts/candidate/dashboard/ -> Aggregate dashboard data
 * - GET /accounts/notifications/ -> List notifications
 * - POST /accounts/notifications/{id}/mark-read/ -> Mark read
 * - POST /accounts/notifications/mark-all-read/ -> Mark all read
 */

import { getCandidateProfile, uploadCandidateProfilePhoto, removeCandidateProfilePhoto as removeCandidateProfilePhotoService } from './candidateProfileService';
import { authenticatedFetch } from '../auth/adminAuthService';

const API_BASE_URL = 'http://127.0.0.1:8000';

export async function getCandidateDashboardData() {
  const url = `${API_BASE_URL}/accounts/candidate/dashboard/`;
  const response = await authenticatedFetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard data.');
  }

  return response.json();
}

export async function getCandidateDashboardProfile() {
  return getCandidateProfile();
}

export async function getRecommendedJobs() {
  const dashData = await getCandidateDashboardData();
  return dashData.recommendedJobs || [];
}

export async function getRecentApplications() {
  const dashData = await getCandidateDashboardData();
  return dashData.recentApplications || [];
}

export async function getCandidateNotificationSummary() {
  const url = `${API_BASE_URL}/accounts/notifications/`;
  const countUrl = `${API_BASE_URL}/accounts/notifications/unread-count/`;

  try {
    const [listRes, countRes] = await Promise.all([
      authenticatedFetch(url),
      authenticatedFetch(countUrl)
    ]);

    const notifs = listRes.ok ? await listRes.json() : [];
    const countData = countRes.ok ? await countRes.json() : { unread_count: 0 };

    const rawList = Array.isArray(notifs) ? notifs : (notifs.results || []);

    return {
      notifications: rawList.map(n => ({
        id: String(n.id),
        title: n.title,
        message: n.message,
        timestamp: n.formatted_time || 'recently',
        is_read: Boolean(n.is_read),
        linkUrl: '/candidate/applications'
      })),
      unreadCount: countData.unread_count || 0
    };
  } catch {
    return {
      notifications: [],
      unreadCount: 0
    };
  }
}

export async function markNotificationAsRead(id) {
  const url = `${API_BASE_URL}/accounts/notifications/${id}/mark-read/`;
  const response = await authenticatedFetch(url, { method: 'POST' });
  return { success: response.ok };
}

export async function markAllNotificationsAsRead() {
  const url = `${API_BASE_URL}/accounts/notifications/mark-all-read/`;
  const response = await authenticatedFetch(url, { method: 'POST' });
  return { success: response.ok };
}

export async function updateCandidateProfilePhoto(file) {
  return uploadCandidateProfilePhoto(file);
}

export async function removeCandidateProfilePhoto() {
  return removeCandidateProfilePhotoService();
}

export async function toggleSavedJob(jobId) {
  const { toggleSavedCandidateJob } = await import('./candidateJobsService');
  return toggleSavedCandidateJob(jobId);
}

export async function quickApplyJob(jobId, jobData = {}) {
  const { submitCandidateApplication } = await import('./candidateApplicationsService');
  return submitCandidateApplication({ jobId, ...jobData });
}
