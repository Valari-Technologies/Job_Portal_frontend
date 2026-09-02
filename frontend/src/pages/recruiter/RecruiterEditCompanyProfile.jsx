import { useState } from 'react';
import RecruiterLayout from '../../components/recruiter/common/RecruiterLayout';
import CompanyProfileEditForm from '../../components/recruiter/companyProfile/CompanyProfileEditForm';
import { getRecruiterCompanyProfileData } from '../../services/recruiter/recruiterCompanyService';

export default function RecruiterEditCompanyProfile() {
  const [profile] = useState(() => getRecruiterCompanyProfileData());

  return (
    <RecruiterLayout activeTab="company-profile">
      <main className="p-4 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
        <CompanyProfileEditForm initialData={profile} />
      </main>
    </RecruiterLayout>
  );
}
