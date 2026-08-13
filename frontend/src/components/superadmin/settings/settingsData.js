const DEFAULT_SETTINGS = {
  platformName: 'RecruitPro',
  platformLogo: '',
  defaultLanguage: 'English',
  timeZone: '(GMT-05:30) Asia/Kolkata',
  dateFormat: 'DD MMM YYYY',
  smtpHost: 'smtp.recruitpro.com',
  smtpPort: '587',
  emailAddress: 'no-reply@recruitpro.com',
  encryption: 'TLS',
  twoFactor: true,
  userRegistration: true,
  jobPosting: true,
  applicationSubmission: true,
  maintenanceMode: false
};

export const getSettings = () => {
  const data = localStorage.getItem('sa_settings');
  if (!data) {
    localStorage.setItem('sa_settings', JSON.stringify(DEFAULT_SETTINGS));
    return DEFAULT_SETTINGS;
  }
  return JSON.parse(data);
};

export const saveSettings = (settings) => {
  localStorage.setItem('sa_settings', JSON.stringify(settings));
};
