import {
  mockUsers,
  mockCandidates,
  mockEmployers,
  mockEmployerVerifications,
  mockJobs,
  mockApplications,
  mockJobReports,
  mockNotifications
} from './superAdminOverviewData';

// Delay helper to simulate network request
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Returns dashboard top metrics based on the current date range.
 * Future API: GET /api/v1/admin/overview/metrics?range={range}
 */
export async function getOverviewMetrics() {
  await delay();
  
  // 1. Total candidates (active users that are candidates)
  // In a real system, count * from candidates join users on candidate.user_id = user.id where user.status = 'ACTIVE'
  const candidateUsers = mockUsers.filter(u => u.role === 'CANDIDATE' && u.status === 'ACTIVE');
  const totalCandidates = candidateUsers.length * 3107.5; // Scale up to make values look like design (e.g. 24,860)
  
  // 2. Active employers (approved employers)
  // In a real system: count * from employers join users on employer.user_id = user.id where employer.status = 'APPROVED' and user.status = 'ACTIVE'
  const approvedEmployers = mockEmployers.filter(e => e.status === 'APPROVED');
  const activeEmployers = approvedEmployers.length * 312; // Scale up to match 1,248
  
  // 3. Live jobs (PUBLISHED or ACTIVE status)
  // In a real system: count * from jobs where status in ('PUBLISHED', 'ACTIVE')
  const liveJobsList = mockJobs.filter(j => j.status === 'PUBLISHED' || j.status === 'ACTIVE');
  const liveJobs = liveJobsList.length * 870.5; // Scale up to match 3,482
  
  // 4. Applications this month (total applications applied_at in current month/range)
  // In a real system: count * from applications where applied_at >= NOW() - INTERVAL '30 days'
  const appCount = mockApplications.length * 4150; // Scale up to match 12,450
  
  // Returns metric data + trends
  return {
    candidates: { value: Math.round(totalCandidates), pctChange: '+8.4%' },
    employers: { value: Math.round(activeEmployers), pctChange: '+5.1%' },
    liveJobs: { value: Math.round(liveJobs), pctChange: '+12.6%' },
    applications: { value: Math.round(appCount), pctChange: '+9.2%' }
  };
}

/**
 * Returns trend series for Applications & New registrations.
 * Future API: GET /api/v1/admin/overview/trends?range={range}
 */
export async function getApplicationsRegistrationTrend(range = '7days') {
  await delay();
  
  // Mock trend data based on range select
  if (range === '30days') {
    return [
      { date: 'Week 1', applications: 5400, candidates: 2100 },
      { date: 'Week 2', applications: 6200, candidates: 2400 },
      { date: 'Week 3', applications: 8900, candidates: 3100 },
      { date: 'Week 4', applications: 12450, candidates: 3860 }
    ];
  } else if (range === '90days') {
    return [
      { date: 'May', applications: 15400, candidates: 5800 },
      { date: 'Jun', applications: 19800, candidates: 7400 },
      { date: 'Jul', applications: 28400, candidates: 10200 },
      { date: 'Aug', applications: 35600, candidates: 12800 }
    ];
  }
  
  // Default: 7 days
  return [
    { date: 'May 5', applications: 1850, candidates: 950 },
    { date: 'May 6', applications: 2120, candidates: 1080 },
    { date: 'May 7', applications: 2320, candidates: 1150 },
    { date: 'May 8', applications: 2580, candidates: 1220 },
    { date: 'May 9', applications: 2410, candidates: 1180 },
    { date: 'May 10', applications: 2730, candidates: 1310 },
    { date: 'May 11', applications: 2840, candidates: 1360 }
  ];
}

/**
 * Returns queue counts and records for the "Action Required" panel.
 * Future API: GET /api/v1/admin/overview/queues
 */
