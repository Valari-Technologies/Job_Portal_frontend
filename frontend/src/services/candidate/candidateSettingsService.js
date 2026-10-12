/**
 * Candidate Settings Service
 * 
 * Centralized service managing Candidate Account Security, Profile Shortcuts,
 * Notification Preferences, Quiet Hours, Privacy Settings, Data Sharing,
 * Data Archive Requests, Resume Defaults, and Account Deletion.
 * 
 * Django DRF API Boundaries:
 * - GET /api/v1/candidates/settings/ -> Fetch candidate settings
 * - PUT/PATCH /api/v1/candidates/settings/ -> Save general preferences
 * - POST /api/v1/candidates/account/change-password/ -> Change account password
 * - GET /api/v1/candidates/account/sessions/ -> List active sessions
 * - POST /api/v1/candidates/account/sessions/revoke-others/ -> Revoke all other sessions
 * - POST /api/v1/candidates/settings/2fa/toggle/ -> Toggle 2FA authentication
 * - POST /api/v1/candidates/settings/data-archive/ -> Request data export archive
 * - POST /api/v1/candidates/account/delete/ -> Submit account deletion request
 */

import { getCandidateProfile, updateCandidateProfile } from './candidateProfileService';

const STORAGE_SETTINGS_KEY = 'statejobz_candidate_settings';
const STORAGE_SESSIONS_KEY = 'statejobz_candidate_sessions';

const DEFAULT_SETTINGS = {
  notifications: {
    emailNotifications: true,
    smsAlerts: false,
    pushNotifications: true
  },
  quietHours: {
    enabled: true,
    fromTime: '22:00',
    toTime: '08:00',
    timezone: 'Asia/Kolkata'
  },
  privacy: {
    profileVisibility: 'RECRUITERS_ONLY', // 'PUBLIC' | 'RECRUITERS_ONLY' | 'PRIVATE'
    shareApplicationHistory: true,
    aiResumeTraining: false
  },
  security: {
    mfaEnabled: true
  },
  resume: {
    activeResumeTitle: 'Senior Product Designer - Tech',
    lastUpdated: '2 days ago',
    atsScore: 85,
    keywordMatches: ['Figma', 'UX Research', 'Design Systems'],
    variations: [
      {
        id: 'var_01',
        title: 'UX Researcher Focus',
        usedFor: 'Google, Meta',
        date: 'Oct 12',
        score: 78
      },
      {
        id: 'var_02',
        title: 'Startup Generalist',
        usedFor: 'Series A startups',
        date: 'Sep 28',
        score: 82
      }
    ]
  },
  dataArchive: {
    status: null, // null | 'PROCESSING' | 'COMPLETED'
    requestedAt: null
  }
};

const DEFAULT_SESSIONS = [
  {
    id: 'sess_01',
    device: 'Mac OS • Safari',
    location: 'Active Now • Chennai, Tamil Nadu',
    isCurrent: true,
    iconType: 'laptop'
  },
  {
    id: 'sess_02',
    device: 'iOS • App',
    location: 'Last active: 2 hours ago',
    isCurrent: false,
    iconType: 'mobile'
  }
];

function getStoredSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_SETTINGS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading settings storage:', err);
    return DEFAULT_SETTINGS;
  }
}

function saveStoredSettings(settings) {
  try {
    localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Error saving settings storage:', err);
  }
}

function getStoredSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_SESSIONS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_SESSIONS_KEY, JSON.stringify(DEFAULT_SESSIONS));
      return DEFAULT_SESSIONS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_SESSIONS;
  }
}

function saveStoredSessions(sessions) {
  try {
    localStorage.setItem(STORAGE_SESSIONS_KEY, JSON.stringify(sessions));
  } catch (err) {
    console.error('Error saving sessions storage:', err);
  }
}

/**
 * Fetch full candidate settings combined with profile data
 */
export async function getCandidateSettings() {
  await new Promise(resolve => setTimeout(resolve, 100));
  const settings = getStoredSettings();
  const profile = await getCandidateProfile();
  const sessions = getStoredSessions();

  return {
    ...settings,
    profile,
    sessions
  };
}

/**
 * Save General Candidate Preferences & Profile Summary
 */
export async function updateCandidateGeneralSettings(payload) {
  await new Promise(resolve => setTimeout(resolve, 150));
  const { profilePayload, settingsPayload } = payload;

  let updatedProfile = null;
  if (profilePayload) {
    const res = await updateCandidateProfile(profilePayload);
    updatedProfile = res.profile;
  }

  const currentSettings = getStoredSettings();
  const updatedSettings = {
    ...currentSettings,
    ...(settingsPayload || {})
  };

  saveStoredSettings(updatedSettings);

  return {
    success: true,
    settings: updatedSettings,
    profile: updatedProfile || (await getCandidateProfile())
  };
}

/**
 * Change Account Password
 */
export async function changeCandidatePassword(payload) {
  await new Promise(resolve => setTimeout(resolve, 200));
  const { currentPassword, newPassword, confirmNewPassword } = payload;

  if (!currentPassword) {
    return { success: false, message: 'Please enter your current password.' };
  }
  if (!newPassword || newPassword.length < 8) {
    return { success: false, message: 'New password must be at least 8 characters long.' };
  }
  if (newPassword !== confirmNewPassword) {
    return { success: false, message: 'New password and confirmation do not match.' };
  }

  return {
    success: true,
    message: 'Password updated successfully! Other active sessions remain secure.'
  };
}

/**
 * Toggle 2FA Authentication
 */
export async function toggle2FASetting() {
  await new Promise(resolve => setTimeout(resolve, 120));
  const settings = getStoredSettings();
  settings.security.mfaEnabled = !settings.security.mfaEnabled;
  saveStoredSettings(settings);
  return {
    success: true,
    mfaEnabled: settings.security.mfaEnabled,
    message: settings.security.mfaEnabled ? '2FA is now enabled.' : '2FA has been disabled.'
  };
}

/**
 * Revoke All Other Devices / Sessions
 */
export async function revokeOtherSessions() {
  await new Promise(resolve => setTimeout(resolve, 150));
  const current = getStoredSessions();
  const remaining = current.filter(s => s.isCurrent);
  saveStoredSessions(remaining);
  return {
    success: true,
    sessions: remaining,
    message: 'Logged out from all other devices successfully.'
  };
}

/**
 * Request Data Archive Export
 */
export async function requestCandidateDataArchive() {
  await new Promise(resolve => setTimeout(resolve, 200));
  const settings = getStoredSettings();
  settings.dataArchive = {
    status: 'PROCESSING',
    requestedAt: new Date().toISOString()
  };
  saveStoredSettings(settings);
  return {
    success: true,
    message: 'Data archive request submitted. You will receive a download link once ready.',
    dataArchive: settings.dataArchive
  };
}

/**
 * Request Account Deletion
 */
export async function requestAccountDeletion(payload) {
  await new Promise(resolve => setTimeout(resolve, 250));
  const { password, confirmationText } = payload;

  if (!password) {
    return { success: false, message: 'Please enter your password to confirm account deletion.' };
  }
  if (confirmationText !== 'DELETE') {
    return { success: false, message: 'Please type DELETE to confirm.' };
  }

  return {
    success: true,
    message: 'Account deletion request submitted. Your account data will be permanently removed within 30 days.'
  };
}
