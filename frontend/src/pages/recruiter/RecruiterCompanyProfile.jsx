import { useState, useEffect } from 'react';
import RecruiterLayout from '../../components/recruiter/common/RecruiterLayout';
import CompanyProfileHeader from '../../components/recruiter/companyProfile/CompanyProfileHeader';
import CompanySummaryCard from '../../components/recruiter/companyProfile/CompanySummaryCard';
import CompanyContactCard from '../../components/recruiter/companyProfile/CompanyContactCard';
import CompanyAboutCard from '../../components/recruiter/companyProfile/CompanyAboutCard';
import RecruitingTeamSection from '../../components/recruiter/companyProfile/RecruitingTeamSection';
import { getRecruiterCompanyProfileData, fetchEmployerProfileService } from '../../services/recruiter/recruiterCompanyService';

export default function RecruiterCompanyProfile() {
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
        {/* 1. Header */}
        <CompanyProfileHeader />

        {/* 2. Top Row: Summary Card & Contact Info Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CompanySummaryCard companyProfile={profile} />
          </div>
          <div>
            <CompanyContactCard companyProfile={profile} />
          </div>
        </div>

        {/* 3. About Us Section */}
        <CompanyAboutCard description={profile.company_description} />

        {/* 4. Recruiting Team Section */}
        <RecruitingTeamSection team={profile.recruiting_team} />
      </main>
    </RecruiterLayout>
  );
}
