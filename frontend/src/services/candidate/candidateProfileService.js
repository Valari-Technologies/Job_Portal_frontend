/**
 * Candidate Profile Service
 * 
 * Manages authenticated candidate profile details, personal & professional info,
 * taxonomy skills, work experience timeline, education, certifications,
 * profile photo upload/crop, and dynamic completion calculation.
 * 
 * Django DRF API Boundaries:
 * - GET /api/v1/candidates/profile/ -> Fetch full candidate profile
 * - PUT/PATCH /api/v1/candidates/profile/ -> Update personal & professional details
 * - POST /api/v1/candidates/profile/photo/ -> Upload & crop profile picture
 * - DELETE /api/v1/candidates/profile/photo/ -> Remove profile picture
 * - POST /api/v1/candidates/profile/experience/ -> Create/update experience records
 * - POST /api/v1/candidates/profile/education/ -> Create/update education records
 * - POST /api/v1/candidates/profile/certifications/ -> Create/update certification records
 */

import { getAuthenticatedUser } from '../auth/adminAuthService';

function getProfileStorageKey() {
  const user = getAuthenticatedUser();
  return user?.email ? `statejobz_candidate_full_profile_${user.email.toLowerCase()}` : 'statejobz_candidate_full_profile_guest';
}

function getAvatarStorageKey() {
  const user = getAuthenticatedUser();
  return user?.email ? `statejobz_candidate_avatar_${user.email.toLowerCase()}` : 'statejobz_candidate_avatar_guest';
}

export function getInitialProfileForCurrentUser() {
  const user = getAuthenticatedUser();
  const fullName = user?.fullName || (user?.first_name || user?.last_name ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : '') || (user?.email ? user.email.split('@')[0] : 'Candidate');
  const nameParts = fullName.trim().split(' ');
  const firstName = user?.first_name || nameParts[0] || 'Candidate';
  const lastName = user?.last_name || nameParts.slice(1).join(' ') || '';
  const email = user?.email || 'candidate@example.com';
  const phone = user?.phone_number || user?.mobileNumber || '';

  return {
    fullName,
    firstName,
    lastName,
    email,
    phone,
    headline: 'Candidate',
    location: 'Tamil Nadu, India',
    summary: 'Welcome! Complete your profile to get personalized job recommendations.',
    avatarUrl: null,
    completionPercentage: 80,
    industry: { id: 'ind_it', title: 'Information Technology' },
    specialization: { id: 'spec_dev', title: 'Software Development' },
    
    programmingLanguages: ['JavaScript / TS', 'Python', 'Go'],
    technologies: ['React', 'AWS', 'Docker', 'Kubernetes'],
    
    experiences: [],

    education: [],

    certifications: [],

    links: {
      github: '',
      linkedin: '',
      portfolio: '',
      expectedSalary: ''
    },

    missingSections: [
      { id: 'github', label: 'Add GitHub Portfolio', sectionKey: 'github' },
      { id: 'salary', label: 'Set Salary Expectations', sectionKey: 'expectedSalary' }
    ]
  };
}

function calculateCompletion(prof) {
  let score = 30; // base score for account
  if (prof.fullName && prof.headline && prof.location) score += 20;
  if (prof.avatarUrl) score += 10;
  if (prof.experiences && prof.experiences.length > 0) score += 15;
  if (prof.education && prof.education.length > 0) score += 10;
  if (prof.certifications && prof.certifications.length > 0) score += 5;
  if (prof.links?.github) score += 5;
  if (prof.links?.expectedSalary) score += 5;

  return Math.min(100, Math.max(40, score));
}

function getMissingSections(prof) {
  const missing = [];
  if (!prof.links?.github) {
    missing.push({ id: 'github', label: 'Add GitHub Portfolio', sectionKey: 'github' });
  }
  if (!prof.links?.expectedSalary) {
    missing.push({ id: 'salary', label: 'Set Salary Expectations', sectionKey: 'expectedSalary' });
  }
  if (!prof.avatarUrl) {
    missing.push({ id: 'photo', label: 'Upload Profile Photo', sectionKey: 'photo' });
  }
  return missing;
}

