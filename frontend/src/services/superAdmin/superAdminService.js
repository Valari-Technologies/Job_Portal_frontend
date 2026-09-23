import { fetchWithAuth } from '../auth/adminAuthService';

const API_BASE_URL = 'http://127.0.0.1:8000';

export async function fetchAdminsService(search = '') {
  try {
    const url = search 
      ? `${API_BASE_URL}/accounts/admins/?search=${encodeURIComponent(search)}`
      : `${API_BASE_URL}/accounts/admins/`;
    
    const response = await fetchWithAuth(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch admins: ${response.statusText}`);
    }

    const data = await response.json();
    const list = Array.isArray(data) ? data : (data.results || []);
    return list;
  } catch (error) {
    console.error("fetchAdminsService error:", error);
    throw error;
  }
}

export async function createAdminService(payload) {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/accounts/admin/create-user/`, {
      method: 'POST',
      body: JSON.stringify({
        name: payload.name || payload.full_name || payload.fullName,
        email: payload.email,
        password: payload.password,
        confirmPassword: payload.confirmPassword || payload.confirm_password,
        status: payload.status || payload.account_status || 'ACTIVE',
        role: 'ADMIN',
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      let message = 'Failed to create admin account.';
      if (typeof data === 'object' && data !== null) {
        if (data.email) {
          message = Array.isArray(data.email) ? data.email[0] : data.email;
        } else if (data.password) {
          message = Array.isArray(data.password) ? data.password[0] : data.password;
        } else if (data.confirmPassword) {
          message = Array.isArray(data.confirmPassword) ? data.confirmPassword[0] : data.confirmPassword;
        } else if (data.detail) {
          message = data.detail;
        } else if (data.message) {
          message = data.message;
        }
      }
      return { success: false, message, errors: data };
    }

    return { success: true, data };
  } catch {
    return {
      success: false,
      message: 'Network error. Please check server connection.',
    };
  }
}

export async function createCandidateService(payload) {
  console.log("Future Create Candidate POST payload:", payload);
  return { success: true };
}

export async function createEmployerService(payload) {
  console.log("Future Create Employer POST payload:", payload);
  return { success: true };
}

export async function createCategoryService(payload) {
  console.log("Future Create Category POST payload:", payload);
  return { success: true };
}

export async function createLocationService(payload) {
  console.log("Future Create Location POST payload:", payload);
  return { success: true };
}

export async function createSkillService(payload) {
  console.log("Future Create Skill POST payload:", payload);
  return { success: true };
}
