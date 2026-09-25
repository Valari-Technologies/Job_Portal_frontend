import { fetchWithAuth } from '../auth/adminAuthService';

const API_BASE_URL = 'http://127.0.0.1:8000';

export async function fetchEmployerProfileService() {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/accounts/employer/profile/`);
    if (!response.ok) {
      throw new Error(`Failed to fetch employer profile: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("fetchEmployerProfileService error:", error);
    return null;
  }
}

export function getRecruiterCompanyProfileData() {
  try {
    const userStr = localStorage.getItem('auth_user');
    const user = userStr ? JSON.parse(userStr) : null;
    return {
      id: user?.id || null,
      company_name: user?.company_name || "",
      company_description: user?.company_description || "",
      company_logo: user?.company_logo || null,
      company_phone: user?.company_phone || user?.phone_number || "",
      company_email: user?.company_email || user?.email || "",
      website: user?.company_website || user?.website || "",
      location: user?.company_address || user?.location || null,
      verification_status: user?.verification_status || "PENDING",
      trust_level: user?.trust_level || "NEW",
      designation: user?.designation || "",
      active_jobs_count: 0,
      recruiting_team: []
    };
  } catch {
    return {
      id: null,
      company_name: "",
      company_description: "",
      company_logo: null,
      company_phone: "",
      company_email: "",
      website: "",
      location: null,
      verification_status: "PENDING",
      trust_level: "NEW",
      designation: "",
      active_jobs_count: 0,
      recruiting_team: []
    };
  }
}

export async function updateCompanyProfileService(payload) {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/accounts/employer/profile/`, {
      method: 'PATCH',
      body: JSON.stringify({
        company_name: payload.company_name,
        company_description: payload.company_description,
        company_phone: payload.company_phone || payload.phone,
        company_email: payload.company_email || payload.email,
        company_website: payload.website || payload.company_website,
        company_address: payload.company_address || [payload.locality, payload.city, payload.district, payload.state].filter(Boolean).join(', '),
        company_logo: payload.company_logo,
        designation: payload.designation,
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return { success: false, message: data.detail || 'Failed to update company profile.', errors: data };
    }

    try {
      const userStr = localStorage.getItem('auth_user');
      const user = userStr ? JSON.parse(userStr) : {};
      const updatedUser = { ...user, ...data };
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    } catch {
      // ignore
    }

    return { success: true, company: data };
  } catch (err) {
    console.error("updateCompanyProfileService error:", err);
    return { success: false, message: "Network error. Please try again." };
  }
}
