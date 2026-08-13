const DEFAULT_ORGANIZATIONS = [
  {
    id: 'ORG-1001',
    name: 'TechNova Inc.',
    logo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=100',
    industry: 'Technology',
    companySize: '51-200 employees',
    status: 'Active',
    email: 'info@technova.com',
    phone: '+91 80-1234567',
    website: 'https://technova.com',
    location: 'Bangalore, India',
    description: 'TechNova is a leading technology solutions provider specializing in software development.',
    dateCreated: '2023-01-15',
    hrManager: 'Rajesh Kumar',
    hrCount: 25,
    candidateCount: 3456,
    jobsCount: 18
  },
  {
    id: 'ORG-1002',
    name: 'Innovate Labs',
    logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100',
    industry: 'AI Research',
    companySize: '11-50 employees',
    status: 'Active',
    email: 'contact@innovatelabs.com',
    phone: '+91 22-9876543',
    website: 'https://innovatelabs.com',
    location: 'Mumbai, India',
    description: 'Innovate Labs researches and builds next-generation AI products.',
    dateCreated: '2023-03-22',
    hrManager: 'Priya Sharma',
    hrCount: 18,
    candidateCount: 2325,
    jobsCount: 12
  },
  {
    id: 'ORG-1003',
    name: 'SoftBuild Corp.',
    logo: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=100',
    industry: 'Software Development',
    companySize: '11-50 employees',
    status: 'Active',
    email: 'hr@softbuild.com',
    phone: '+91 11-4567890',
    website: 'https://softbuild.com',
    location: 'Delhi, India',
    description: 'SoftBuild Corp specializes in web and cloud application construction.',
    dateCreated: '2023-06-10',
    hrManager: 'Vikram Singh',
    hrCount: 12,
    candidateCount: 1856,
    jobsCount: 9
  },
  {
    id: 'ORG-1004',
    name: 'DataX Systems',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100',
    industry: 'Big Data',
    companySize: '51-200 employees',
    status: 'Active',
    email: 'recruitment@datax.com',
    phone: '+91 40-5551212',
    website: 'https://datax.com',
    location: 'Hyderabad, India',
    description: 'DataX Systems provides premium big data analytics and warehousing.',
    dateCreated: '2023-08-04',
    hrManager: 'Amit Patel',
    hrCount: 15,
    candidateCount: 2145,
    jobsCount: 14
  },
  {
    id: 'ORG-1005',
    name: 'Prime Solutions',
    logo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100',
    industry: 'Consulting',
    companySize: '11-50 employees',
    status: 'Inactive',
    email: 'support@primesolutions.com',
    phone: '+91 44-7778888',
    website: 'https://primesolutions.com',
    location: 'Chennai, India',
    description: 'Prime Solutions offers custom corporate consulting and management services.',
    dateCreated: '2023-09-12',
    hrManager: 'Suresh Raina',
    hrCount: 10,
    candidateCount: 1245,
    jobsCount: 7
  },
  {
    id: 'ORG-1006',
    name: 'NextGen Pvt Ltd.',
    logo: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=100',
    industry: 'Mobile Development',
    companySize: '1-10 employees',
    status: 'Active',
    email: 'contact@nextgen.in',
    phone: '+91 20-3334445',
    website: 'https://nextgen.in',
    location: 'Pune, India',
    description: 'NextGen builds cross-platform mobile apps for tech start-ups.',
    dateCreated: '2023-11-05',
    hrManager: 'Neha Gupta',
    hrCount: 8,
    candidateCount: 985,
    jobsCount: 5
  }
];

export const getOrganizations = () => {
  const data = localStorage.getItem('sa_organizations');
  if (!data) {
    localStorage.setItem('sa_organizations', JSON.stringify(DEFAULT_ORGANIZATIONS));
    return DEFAULT_ORGANIZATIONS;
  }
  return JSON.parse(data);
};

export const saveOrganizations = (orgs) => {
  localStorage.setItem('sa_organizations', JSON.stringify(orgs));
};
