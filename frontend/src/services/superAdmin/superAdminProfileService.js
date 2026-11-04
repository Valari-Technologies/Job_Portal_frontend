/**
 * Super Admin Profile Service
 * 
 * Handles reading and updating the Super Admin profile and account settings.
 * Uses local storage for frontend persistence while awaiting backend integration.
 * 
 * Django Backend Integration Boundary:
 * - GET /api/v1/users/me/ -> Fetch authenticated user details. Must verify SUPER_ADMIN role & ownership.
 * - PATCH /api/v1/users/me/ -> Update profile details (full_name, mobile_number, profile_picture).
 * - POST /api/v1/auth/password/change/ -> Securely change user password.
 * - GET /api/v1/users/me/settings/ -> Fetch user preferences & 2FA status.
 * - PATCH /api/v1/users/me/settings/ -> Update preferences (language, timezone, notifications).
 */

import { fetchWithAuth } from '../auth/adminAuthService';

const API_BASE_URL = 'http://127.0.0.1:8000';
const PROFILE_STORAGE_KEY = 'statejobz_super_admin_profile';
const PLACEHOLDER_EMAIL = 'admin@statejobz.tn.gov';

const DEFAULT_SUPER_ADMIN_PROFILE = {
  id: 'sa_usr_001',
  full_name: 'Super Admin',
  email: '',
  mobile_number: '+91 98765 43210',
  profile_picture: null, // Data URL or URL string
  role: 'SUPER_ADMIN',
  role_display: 'Super Admin',
  account_status: 'ACTIVE',
  verification_state: 'Verified (2FA Enforced)',
  email_verified: true,
  mobile_verified: true,
  last_login: '2026-09-04 09:30 AM',
  created_at: '2024-01-15T00:00:00Z',
  
  // Settings & Preferences
  display_name: 'Super Admin',
  location: 'All India',
  state: 'All India',
  district: '',
  location_user_set: false,
  preferred_language: 'en-US',
  time_zone: 'Asia/Kolkata',
  date_format: 'DD/MM/YYYY',
  
  // Security
  two_factor_enabled: true,
  two_factor_mandatory: true,
  security_alerts_enabled: true,

  // Notification Preferences
  notification_preferences: {
    in_app: true,
    email: true,
    security_alerts: true, // Mandatory
    admin_events: true,
    employer_verifications: true,
    job_moderation: true,
    system_updates: true
  },

  // Session Info
  active_sessions: [
    {
      id: 'sess_cur_01',
      device: 'Chrome on Windows 11',
      location: 'Chennai, Tamil Nadu, India',
      ip_address: '106.51.72.10',
      last_active: 'Current Session',
      is_current: true
    }
  ]
};

// Helper: load stored profile or initialize with default
function loadStoredProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(DEFAULT_SUPER_ADMIN_PROFILE));
      return { ...DEFAULT_SUPER_ADMIN_PROFILE };
    }
    const parsed = JSON.parse(raw);
    const merged = {
      ...DEFAULT_SUPER_ADMIN_PROFILE,
      ...parsed,
      location: parsed.location || 'All India'
    };
    // A location the Super Admin never picked (old placeholder default) means "All India"
    if (!parsed.location_user_set) {
      merged.location = 'All India';
      merged.state = 'All India';
      merged.district = '';
    }
    if (merged.email === PLACEHOLDER_EMAIL) merged.email = '';
    return merged;
  } catch (err) {
    console.error('Error loading Super Admin profile from storage:', err);
    return { ...DEFAULT_SUPER_ADMIN_PROFILE };
  }
}

// Save profile to storage
function saveProfileToStorage(profile) {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Error saving Super Admin profile to storage:', err);
  }
}

/**
 * Fetch Super Admin Profile
 */
