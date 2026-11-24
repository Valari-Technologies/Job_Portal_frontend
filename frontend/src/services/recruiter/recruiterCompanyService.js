import { fetchWithAuth, getAuthenticatedUser, setAuthenticatedUser } from '../auth/adminAuthService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export async function fetchEmployerProfileService() {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/accounts/employer/profile/`);
    if (!response.ok) {
      throw new Error(`Failed to fetch employer profile: ${response.statusText}`);
    }
    const data = await response.json();
    try {
      const user = getAuthenticatedUser() || {};
      const updatedUser = { ...user, ...data };
      setAuthenticatedUser(updatedUser, 'HR');
    } catch {
      // ignore
    }
    return data;
  } catch (error) {
    console.error("fetchEmployerProfileService error:", error);
    return null;
  }
}

export function getRecruiterCompanyProfileData(dataFromApi = null) {
  try {
    const user = getAuthenticatedUser();
    const data = dataFromApi || user || {};

    const loc = data.location;
    let locationStr = data.company_address || null;
    if (!locationStr && loc) {
      if (typeof loc === 'string') locationStr = loc;
      else if (typeof loc === 'object') locationStr = loc.full_path || [loc.name, loc.district, loc.state].filter(Boolean).join(', ');
    }

    return {
      id: data.id || data.user_id || null,
      company_name: data.company_name || "",
      company_description: data.company_description || "",
      company_logo: data.company_logo || data.logo || null,
      company_phone: data.company_phone || data.phone_number || "",
      company_email: data.company_email || data.email || "",
      website: data.company_website || data.website || "",
      company_website: data.company_website || data.website || "",
      location: locationStr,
      company_address: locationStr,
      verification_status: data.verification_status || "PENDING",
      trust_level: data.trust_level || "NEW",
      designation: data.designation || "",
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
      company_website: "",
      location: null,
      company_address: null,
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
      const user = getAuthenticatedUser() || {};
      const updatedUser = { ...user, ...data, ...(payload.company_logo ? { company_logo: payload.company_logo } : {}) };
      setAuthenticatedUser(updatedUser, 'HR');
      
      if (payload.company_logo) {
        const storedJobs = localStorage.getItem('tnjobz_recruiter_jobs');
        if (storedJobs) {
          const jobs = JSON.parse(storedJobs);
          const updatedJobs = jobs.map(j => ({
            ...j,
            company_logo: payload.company_logo,
            employer: {
              ...(j.employer || {}),
              company_logo: payload.company_logo,
              profile_photo: payload.company_logo
            }
          }));
          localStorage.setItem('tnjobz_recruiter_jobs', JSON.stringify(updatedJobs));
        }
      }
    } catch {
      // ignore
    }

    return { success: true, company: data };
  } catch (err) {
    console.error("updateCompanyProfileService error:", err);
    return { success: false, message: "Network error. Please try again." };
  }
}