function getStoredProfile() {
  try {
    const key = getProfileStorageKey();
    const avatarKey = getAvatarStorageKey();
    const raw = localStorage.getItem(key);
    const storedAvatar = localStorage.getItem(avatarKey);
    const initial = getInitialProfileForCurrentUser();

    if (!raw) {
      const profileObj = {
        ...initial,
        avatarUrl: storedAvatar || null
      };
      localStorage.setItem(key, JSON.stringify(profileObj));
      return profileObj;
    }

    const parsed = JSON.parse(raw);

    // Sync authenticated user details to profile
    const user = getAuthenticatedUser();
    if (user) {
      if (user.fullName) parsed.fullName = user.fullName;
      else if (user.first_name || user.last_name) parsed.fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
      if (user.first_name) parsed.firstName = user.first_name;
      if (user.last_name) parsed.lastName = user.last_name;
      if (user.email) parsed.email = user.email;
      if (user.phone_number || user.mobileNumber) parsed.phone = user.phone_number || user.mobileNumber;
    }

    if (storedAvatar) parsed.avatarUrl = storedAvatar;
    return parsed;
  } catch (err) {
    console.error('Error reading candidate full profile:', err);
    return getInitialProfileForCurrentUser();
  }
}

function saveStoredProfile(profileObj) {
  try {
    const key = getProfileStorageKey();
    const avatarKey = getAvatarStorageKey();
    const completionPercentage = calculateCompletion(profileObj);
    const missingSections = getMissingSections(profileObj);
    const updated = {
      ...profileObj,
      completionPercentage,
      missingSections
    };
    localStorage.setItem(key, JSON.stringify(updated));
    if (updated.avatarUrl) {
      localStorage.setItem(avatarKey, updated.avatarUrl);
    }
    return updated;
  } catch (err) {
    console.error('Error saving candidate profile:', err);
    return profileObj;
  }
}

/**
 * Fetch Candidate Profile
 */
export async function getCandidateProfile() {
  await new Promise(resolve => setTimeout(resolve, 100));
  return getStoredProfile();
}

/**
 * Update Personal & Professional Info
 */
export async function updateCandidateProfile(payload) {
  await new Promise(resolve => setTimeout(resolve, 150));
  const current = getStoredProfile();

  const nameParts = (payload.fullName || current.fullName).trim().split(' ');
  const firstName = nameParts[0] || current.firstName;
  const lastName = nameParts.slice(1).join(' ') || current.lastName;

  const updated = saveStoredProfile({
    ...current,
    ...payload,
    firstName,
    lastName,
    fullName: (payload.fullName || current.fullName).trim()
  });

  return { success: true, profile: updated };
}

/**
 * Upload and crop profile photo
 */
export async function uploadCandidateProfilePhoto(file) {
  await new Promise(resolve => setTimeout(resolve, 250));
  if (!file) return { success: false, message: 'No file selected.' };

  // Validate image file type & max size (5MB)
  if (!file.type.startsWith('image/')) {
    return { success: false, message: 'Invalid file type. Please upload a JPEG, PNG, or WebP image.' };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { success: false, message: 'Image file size must be less than 5MB.' };
  }

  const mockUrl = URL.createObjectURL(file);
  const current = getStoredProfile();
  current.avatarUrl = mockUrl;
  const updated = saveStoredProfile(current);

  return { success: true, avatarUrl: mockUrl, profile: updated };
}

/**
 * Remove profile photo
 */
export async function removeCandidateProfilePhoto() {
  await new Promise(resolve => setTimeout(resolve, 100));
  localStorage.removeItem(getAvatarStorageKey());
  const current = getStoredProfile();
  current.avatarUrl = null;
  const updated = saveStoredProfile(current);

  return { success: true, avatarUrl: null, profile: updated };
}

/**
 * Update Repeatable Sections (Experience, Education, Certifications, Skills)
 */
export async function updateCandidateExperience(experiencesList) {
  await new Promise(resolve => setTimeout(resolve, 120));
  const current = getStoredProfile();
  current.experiences = experiencesList;
  const updated = saveStoredProfile(current);
  return { success: true, profile: updated };
}

export async function updateCandidateEducation(educationList) {
  await new Promise(resolve => setTimeout(resolve, 100));
  const current = getStoredProfile();
  current.education = educationList;
  const updated = saveStoredProfile(current);
  return { success: true, profile: updated };
}

export async function updateCandidateCertifications(certificationsList) {
  await new Promise(resolve => setTimeout(resolve, 100));
  const current = getStoredProfile();
  current.certifications = certificationsList;
  const updated = saveStoredProfile(current);
  return { success: true, profile: updated };
}

export async function updateCandidateSkills(programmingLanguages, technologies) {
  await new Promise(resolve => setTimeout(resolve, 100));
  const current = getStoredProfile();
  current.programmingLanguages = programmingLanguages;
  current.technologies = technologies;
  const updated = saveStoredProfile(current);
  return { success: true, profile: updated };
}

export async function updateCandidateLinks(linksPayload) {
  await new Promise(resolve => setTimeout(resolve, 100));
  const current = getStoredProfile();
  current.links = { ...current.links, ...linksPayload };
  const updated = saveStoredProfile(current);
  return { success: true, profile: updated };
}
