import { fetchWithAuth } from '../auth/adminAuthService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

/**
 * Fetch live Admin settings, operational preferences, and notification preferences.
 */
export async function getAdminSettings() {
  const response = await fetchWithAuth(`${API_BASE_URL}/accounts/admin/settings/`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || 'Failed to fetch admin settings.');
  }
  return await response.json();
}

/**
 * Update live Admin operational or notification preferences.
 */
export async function updateAdminSettings(payload) {
  const response = await fetchWithAuth(`${API_BASE_URL}/accounts/admin/settings/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || 'Failed to update admin settings.');
  }
  return await response.json();
}

/**
 * Change Admin Password against live Django backend (ChangePasswordView).
 */
export async function changeAdminPassword({ currentPassword, newPassword, confirmNewPassword }) {
  const response = await fetchWithAuth(`${API_BASE_URL}/accounts/change-password/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
      confirm_new_password: confirmNewPassword,
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || data.message || 'Failed to update password.');
  }
  return data;
}
