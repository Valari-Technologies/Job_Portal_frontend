import { useState, useEffect } from 'react';
import RecruiterLayout from '../../components/recruiter/common/RecruiterLayout';
import CompanyProfileEditForm from '../../components/recruiter/companyProfile/CompanyProfileEditForm';
import { getRecruiterCompanyProfileData, fetchEmployerProfileService } from '../../services/recruiter/recruiterCompanyService';

export default function RecruiterEditCompanyProfile() {
  const [profile, setProfile] = useState(() => getRecruiterCompanyProfileData());

  useEffect(() => {
    let active = true;
    async function loadData() {
      const data = await fetchEmployerProfileService();
      if (active && data) {
        setProfile(getRecruiterCompanyProfileData(data));
      }
    }
    loadData();
    return () => { active = false; };
  }, []);

  return (
    <RecruiterLayout activeTab="company-profile">
      <main className="p-4 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
        <CompanyProfileEditForm key={profile.company_name + (profile.company_email || '')} initialData={profile} />
      </main>
    </RecruiterLayout>
  );
}
