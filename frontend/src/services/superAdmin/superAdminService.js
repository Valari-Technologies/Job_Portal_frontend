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
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/accounts/admin/create-user/`, {
      method: 'POST',
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
        confirm_password: payload.confirmPassword || payload.confirm_password,
        full_name: payload.full_name || payload.fullName,
        phone_number: payload.mobile_number || payload.phone_number,
        role: 'CANDIDATE',
        status: payload.status || 'ACTIVE',
        date_of_birth: payload.dob || payload.date_of_birth,
        gender: payload.gender,
        location_id: payload.location_id,
        expected_salary_min: payload.salary_min !== undefined ? payload.salary_min : payload.expected_salary_min,
        expected_salary_max: payload.salary_max !== undefined ? payload.salary_max : payload.expected_salary_max,
        preferred_job_type: payload.job_type || payload.preferred_job_type,
        preferred_work_mode_id: payload.work_mode_id || payload.preferred_work_mode_id,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      let message = 'Failed to create candidate account.';
      if (typeof data === 'object' && data !== null) {
        if (data.email) {
          message = Array.isArray(data.email) ? data.email[0] : data.email;
        } else if (data.password) {
          message = Array.isArray(data.password) ? data.password[0] : data.password;
        } else if (data.confirmPassword || data.confirm_password) {
          const field = data.confirmPassword || data.confirm_password;
          message = Array.isArray(field) ? field[0] : field;
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

export async function fetchCandidatesService(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.state && params.state !== 'All') query.append('state', params.state);
    if (params.district && params.district !== 'All') query.append('district', params.district);
    if (params.status && params.status !== 'All') query.append('status', params.status);

    const url = `${API_BASE_URL}/accounts/candidates/?${query.toString()}`;
    const response = await fetchWithAuth(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch candidates: ${response.statusText}`);
    }

    const data = await response.json();
    const list = Array.isArray(data) ? data : (data.results || []);
    return list;
  } catch (error) {
    console.error("fetchCandidatesService error:", error);
    return [];
  }
}

export async function fetchEmployersService(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.state && params.state !== 'All') query.append('state', params.state);
    if (params.district && params.district !== 'All') query.append('district', params.district);
    if (params.status && params.status !== 'All') query.append('status', params.status);
    if (params.verification_status && params.verification_status !== 'All') query.append('verification_status', params.verification_status);

    const url = `${API_BASE_URL}/accounts/employers/?${query.toString()}`;
    const response = await fetchWithAuth(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch employers: ${response.statusText}`);
    }

    const data = await response.json();
    const list = Array.isArray(data) ? data : (data.results || []);
    return list;
  } catch (error) {
    console.error("fetchEmployersService error:", error);
    return [];
  }
}

export async function createEmployerService(payload) {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/accounts/admin/create-user/`, {
      method: 'POST',
      body: JSON.stringify({
        email: payload.account_email || payload.email,
        password: payload.password,
        confirm_password: payload.confirmPassword || payload.confirm_password,
        full_name: payload.primary_contact_name || payload.full_name || payload.fullName,
        role: 'HR',
        status: payload.status || 'ACTIVE',
        company_name: payload.company_name,
        company_email: payload.company_email,
        company_phone: payload.company_phone,
        company_website: payload.website || payload.company_website,
        company_address: payload.company_address || [payload.locality, payload.city, payload.district, payload.state].filter(Boolean).join(', '),
        company_description: payload.company_description,
        company_logo: payload.company_logo || payload.profile_photo || payload.profilePhoto,
        profile_photo: payload.profile_photo || payload.company_logo || payload.profilePhoto,
        location_id: payload.location_id,
        designation: payload.designation,
        phone_number: payload.mobile_number || payload.phone_number,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      let message = 'Failed to create employer account.';
      if (typeof data === 'object' && data !== null) {
        if (data.email) {
          message = Array.isArray(data.email) ? data.email[0] : data.email;
        } else if (data.password) {
          message = Array.isArray(data.password) ? data.password[0] : data.password;
        } else if (data.confirmPassword || data.confirm_password) {
          const field = data.confirmPassword || data.confirm_password;
          message = Array.isArray(field) ? field[0] : field;
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

import { createCategory, createSkill } from './categorySkillService';

export async function createCategoryService(payload) {
  return await createCategory(payload);
}

export async function createLocationService(payload) {
  console.log("Future Create Location POST payload:", payload);
  return { success: true };
}

export async function createSkillService(payload) {
  return await createSkill(payload);
}