export async function getActionQueues() {
  await delay();
  
  // 1. Employer verifications pending (employer_verifications.verification_status = 'PENDING')
  const verifications = mockEmployerVerifications.map(v => {
    const emp = mockEmployers.find(e => e.id === v.employer_id) || {};
    return {
      id: v.id,
      title: emp.company_name || 'Unknown Company',
      subtitle: `Industry: ${emp.industry || 'N/A'} • Location: ${emp.location || 'N/A'}`,
      badge: 'PENDING_VERIFICATION',
      date: new Date(v.pending_since).toLocaleDateString(),
      details: { ...v, company_name: emp.company_name, industry: emp.industry, location: emp.location }
    };
  });

  // 2. Jobs pending review (jobs.status = 'PENDING_REVIEW')
  const pendingJobs = mockJobs.filter(j => j.status === 'PENDING_REVIEW').map(j => {
    const emp = mockEmployers.find(e => e.id === j.employer_id) || {};
    return {
      id: j.id,
      title: j.title,
      subtitle: `Employer: ${emp.company_name || 'N/A'} • Salary Range: ₹${j.salary_min} - ₹${j.salary_max}`,
      badge: 'PENDING_REVIEW',
      date: new Date(j.created_at).toLocaleDateString(),
      details: { ...j, company_name: emp.company_name }
    };
  });

  // 3. Reported jobs (job_reports.status = 'OPEN')
  const reportedJobs = mockJobReports.filter(r => r.status === 'OPEN').map(r => {
    const job = mockJobs.find(j => j.id === r.job_id) || {};
    const emp = mockEmployers.find(e => e.id === job.employer_id) || {};
    return {
      id: r.id,
      title: `Reported: ${job.title || 'Unknown Job'}`,
      subtitle: `Reason: ${r.reason} • Employer: ${emp.company_name || 'N/A'}`,
      badge: 'REPORTED',
      date: new Date(r.reported_at).toLocaleDateString(),
      details: { ...r, job_title: job.title, company_name: emp.company_name }
    };
  });

  // 4. Low-quality profiles (candidates.profile_completion < 60)
  const lowQualityProfiles = mockCandidates.filter(c => c.profile_completion < 60).map(c => {
    return {
      id: c.id,
      title: c.full_name,
      subtitle: `Profile completion: ${c.profile_completion}% • Locations: ${c.preferred_locations.join(', ')}`,
      badge: 'LOW_QUALITY',
      date: 'N/A',
      details: c
    };
  });

  return {
    employerVerifications: { count: 18, list: verifications },
    jobsPendingReview: { count: 24, list: pendingJobs },
    reportedJobs: { count: 6, list: reportedJobs },
    lowQualityProfiles: { count: 12, list: lowQualityProfiles }
  };
}

/**
 * Returns breakdown counts for Job statuses.
 * Future API: GET /api/v1/admin/overview/job-activity
 */
export async function getJobActivity() {
  await delay();
  
  // Total scaled counts aligned to Image 1
  return {
    live: 3482,           // PUBLISHED or ACTIVE status
    pendingReview: 24,   // PENDING_REVIEW status
    draft: 189,          // DRAFT status
    closed: 312,         // CLOSED or EXPIRED status
    total: 4007
  };
}

/**
 * Returns live job counts grouped by district.
 * Future API: GET /api/v1/admin/overview/districts
 */
export async function getHiringDistricts() {
  await delay();
  
  return [
    { district: 'Chennai', count: 1086, share: '31.2%' },
    { district: 'Coimbatore', count: 562, share: '16.1%' },
    { district: 'Madurai', count: 438, share: '12.6%' },
    { district: 'Tiruchirappalli', count: 296, share: '8.5%' },
    { district: 'Others', count: 1100, share: '31.6%' }
  ];
}

/**
 * Returns recent activity stream entries.
 * Future API: GET /api/v1/admin/overview/activity
 */
export async function getRecentActivity() {
  await delay();
  
  return [
    {
      id: 'act_1',
      type: 'VERIFICATION_SUBMITTED',
      message: 'Employer Coral Systems Pvt Ltd submitted for verification',
      time: 'Today, 10:30 AM',
      details: { company: 'Coral Systems Pvt Ltd', industry: 'Information Technology', submitted_at: '10:30 AM' }
    },
    {
      id: 'act_2',
      type: 'JOB_APPROVED',
      message: 'Job "Store Supervisor" at Reliance Retail approved',
      time: 'Today, 9:45 AM',
      details: { job_title: 'Store Supervisor', company: 'Reliance Retail', approved_by: 'Super Admin' }
    },
    {
      id: 'act_3',
      type: 'PROFILE_COMPLETED',
      message: 'Priya S completed profile',
      time: 'Today, 9:20 AM',
      details: { name: 'Priya S', completion: '100%', skills: 'React, Node.js' }
    },
    {
      id: 'act_4',
      type: 'JOB_REPORTED',
      message: 'Job "Marketing Intern" reported by a user',
      time: 'Today, 8:50 AM',
      details: { job_title: 'Marketing Intern', reporter: 'Vijay Chandran', reason: 'Misleading description' }
    },
    {
      id: 'act_5',
      type: 'LOCALITY_CREATED',
      message: 'New locality "Oragadam" added in Chennai District',
      time: 'Today, 8:15 AM',
      details: { locality: 'Oragadam', city: 'Kanchipuram/Chennai', state: 'Tamil Nadu' }
    }
  ];
}
export async function getNotifications() {
  await delay();
  return mockNotifications;
}
