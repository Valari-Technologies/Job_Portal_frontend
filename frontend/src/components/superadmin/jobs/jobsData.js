const DEFAULT_JOBS = [
  {
    id: 'JOB-1001',
    title: 'Senior Full Stack Developer',
    organization: 'TechNova Inc.',
    department: 'Engineering',
    location: 'Bangalore',
    postedBy: 'John Doe',
    postedDate: 'May 20, 2025',
    closingDate: 'Jun 20, 2025',
    applicationsCount: 45,
    status: 'Active',
    description: 'Lead software engineering efforts building React, Node.js, and cloud native services.'
  },
  {
    id: 'JOB-1002',
    title: 'Product Manager',
    organization: 'Innovate Labs',
    department: 'Product',
    location: 'Mumbai',
    postedBy: 'Sarah Wilson',
    postedDate: 'May 18, 2025',
    closingDate: 'Jun 15, 2025',
    applicationsCount: 32,
    status: 'Active',
    description: 'Own the lifecycle of our core artificial intelligence products and services.'
  },
  {
    id: 'JOB-1003',
    title: 'Data Analyst',
    organization: 'SoftBuild Corp.',
    department: 'Analytics',
    location: 'Delhi',
    postedBy: 'Mike Brown',
    postedDate: 'May 17, 2025',
    closingDate: 'Jun 10, 2025',
    applicationsCount: 28,
    status: 'Active',
    description: 'Transform large raw datasets into actionable dashboard metrics and reports.'
  },
  {
    id: 'JOB-1004',
    title: 'DevOps Engineer',
    organization: 'DataX Systems',
    department: 'Engineering',
    location: 'Hyderabad',
    postedBy: 'Emily Davis',
    postedDate: 'May 16, 2025',
    closingDate: 'Jun 12, 2025',
    applicationsCount: 21,
    status: 'Draft',
    description: 'Architect secure, scalable continuous deployment pipelines on AWS.'
  },
  {
    id: 'JOB-1005',
    title: 'UI/UX Designer',
    organization: 'Prime Solutions',
    department: 'Design',
    location: 'Chennai',
    postedBy: 'James Lee',
    postedDate: 'May 15, 2025',
    closingDate: 'Jun 08, 2025',
    applicationsCount: 18,
    status: 'Pending Approval',
    description: 'Collaborate with product and engineering to build clean, gorgeous product prototypes.'
  },
  {
    id: 'JOB-1006',
    title: 'Data Analyst',
    organization: 'SoftBuild Corp.',
    department: 'Analytics',
    location: 'Delhi',
    postedBy: 'Mike Brown',
    postedDate: 'May 17, 2025',
    closingDate: 'Jun 10, 2025',
    applicationsCount: 28,
    status: 'Active',
    description: 'Transform large raw datasets into actionable dashboard metrics and reports.'
  },
  {
    id: 'JOB-1007',
    title: 'DevOps Engineer',
    organization: 'DataX Systems',
    department: 'Engineering',
    location: 'Hyderabad',
    postedBy: 'Emily Davis',
    postedDate: 'May 16, 2025',
    closingDate: 'Jun 12, 2025',
    applicationsCount: 21,
    status: 'Draft',
    description: 'Architect secure, scalable continuous deployment pipelines on AWS.'
  },
  {
    id: 'JOB-1008',
    title: 'Product Manager',
    organization: 'Innovate Labs',
    department: 'Product',
    location: 'Mumbai',
    postedBy: 'Sarah Wilson',
    postedDate: 'May 18, 2025',
    closingDate: 'Jun 15, 2025',
    applicationsCount: 32,
    status: 'Active',
    description: 'Own the lifecycle of our core artificial intelligence products and services.'
  }
];

export const getJobs = () => {
  const data = localStorage.getItem('sa_jobs');
  if (!data) {
    localStorage.setItem('sa_jobs', JSON.stringify(DEFAULT_JOBS));
    return DEFAULT_JOBS;
  }
  return JSON.parse(data);
};

export const saveJobs = (jobs) => {
  localStorage.setItem('sa_jobs', JSON.stringify(jobs));
};
