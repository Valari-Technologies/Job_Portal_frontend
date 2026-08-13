const DEFAULT_ACTIVITIES = [
  {
    id: 'ACT-1001',
    user: 'Super Admin',
    role: 'Super Admin',
    action: 'Created Organization',
    module: 'Organizations',
    dateTime: 'May 29, 2023 10:30 AM',
    ipAddress: '192.168.1.10',
    result: 'Success'
  },
  {
    id: 'ACT-1002',
    user: 'John Doe',
    role: 'HR',
    action: 'Created Job',
    module: 'Jobs',
    dateTime: 'May 29, 2023 09:15 AM',
    ipAddress: '192.168.1.25',
    result: 'Success'
  },
  {
    id: 'ACT-1003',
    user: 'Sarah Wilson',
    role: 'HR',
    action: 'Published Job',
    module: 'Jobs',
    dateTime: 'May 29, 2023 09:05 AM',
    ipAddress: '192.168.1.26',
    result: 'Success'
  },
  {
    id: 'ACT-1004',
    user: 'Rahul Kumar',
    role: 'Candidate',
    action: 'Submitted Application',
    module: 'Applications',
    dateTime: 'May 28, 2023 05:45 PM',
    ipAddress: '192.168.1.45',
    result: 'Success'
  },
  {
    id: 'ACT-1005',
    user: 'Super Admin',
    role: 'Super Admin',
    action: 'Deactivated HR User',
    module: 'Users',
    dateTime: 'May 28, 2023 03:20 PM',
    ipAddress: '192.168.1.10',
    result: 'Success'
  }
];

export const getActivities = () => {
  const data = localStorage.getItem('sa_activities');
  if (!data) {
    localStorage.setItem('sa_activities', JSON.stringify(DEFAULT_ACTIVITIES));
    return DEFAULT_ACTIVITIES;
  }
  return JSON.parse(data);
};

export const logActivity = (user, role, action, module, result = 'Success') => {
  const list = getActivities();
  const newAct = {
    id: `ACT-${list.length + 1001}`,
    user,
    role,
    action,
    module,
    dateTime: new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
    ipAddress: '192.168.1.10',
    result
  };
  localStorage.setItem('sa_activities', JSON.stringify([newAct, ...list]));
};
