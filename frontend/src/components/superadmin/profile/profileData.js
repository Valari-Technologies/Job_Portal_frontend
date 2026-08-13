const DEFAULT_PROFILE = {
  name: 'Super Admin',
  email: 'superadmin@recruitpro.com',
  phone: '+91 98765 43210',
  designation: 'Super Administrator',
  photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
  role: 'Super Admin',
  status: 'Active',
  createdDate: 'Jan 10, 2025',
  lastLogin: 'May 29, 2025 10:30 AM'
};

export const getProfile = () => {
  const data = localStorage.getItem('sa_profile');
  if (!data) {
    localStorage.setItem('sa_profile', JSON.stringify(DEFAULT_PROFILE));
    return DEFAULT_PROFILE;
  }
  return JSON.parse(data);
};

export const saveProfile = (profile) => {
  localStorage.setItem('sa_profile', JSON.stringify(profile));
  // Dispatch custom event to notify components like Navbar to update avatar immediately
  window.dispatchEvent(new Event('profileUpdate'));
};
