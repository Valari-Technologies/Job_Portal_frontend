const DEFAULT_HR_USERS = [
  {
    id: 'HR-1001',
    name: 'John Doe',
    email: 'john.doe@technova.com',
    role: 'HR',
    organization: 'TechNova Inc.',
    status: 'Active',
    createdDate: 'May 12, 2023',
    lastLogin: 'May 28, 2023'
  },
  {
    id: 'HR-1002',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@innovatn.com',
    role: 'HR',
    organization: 'Innovate Labs',
    status: 'Active',
    createdDate: 'May 10, 2023',
    lastLogin: 'May 28, 2023'
  },
  {
    id: 'HR-1003',
    name: 'Mike Brown',
    email: 'mike.brown@softbuild.com',
    role: 'HR',
    organization: 'SoftBuild Corp.',
    status: 'Active',
    createdDate: 'May 09, 2023',
    lastLogin: 'May 27, 2023'
  },
  {
    id: 'HR-1004',
    name: 'Emily Davis',
    email: 'emily.davis@datax.com',
    role: 'HR',
    organization: 'DataX Systems',
    status: 'Inactive',
    createdDate: 'May 06, 2023',
    lastLogin: 'May 20, 2023'
  },
  {
    id: 'HR-1005',
    name: 'James Lee',
    email: 'james.lee@prima.com',
    role: 'Org Admin',
    organization: 'Prima Solutions',
    status: 'Active',
    createdDate: 'May 03, 2023',
    lastLogin: 'May 28, 2023'
  },
  {
    id: 'HR-1006',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@technova.com',
    role: 'HR',
    organization: 'TechNova Inc.',
    status: 'Active',
    createdDate: 'May 01, 2023',
    lastLogin: 'May 27, 2023'
  },
  {
    id: 'HR-1007',
    name: 'John Doe',
    email: 'john.doe@technova.com',
    role: 'HR',
    organization: 'TechNova Inc.',
    status: 'Active',
    createdDate: 'May 12, 2023',
    lastLogin: 'May 28, 2023'
  },
  {
    id: 'HR-1008',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@innovatn.com',
    role: 'HR',
    organization: 'Innovate Labs',
    status: 'Active',
    createdDate: 'May 10, 2023',
    lastLogin: 'May 28, 2023'
  },
  {
    id: 'HR-1009',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@technova.com',
    role: 'HR',
    organization: 'TechNova Inc.',
    status: 'Active',
    createdDate: 'May 01, 2023',
    lastLogin: 'May 27, 2023'
  }
];

export const getHRUsers = () => {
  const data = localStorage.getItem('sa_hr_users');
  if (!data) {
    localStorage.setItem('sa_hr_users', JSON.stringify(DEFAULT_HR_USERS));
    return DEFAULT_HR_USERS;
  }
  return JSON.parse(data);
};

export const saveHRUsers = (users) => {
  localStorage.setItem('sa_hr_users', JSON.stringify(users));
};
