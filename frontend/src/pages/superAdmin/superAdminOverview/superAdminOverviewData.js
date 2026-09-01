// Src/data/admin/overviewMockData.js

// Users table concept
export const mockUsers = [
  { id: 'usr_1', email: 'candidate1@gmail.com', phone: '9876543210', role: 'CANDIDATE', status: 'ACTIVE', created_at: '2026-08-10T10:00:00Z' },
  { id: 'usr_2', email: 'hr@coralsystems.com', phone: '9876543211', role: 'EMPLOYER', status: 'ACTIVE', created_at: '2026-08-11T11:00:00Z' },
  { id: 'usr_3', email: 'candidate2@gmail.com', phone: '9876543212', role: 'CANDIDATE', status: 'ACTIVE', created_at: '2026-08-12T09:00:00Z' },
  { id: 'usr_4', email: 'recruiter@reliance.com', phone: '9876543213', role: 'EMPLOYER', status: 'ACTIVE', created_at: '2026-08-13T14:00:00Z' },
  { id: 'usr_5', email: 'candidate3@gmail.com', phone: '9876543214', role: 'CANDIDATE', status: 'ACTIVE', created_at: '2026-08-14T10:30:00Z' },
  { id: 'usr_6', email: 'hiring@tata.com', phone: '9876543215', role: 'EMPLOYER', status: 'PENDING_VERIFICATION', created_at: '2026-08-15T12:00:00Z' },
  { id: 'usr_7', email: 'spam_employer@gmail.com', phone: '9876543216', role: 'EMPLOYER', status: 'ACTIVE', created_at: '2026-08-16T15:00:00Z' },
  { id: 'usr_8', email: 'candidate4@gmail.com', phone: '9876543217', role: 'CANDIDATE', status: 'ACTIVE', created_at: '2026-08-17T08:00:00Z' },
];

// Candidates table concept
export const mockCandidates = [
  { id: 'cand_1', user_id: 'usr_1', full_name: 'Priya S', profile_completion: 100, preferred_locations: ['Chennai', 'Coimbatore'], skills: ['React', 'Node.js'], resume_url: '/resumes/priya_s.pdf' },
  { id: 'cand_2', user_id: 'usr_3', full_name: 'Ramesh Kumar', profile_completion: 45, preferred_locations: ['Madurai'], skills: ['Java', 'SQL'], resume_url: null },
  { id: 'cand_3', user_id: 'usr_5', full_name: 'Vijay Chandran', profile_completion: 85, preferred_locations: ['Chennai'], skills: ['HTML', 'CSS', 'JavaScript'], resume_url: '/resumes/vijay_c.pdf' },
  { id: 'cand_4', user_id: 'usr_8', full_name: 'Anjali Devi', profile_completion: 55, preferred_locations: ['Tiruchirappalli'], skills: ['Python', 'Django'], resume_url: null },
];

// Employers table concept
export const mockEmployers = [
  { id: 'emp_1', user_id: 'usr_2', company_name: 'Coral Systems Pvt Ltd', industry: 'Information Technology', location: 'Chennai', status: 'APPROVED' },
  { id: 'emp_2', user_id: 'usr_4', company_name: 'Reliance Retail', industry: 'Retail', location: 'Coimbatore', status: 'APPROVED' },
  { id: 'emp_3', user_id: 'usr_6', company_name: 'Tata Consultancy Services', industry: 'IT Services', location: 'Chennai', status: 'PENDING' },
  { id: 'emp_4', user_id: 'usr_7', company_name: 'Zenith Tech Solutions', industry: 'Staffing', location: 'Madurai', status: 'APPROVED' },
];

// Employer verifications table concept
export const mockEmployerVerifications = [
  { id: 'ver_1', employer_id: 'emp_3', verification_status: 'PENDING', document_url: '/docs/tcs_incorporation.pdf', pending_since: '2026-08-15T12:00:00Z' },
];

