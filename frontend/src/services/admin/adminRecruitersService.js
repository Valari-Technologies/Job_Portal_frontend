import { fetchWithAuth } from '../auth/adminAuthService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export async function getAdminRecruiters(params = {}) {
  try {
    const query = new URLSearchParams();
    query.append('only_admin_created', 'true');
    if (params.search) query.append('search', params.search);
    if (params.status && params.status !== 'all') query.append('status', params.status);

    const url = `${API_BASE_URL}/accounts/employers/?${query.toString()}`;
    const response = await fetchWithAuth(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch recruiters: ${response.statusText}`);
    }

    const data = await response.json();
    const list = Array.isArray(data) ? data : (data.results || []);

    const status_counts = {
      all: list.length,
      pending_activation: list.filter(r => r.status === 'PENDING_ACTIVATION' || r.account_status === 'Pending Activation').length,
      active: list.filter(r => r.status === 'ACTIVE' || r.account_status === 'Active').length,
      inactive: list.filter(r => r.status === 'INACTIVE' || r.account_status === 'Inactive').length,
      suspended: list.filter(r => r.status === 'SUSPENDED' || r.account_status === 'Suspended').length,
    };

    const results = list.map(r => ({
      id: r.id,
      full_name: r.full_name || r.name || r.username,
      company_name: r.company_name || 'N/A',
      company_logo: r.company_logo || r.profile_photo || null,
      profile_photo: r.profile_photo || r.company_logo || null,
      email: r.email,
      phone: r.phone_number || r.company_phone || 'N/A',
      industry: r.industry || r.designation || 'Human Resources',
      designation: r.designation || 'HR Manager',
      account_status: r.status === 'ACTIVE' ? 'Active' : (r.status === 'INACTIVE' ? 'Inactive' : (r.account_status || r.status || 'Active')),
      raw: r
    }));

    return {
      status_counts,
      results,
      pagination: {
        page: 1,
        page_size: results.length || 10,
        total_count: results.length
      }
    };
  } catch (error) {
    console.error("getAdminRecruiters error:", error);
    return {
      status_counts: { all: 0, active: 0, inactive: 0, pending_activation: 0, suspended: 0 },
      results: [],
      pagination: null
    };
  }
}

export async function updateAdminRecruiter(id, payload) {
  try {
    const url = `${API_BASE_URL}/accounts/admin/employers/${id}/`;
    const response = await fetchWithAuth(url, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return { success: false, message: data.detail || data.message || "Failed to update recruiter." };
    }
    return { success: true, employer: data.employer || data };
  } catch (error) {
    console.error("updateAdminRecruiter error:", error);
    return { success: false, message: "Network error occurred while updating recruiter." };
  }
}
