// Future Django integration:
// GET /api/admin/dashboard/
// Return only Employer accounts created by or assigned to the authenticated Admin.
// Super Admin can access platform-wide records through /api/super-admin/... only.

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

export async function getAdminDashboardData() {
  await delay();

  return {
    recruiter_metrics: {
      total_recruiters: 1248,
      pending_activations: 86,
      active_recruiters: 1032,
      suspended_recruiters: 24,
      total_change_percent: '↑ 12% from last month',
      pending_change_percent: '↑ 8% from last month',
      active_change_percent: '↑ 15% from last month',
      suspended_change_percent: '↓ 2% from last month'
    },
    recent_activity: [
      {
        id: 1,
        activity_type: 'Recruiter {name} registered',
        employer_name: 'Alice Smith',
        company_name: 'Bright Solutions',
        created_at: '2 min ago'
      },
      {
        id: 2,
        activity_type: 'Recruiter {name} activated',
        employer_name: 'John Doe',
        company_name: 'Acme Corp',
        created_at: '15 min ago'
      },
      {
        id: 3,
        activity_type: 'Recruiter {name} suspended',
        employer_name: 'Michael Kim',
        company_name: 'NextGen Labs',
        created_at: '1 hr ago'
      },
      {
        id: 4,
        activity_type: 'Recruiter {name} updated company details',
        employer_name: 'Sarah Roy',
        company_name: 'Innovatech',
        created_at: '2 hrs ago'
      },
      {
        id: 5,
        activity_type: 'Activation email resent to {name}',
        employer_name: 'David Lee',
        company_name: 'TechNova',
        created_at: '3 hrs ago'
      }
    ],
    notification_count: 3
  };
}