// Jobs table concept
export const mockJobs = [
  { id: 'job_1', employer_id: 'emp_1', title: 'React Frontend Architect', status: 'PUBLISHED', salary_min: 80000, salary_max: 120000, district: 'Chennai', city: 'Chennai', locality: 'Adyar', created_at: '2026-08-10T10:00:00Z' },
  { id: 'job_2', employer_id: 'emp_2', title: 'Store Supervisor', status: 'PUBLISHED', salary_min: 25000, salary_max: 35000, district: 'Coimbatore', city: 'Coimbatore', locality: 'Gandhipuram', created_at: '2026-08-11T12:00:00Z' },
  { id: 'job_3', employer_id: 'emp_1', title: 'Node.js Developer', status: 'PENDING_REVIEW', salary_min: 50000, salary_max: 80000, district: 'Chennai', city: 'Chennai', locality: 'OMR', created_at: '2026-08-14T09:00:00Z' },
  { id: 'job_4', employer_id: 'emp_4', title: 'Marketing Intern', status: 'PUBLISHED', salary_min: 10000, salary_max: 15000, district: 'Madurai', city: 'Madurai', locality: 'Anna Nagar', created_at: '2026-08-15T11:00:00Z' },
  { id: 'job_5', employer_id: 'emp_2', title: 'Python Backend Engineer', status: 'DRAFT', salary_min: 60000, salary_max: 95000, district: 'Coimbatore', city: 'Coimbatore', locality: 'Peelamedu', created_at: '2026-08-16T10:00:00Z' },
  { id: 'job_6', employer_id: 'emp_1', title: 'Java Team Lead', status: 'CLOSED', salary_min: 120000, salary_max: 180000, district: 'Chennai', city: 'Chennai', locality: 'T-Nagar', created_at: '2026-08-01T10:00:00Z' },
  { id: 'job_7', employer_id: 'emp_4', title: 'SQL Database Administrator', status: 'PENDING_REVIEW', salary_min: 45000, salary_max: 70000, district: 'Madurai', city: 'Madurai', locality: 'Goripalayam', created_at: '2026-08-18T14:30:00Z' },
  { id: 'job_8', employer_id: 'emp_2', title: 'Delivery Associate', status: 'EXPIRED', salary_min: 15000, salary_max: 20000, district: 'Tiruchirappalli', city: 'Trichy', locality: 'Cantonment', created_at: '2026-07-15T10:00:00Z' },
];

// Applications table concept
export const mockApplications = [
  { id: 'app_1', job_id: 'job_1', candidate_id: 'cand_1', status: 'APPLIED', applied_at: '2026-08-12T10:30:00Z' },
  { id: 'app_2', job_id: 'job_2', candidate_id: 'cand_3', status: 'SHORTLISTED', applied_at: '2026-08-13T11:00:00Z' },
  { id: 'app_3', job_id: 'job_4', candidate_id: 'cand_1', status: 'REJECTED', applied_at: '2026-08-16T09:00:00Z' },
];

// Job reports table concept
export const mockJobReports = [
  { id: 'rep_1', job_id: 'job_4', reporter_id: 'cand_3', reason: 'Misleading description and potential scam info.', status: 'OPEN', reported_at: '2026-08-17T15:20:00Z' },
];

// Candidate activity table concept
export const mockCandidateActivity = [
  { id: 'act_1', candidate_id: 'cand_1', activity_type: 'PROFILE_COMPLETED', details: 'Priya S completed profile to 100%', created_at: '2026-08-12T09:20:00Z' },
];

// System notifications mock data
export const mockNotifications = [
  { id: 'n_1', title: 'New verification request', message: 'Tata Consultancy Services submitted verification files.', time: '2 mins ago', read: false },
  { id: 'n_2', title: 'Spam alert', message: 'Marketing Intern job post flagged multiple times by jobseekers.', time: '1 hour ago', read: false },
  { id: 'n_3', title: 'Database load warning', message: 'Read queries exceeded normal thresholds at 04:30 AM.', time: '10 hours ago', read: true }
];
