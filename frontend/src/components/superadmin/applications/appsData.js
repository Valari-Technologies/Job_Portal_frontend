const DEFAULT_APPLICATIONS = [
  {
    id: 'APP-10001',
    candidate: 'Rahul Kumar',
    job: 'Sr. Full Stack Dev',
    organization: 'TechNova Inc.',
    appliedDate: 'May 28, 2025',
    currentStage: 'Under Review',
    status: 'Active',
    hrRecruiter: 'John Doe'
  },
  {
    id: 'APP-10002',
    candidate: 'Priya Singh',
    job: 'Product Manager',
    organization: 'Innovate Labs',
    appliedDate: 'May 27, 2025',
    currentStage: 'Shortlisted',
    status: 'Active',
    hrRecruiter: 'Sarah Wilson'
  },
  {
    id: 'APP-10003',
    candidate: 'Amit Verma',
    job: 'Data Analyst',
    organization: 'SoftBuild Corp.',
    appliedDate: 'May 26, 2025',
    currentStage: 'Interview',
    status: 'Active',
    hrRecruiter: 'Mike Brown'
  },
  {
    id: 'APP-10004',
    candidate: 'Sneha Iyer',
    job: 'UI/UX Designer',
    organization: 'Prime Solutions',
    appliedDate: 'May 25, 2025',
    currentStage: 'Assessment',
    status: 'Active',
    hrRecruiter: 'James Lee'
  },
  {
    id: 'APP-10005',
    candidate: 'Vikram Reddy',
    job: 'DevOps Engineer',
    organization: 'DataX Systems',
    appliedDate: 'May 24, 2025',
    currentStage: 'New',
    status: 'Active',
    hrRecruiter: 'Emily Davis'
  },
  {
    id: 'APP-10006',
    candidate: 'Rahul Kumar',
    job: 'Sr. Full Stack Dev',
    organization: 'TechNova Inc.',
    appliedDate: 'May 28, 2025',
    currentStage: 'Under Review',
    status: 'Active',
    hrRecruiter: 'John Doe'
  },
  {
    id: 'APP-10007',
    candidate: 'Priya Singh',
    job: 'Product Manager',
    organization: 'Innovate Labs',
    appliedDate: 'May 27, 2025',
    currentStage: 'Shortlisted',
    status: 'Active',
    hrRecruiter: 'Sarah Wilson'
  },
  {
    id: 'APP-10008',
    candidate: 'Amit Verma',
    job: 'Data Analyst',
    organization: 'SoftBuild Corp.',
    appliedDate: 'May 26, 2025',
    currentStage: 'Interview',
    status: 'Active',
    hrRecruiter: 'Mike Brown'
  },
  {
    id: 'APP-10009',
    candidate: 'Sneha Iyer',
    job: 'UI/UX Designer',
    organization: 'Prime Solutions',
    appliedDate: 'May 25, 2025',
    currentStage: 'Assessment',
    status: 'Active',
    hrRecruiter: 'James Lee'
  },
  {
    id: 'APP-10010',
    candidate: 'Vikram Reddy',
    job: 'DevOps Engineer',
    organization: 'DataX Systems',
    appliedDate: 'May 24, 2025',
    currentStage: 'New',
    status: 'Active',
    hrRecruiter: 'Emily Davis'
  }
];

export const getApplications = () => {
  const data = localStorage.getItem('sa_applications');
  if (!data) {
    localStorage.setItem('sa_applications', JSON.stringify(DEFAULT_APPLICATIONS));
    return DEFAULT_APPLICATIONS;
  }
  return JSON.parse(data);
};

export const saveApplications = (apps) => {
  localStorage.setItem('sa_applications', JSON.stringify(apps));
};
