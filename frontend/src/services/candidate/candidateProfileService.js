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

const STORAGE_PROFILE_KEY = 'statejobz_candidate_full_profile';
const STORAGE_AVATAR_KEY = 'statejobz_candidate_avatar';

const DEFAULT_PROFILE = {
  fullName: 'Alex Chen',
  firstName: 'Alex',
  lastName: 'Chen',
  email: 'alex.chen@example.com',
  headline: 'Senior Software Developer',
  location: 'San Francisco, CA',
  phone: '+1 (555) 019-2834',
  summary: 'Passionate Senior Software Developer with over 6 years of experience building modern web applications, scalable APIs, and design systems.',
  avatarUrl: null,
  completionPercentage: 80,
  industry: { id: 'ind_it', title: 'Information Technology' },
  specialization: { id: 'spec_dev', title: 'Software Development' },
  
  programmingLanguages: ['JavaScript / TS', 'Python', 'Go'],
  technologies: ['React', 'AWS', 'Docker', 'Kubernetes'],
  
  experiences: [
    {
      id: 'exp_01',
      roleTitle: 'Senior Frontend Engineer',
      companyName: 'TechCorp Solutions',
      period: '2021 - Present',
      location: 'San Francisco, CA',
      description: 'Lead the development of the core customer portal using React and TypeScript. Improved load times by 40% and mentored junior developers.'
    },
    {
      id: 'exp_02',
      roleTitle: 'Full Stack Developer',
      companyName: 'InnovateNow Inc.',
      period: '2018 - 2021',
      location: 'New York, NY',
      description: 'Developed robust REST APIs in Node.js and managed cloud deployments on AWS. Implemented CI/CD pipelines reducing deployment errors.'
    }
  ],

  education: [
    {
      id: 'edu_01',
      degree: 'B.S. Computer Science',
      institution: 'University of Technology',
      period: '2014 - 2018'
    }
  ],

  certifications: [
    {
      id: 'cert_01',
      title: 'AWS Certified Solutions Architect',
      issuedYear: 'Issued: 2022'
    }
  ],

  links: {
    github: '',
    linkedin: 'https://linkedin.com/in/alexchen',
    portfolio: 'https://alexchen.dev',
    expectedSalary: ''
  },

  missingSections: [
    { id: 'github', label: 'Add GitHub Portfolio', sectionKey: 'github' },
    { id: 'salary', label: 'Set Salary Expectations', sectionKey: 'expectedSalary' }
  ]
};

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
    const raw = localStorage.getItem(STORAGE_PROFILE_KEY);
    const storedAvatar = localStorage.getItem(STORAGE_AVATAR_KEY);
    if (!raw) {
      const initial = {
        ...DEFAULT_PROFILE,
        avatarUrl: storedAvatar || null
      };
      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (storedAvatar) parsed.avatarUrl = storedAvatar;
    return parsed;
  } catch (err) {
    console.error('Error reading candidate full profile:', err);
    return DEFAULT_PROFILE;
  }
}

function saveStoredProfile(profileObj) {
  try {
    const completionPercentage = calculateCompletion(profileObj);
    const missingSections = getMissingSections(profileObj);
    const updated = {
      ...profileObj,
      completionPercentage,
      missingSections
    };
    localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(updated));
    if (updated.avatarUrl) {
      localStorage.setItem(STORAGE_AVATAR_KEY, updated.avatarUrl);
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
  localStorage.removeItem(STORAGE_AVATAR_KEY);
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
