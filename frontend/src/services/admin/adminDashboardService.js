import { fetchWithAuth } from '../auth/adminAuthService';
import { getAdminRecruiters } from './adminRecruitersService';

const API_BASE_URL = 'http://127.0.0.1:8000';

export async function getAdminDashboardData() {
  // 1. Fetch live metrics from dedicated backend admin dashboard endpoint
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/accounts/admin/dashboard/`);
    if (response.ok) {
      const data = await response.json();
      if (data && data.recruiter_metrics) {
        return data;
      }
    }
  } catch (err) {
    console.warn("Backend admin dashboard API call failed, falling back to live recruiters aggregation:", err);
  }

  // 2. Seamless live aggregation fallback from real recruiters
  try {
    const recruitersRes = await getAdminRecruiters();
    const list = recruitersRes?.results || [];
    const counts = recruitersRes?.status_counts || {};

    const total = counts.all ?? list.length;
    const active = counts.active ?? list.filter(r => r.account_status === 'Active').length;
    const pending = counts.pending_activation ?? list.filter(r => r.account_status === 'Pending Activation' || r.account_status === 'Pending').length;
    const suspended = counts.suspended ?? list.filter(r => r.account_status === 'Suspended').length;

    // Build real recent activity from the actual recruiters created by Admin
    const liveActivity = list.slice(0, 5).map((r, idx) => ({
      id: r.id || idx,
      activity_type: r.account_status === 'Active' ? 'Recruiter {name} created by Admin' : 'Recruiter {name} created (Pending Activation)',
      employer_name: r.full_name || r.email || 'Recruiter',
      company_name: r.company_name && r.company_name !== 'N/A' ? r.company_name : 'Company not specified',
      created_at: 'Recently'
    }));

    return {
      recruiter_metrics: {
        total_recruiters: total,
        pending_activations: pending,
        active_recruiters: active,
        suspended_recruiters: suspended,
        total_change_percent: total > 0 ? '↑ Live data' : '0% from last month',
        pending_change_percent: pending > 0 ? 'Live pending' : '0% from last month',
        active_change_percent: active > 0 ? 'Live active' : '0% from last month',
        suspended_change_percent: suspended > 0 ? 'Live count' : '0% from last month'
      },
      recent_activity: liveActivity,
      notification_count: 0
    };
  } catch (err) {
    console.error("Failed to aggregate live admin dashboard data:", err);
    return {
      recruiter_metrics: {
        total_recruiters: 0,
        pending_activations: 0,
        active_recruiters: 0,
        suspended_recruiters: 0,
        total_change_percent: '0%',
        pending_change_percent: '0%',
        active_change_percent: '0%',
        suspended_change_percent: '0%'
      },
      recent_activity: [],
      notification_count: 0
    };
  }
}
