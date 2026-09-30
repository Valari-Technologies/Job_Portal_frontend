import { fetchWithAuth, getAuthenticatedUser } from '../auth/adminAuthService';

const API_BASE_URL = 'http://127.0.0.1:8000';

export async function getAdminProfile() {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/accounts/me/`);
    if (response.ok) {
      const data = await response.json();
      const displayName = data.full_name || data.name || data.fullName || (data.first_name ? `${data.first_name} ${data.last_name || ''}`.trim() : null) || data.username;
      
      const profileData = {
        id: data.id,
        fullName: displayName,
        name: displayName,
        email: data.email,
        username: data.username,
        role: data.role,
        status: data.status,
        phoneNumber: data.phone_number || '',
      };

      // Ensure authenticated user object in localStorage stays in sync with API payload
      const userObj = {
        id: data.id,
        email: data.email,
        username: data.username,
        role: data.role,
        full_name: displayName,
        fullName: displayName,
        name: displayName,
        status: data.status,
        phone_number: data.phone_number
      };

      if (data.role === 'SUPER_ADMIN') {
        localStorage.setItem('super_admin_auth_user', JSON.stringify(userObj));
      } else if (data.role === 'ADMIN') {
        localStorage.setItem('admin_auth_user', JSON.stringify(userObj));
      }

      return profileData;
    }
  } catch {
    // Fallback to local user state
  }

  try {
    const user = getAuthenticatedUser();
    if (user) {
      const displayName = user.full_name || user.fullName || user.name || (user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : null) || user.username;
      return {
        id: user.id,
        fullName: displayName,
        name: displayName,
        email: user.email,
        username: user.username,
        role: user.role,
        status: user.status,
        phoneNumber: user.phone_number || '',
      };
    }
  } catch {
    // Ignore parse error
  }

  return null;
}

export async function updateAdminProfile() {
  return null;
}
