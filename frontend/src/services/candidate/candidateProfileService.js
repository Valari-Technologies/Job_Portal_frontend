/**
 * Candidate Profile Service
 * 
 * Manages authenticated candidate profile details, personal & professional info,
 * taxonomy skills, work experience timeline, education, certifications,
 * profile photo upload, and dynamic completion calculation.
 * 
 * Django DRF API Boundaries:
 * - GET /accounts/candidate/profile/ -> Fetch full candidate profile
 * - PUT/PATCH /accounts/candidate/profile/ -> Update personal & professional details
 * - POST /accounts/candidate/profile/photo/ -> Upload profile picture
 * - DELETE /accounts/candidate/profile/photo/ -> Remove profile picture
 */

import { authenticatedFetch, getAuthenticatedUser } from '../auth/adminAuthService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export function getInitialProfileForCurrentUser() {
  const user = getAuthenticatedUser();
  const fullName = user?.fullName || (user?.first_name || user?.last_name ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : '') || (user?.email ? user.email.split('@')[0] : 'Candidate');
  const nameParts = fullName.trim().split(' ');
  const firstName = user?.first_name || nameParts[0] || 'Candidate';
  const lastName = user?.last_name || nameParts.slice(1).join(' ') || '';
  const email = user?.email || 'candidate@example.com';
  const phone = user?.phone_number || user?.mobileNumber || '';

  const userKey = user?.email || user?.id || 'anon';
  let cachedAvatar = null;
  try {
    cachedAvatar = localStorage.getItem(`tnjobz_candidate_avatar_${userKey}`);
  } catch {}

  const avatarUrl = cachedAvatar || user?.profile_picture || user?.avatarUrl || null;

  return {
    fullName,
    firstName,
    lastName,
    email,
    phone,
    headline: '',
    location: '',
    summary: '',
    avatarUrl,
    completionPercentage: 0,
    experiences: [],
    education: [],
    skills: [],
    programmingLanguages: [],
    technologies: [],
    certifications: [],
    links: { github: '', linkedin: '', portfolio: '', expectedSalary: '' },
    missingSections: []
  };
}

/**
 * Fetch Candidate Profile from Django API
 */
export async function getCandidateProfile() {
  const url = `${API_BASE_URL}/accounts/candidate/profile/`;
  const response = await authenticatedFetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch candidate profile.');
  }

  const data = await response.json();
  const user = getAuthenticatedUser();
  const userKey = user?.email || user?.id || 'anon';

  if (data?.avatarUrl) {
    try {
      localStorage.setItem(`tnjobz_candidate_avatar_${userKey}`, data.avatarUrl);
    } catch {}
  } else {
    try {
      localStorage.removeItem(`tnjobz_candidate_avatar_${userKey}`);
      localStorage.removeItem('tnjobz_candidate_avatar');
    } catch {}
  }
  return data;
}

/**
 * Update Personal & Professional Info in Django API
 */
export async function updateCandidateProfile(payload) {
  const url = `${API_BASE_URL}/accounts/candidate/profile/`;
  const response = await authenticatedFetch(url, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const resData = await response.json().catch(() => ({}));
    return { success: false, message: resData.detail || 'Failed to update candidate profile.' };
  }

  const updatedProfile = await response.json();
  return { success: true, profile: updatedProfile };
}

/**
 * Upload profile photo to Django API
 */
export async function uploadCandidateProfilePhoto(file) {
  if (!file) return { success: false, message: 'No file selected.' };

  if (file.type && !file.type.startsWith('image/')) {
    return { success: false, message: 'Invalid file type. Please upload a JPEG, PNG, or WebP image.' };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { success: false, message: 'Image file size must be less than 5MB.' };
  }

  const formData = new FormData();
  const fileToUpload = (file instanceof Blob && !(file instanceof File))
    ? new File([file], 'profile_picture.jpg', { type: file.type || 'image/jpeg' })
    : file;
  formData.append('profile_picture', fileToUpload);

  const url = `${API_BASE_URL}/accounts/candidate/profile/photo/`;
  const response = await authenticatedFetch(url, {
    method: 'POST',
    body: formData
  });

  const resData = await response.json();

  if (!response.ok) {
    return { success: false, message: resData.detail || 'Failed to upload photo.' };
  }

  const user = getAuthenticatedUser();
  const userKey = user?.email || user?.id || 'anon';

  if (resData.avatarUrl) {
    try {
      localStorage.setItem(`tnjobz_candidate_avatar_${userKey}`, resData.avatarUrl);
      localStorage.removeItem('tnjobz_candidate_avatar');
    } catch {}
  }

  const updatedProfile = await getCandidateProfile();

  return {
    success: true,
    avatarUrl: resData.avatarUrl,
    profile: updatedProfile
  };
}

/**
 * Remove profile photo in Django API
 */
export async function removeCandidateProfilePhoto() {
  const url = `${API_BASE_URL}/accounts/candidate/profile/photo/`;
  const response = await authenticatedFetch(url, {
    method: 'DELETE'
  });

  if (!response.ok) {
    return { success: false, message: 'Failed to remove photo.' };
  }

  const user = getAuthenticatedUser();
  const userKey = user?.email || user?.id || 'anon';
  try {
    localStorage.removeItem(`tnjobz_candidate_avatar_${userKey}`);
    localStorage.removeItem('tnjobz_candidate_avatar');
  } catch {}

  const updatedProfile = await getCandidateProfile();

  return {
    success: true,
    avatarUrl: null,
    profile: updatedProfile
  };
}

export async function updateCandidateExperience(experiencesList) {
  return updateCandidateProfile({ experiences: experiencesList });
}

export async function updateCandidateEducation(educationList) {
  return updateCandidateProfile({ education: educationList });
}

export async function updateCandidateCertifications(certificationsList) {
  return updateCandidateProfile({ certifications: certificationsList });
}

export async function updateCandidateSkills(programmingLanguages, technologies) {
  return updateCandidateProfile({ programmingLanguages, technologies });
}

export async function updateCandidateLinks(linksPayload) {
  return updateCandidateProfile({ links: linksPayload });
}
