import { fetchWithAuth } from '../auth/adminAuthService';

const API_BASE_URL = 'http://127.0.0.1:8000';

export async function getAdminProfile() {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/accounts/me/`);
    if (response.ok) {
      const data = await response.json();
      return {
        id: data.id,
        fullName: data.name || data.fullName,
        name: data.name || data.fullName,
        email: data.email,
        username: data.username,
        role: data.role,
        status: data.status,
      };
    }
  } catch {
    // Fallback to localStorage auth_user if offline
  }

  try {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return {
        id: user.id,
        fullName: user.name || user.fullName || `${user.first_name || ''} ${user.last_name || ''}`.strip() || user.username,
        name: user.name || user.fullName || user.username,
        email: user.email,
        username: user.username,
        role: user.role,
        status: user.status,
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
