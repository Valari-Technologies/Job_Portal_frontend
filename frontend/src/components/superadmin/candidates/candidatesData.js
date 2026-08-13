const DEFAULT_CANDIDATES = [
  {
    id: 'CAND-1001',
    name: 'Rahul Kumar',
    email: 'rahul@gmail.com',
    phone: '9876543210',
    location: 'Bangalore',
    experience: '5 Yrs',
    skills: 'React, Node, AWS',
    applicationsCount: 3,
    status: 'Active',
    registeredDate: 'May 20, 2025',
    appliedJob: 'Senior Full Stack Developer',
    organization: 'TechNova Inc.',
    department: 'Engineering',
    appliedDate: 'May 28, 2025',
    currentStage: 'Under Review',
    assignedHR: 'John Doe',
    timelineNotes: [
      {
        date: 'May 29, 2025',
        text: 'Profile looks good. Moving to next round.',
        author: 'John Doe'
      }
    ]
  },
  {
    id: 'CAND-1002',
    name: 'Priya Singh',
    email: 'priya@gmail.com',
    phone: '8765432109',
    location: 'Mumbai',
    experience: '3 Yrs',
    skills: 'UI/UX, Figma, Adobe XD',
    applicationsCount: 2,
    status: 'Active',
    registeredDate: 'May 19, 2025',
    appliedJob: 'Product UI/UX Designer',
    organization: 'Innovate Labs',
    department: 'Design',
    appliedDate: 'May 27, 2025',
    currentStage: 'Applied',
    assignedHR: 'Priya Sharma',
    timelineNotes: [
      {
        date: 'May 27, 2025',
        text: 'Resume matches description. Initial review pending.',
        author: 'Priya Sharma'
      }
    ]
  },
  {
    id: 'CAND-1003',
    name: 'Amit Verma',
    email: 'amit@gmail.com',
    phone: '7654321098',
    location: 'Delhi',
    experience: '4 Yrs',
    skills: 'Python, SQL, Power BI',
    applicationsCount: 1,
    status: 'Active',
    registeredDate: 'May 18, 2025',
    appliedJob: 'Data Analyst',
    organization: 'SoftBuild Corp.',
    department: 'Analytics',
    appliedDate: 'May 26, 2025',
    currentStage: 'Shortlist',
    assignedHR: 'Vikram Singh',
    timelineNotes: [
      {
        date: 'May 26, 2025',
        text: 'Strong SQL scores. Shortlisted for assessment.',
        author: 'Vikram Singh'
      }
    ]
  },
  {
    id: 'CAND-1004',
    name: 'Sneha Iyer',
    email: 'sneha@gmail.com',
    phone: '6543210987',
    location: 'Chennai',
    experience: '2 Yrs',
    skills: 'Java, Spring Boot',
    applicationsCount: 2,
    status: 'Inactive',
    registeredDate: 'May 17, 2025',
    appliedJob: 'Backend Developer',
    organization: 'TechNova Inc.',
    department: 'Engineering',
    appliedDate: 'May 25, 2025',
    currentStage: 'Interview',
    assignedHR: 'Rajesh Kumar',
    timelineNotes: [
      {
        date: 'May 25, 2025',
        text: 'Interview scheduled.',
        author: 'Rajesh Kumar'
      }
    ]
  },
  {
    id: 'CAND-1005',
    name: 'Vikram Reddy',
    email: 'vikram@gmail.com',
    phone: '5432109876',
    location: 'Hyderabad',
    experience: '6 Yrs',
    skills: 'AWS, Docker, Terraform',
    applicationsCount: 3,
    status: 'Active',
    registeredDate: 'May 16, 2025',
    appliedJob: 'DevOps Engineer',
    organization: 'DataX Systems',
    department: 'Engineering',
    appliedDate: 'May 24, 2025',
    currentStage: 'Applied',
    assignedHR: 'Amit Patel',
    timelineNotes: [
      {
        date: 'May 24, 2025',
        text: 'Applied via referral.',
        author: 'Amit Patel'
      }
    ]
  }
];

export const getCandidates = () => {
  const data = localStorage.getItem('sa_candidates');
  if (!data) {
    localStorage.setItem('sa_candidates', JSON.stringify(DEFAULT_CANDIDATES));
    return DEFAULT_CANDIDATES;
  }
  return JSON.parse(data);
};

export const saveCandidates = (candidates) => {
  localStorage.setItem('sa_candidates', JSON.stringify(candidates));
};