export async function getSuperAdminProfile() {
  const stored = loadStoredProfile();
  // The identity (email / id) always comes from the logged-in account in the backend
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/accounts/me/`);
    if (response.ok) {
      const me = await response.json();
      return {
        ...stored,
        id: me.id ?? stored.id,
        email: me.email || stored.email
      };
    }
  } catch (err) {
    console.warn('Could not load Super Admin identity from backend:', err);
  }
  return stored;
}

/**
 * Update Super Admin Profile Personal Info
 */
export async function updateSuperAdminProfile(data) {
  await new Promise(resolve => setTimeout(resolve, 250));
  const current = loadStoredProfile();

  const updated = {
    ...current,
    full_name: data.full_name !== undefined ? data.full_name.trim() : current.full_name,
    mobile_number: data.mobile_number !== undefined ? data.mobile_number.trim() : current.mobile_number,
    display_name: data.display_name !== undefined ? data.display_name.trim() : current.display_name,
    location: data.location !== undefined ? data.location.trim() : (current.location || 'All India'),
    state: data.state !== undefined ? data.state.trim() : current.state,
    district: data.district !== undefined ? data.district.trim() : current.district,
    location_user_set: current.location_user_set || (data.location !== undefined && data.location.trim() !== current.location)
  };

  saveProfileToStorage(updated);
  return updated;
}

/**
 * Update Super Admin Location directly
 */
export async function updateSuperAdminLocation(location, state = '', district = '') {
  const current = loadStoredProfile();
  const updated = {
    ...current,
    location: String(location).trim(),
    state: state ? String(state).trim() : current.state,
    district: String(district || '').trim(),
    location_user_set: true
  };
  saveProfileToStorage(updated);
  return updated;
}

/**
 * Update Super Admin Profile Picture
 * Accepts Blob or Base64 data string
 */
export async function updateSuperAdminProfilePicture(imageBlobOrUrl) {
  await new Promise(resolve => setTimeout(resolve, 300));
  const current = loadStoredProfile();

  let pictureUrl = imageBlobOrUrl;
  if (imageBlobOrUrl instanceof Blob) {
    pictureUrl = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(imageBlobOrUrl);
    });
  }

  const updated = {
    ...current,
    profile_picture: pictureUrl
  };

  saveProfileToStorage(updated);
  return updated;
}

/**
 * Remove Super Admin Profile Picture
 */
export async function removeSuperAdminProfilePicture() {
  await new Promise(resolve => setTimeout(resolve, 200));
  const current = loadStoredProfile();

  const updated = {
    ...current,
    profile_picture: null
  };

  saveProfileToStorage(updated);
  return updated;
}

/**
 * Update Super Admin General Settings
 */
export async function updateSuperAdminSettings(settingsData) {
  await new Promise(resolve => setTimeout(resolve, 250));
  const current = loadStoredProfile();

  const updated = {
    ...current,
    preferred_language: settingsData.preferred_language || current.preferred_language,
    time_zone: settingsData.time_zone || current.time_zone,
    date_format: settingsData.date_format || current.date_format,
    display_name: settingsData.display_name || current.display_name,
    security_alerts_enabled: settingsData.security_alerts_enabled !== undefined 
      ? settingsData.security_alerts_enabled 
      : current.security_alerts_enabled,
    notification_preferences: {
      ...current.notification_preferences,
      ...(settingsData.notification_preferences || {})
    }
  };

  saveProfileToStorage(updated);
  return updated;
}

/**
 * Change Super Admin Password
 */
export async function changeSuperAdminPassword({ currentPassword, newPassword }) {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  if (!currentPassword || !newPassword) {
    throw new Error('Current password and new password are required.');
  }

  if (newPassword.length < 8) {
    throw new Error('New password must be at least 8 characters long.');
  }

  // Verification placeholder: in real Django backend POST /api/v1/auth/password/change/
  return { success: true, message: 'Password changed successfully.' };
}

/**
 * Revoke Other Active Sessions
 */
export async function revokeOtherSessions() {
  await new Promise(resolve => setTimeout(resolve, 300));
  const current = loadStoredProfile();

  const updated = {
    ...current,
    active_sessions: current.active_sessions.filter(s => s.is_current)
  };

  saveProfileToStorage(updated);
  return updated;
}
