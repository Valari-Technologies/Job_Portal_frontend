import { useState } from 'react';
import { Edit3 } from 'lucide-react';
import EmployerLayout from '../../../components/employer/common/EmployerLayout';
import ProfileStatusCard from '../../../components/employer/employerCompanyProfile/ProfileStatusCard';
import ProfileInfoCards from '../../../components/employer/employerCompanyProfile/ProfileInfoCards';
import ProfileEditModal from '../../../components/employer/employerCompanyProfile/ProfileEditModal';

// Future Django API:
// GET /api/employer/company-profile/
// PATCH /api/employer/company-profile/
// Store the normalized API response in React state.
// Backend database remains the source of truth.

export default function EmployerCompanyProfile() {
  const [companyProfile] = useState(null); // Initial empty state
  const [isEditing, setIsEditing] = useState(false);

  // Controlled form states
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formSize, setFormSize] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formState, setFormState] = useState('');
  const [formDistrict, setFormDistrict] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formLocality, setFormLocality] = useState('');
  const [formContactPerson, setFormContactPerson] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formWebsite, setFormWebsite] = useState('');

  const [formErrors, setFormErrors] = useState({});

  const profilePercent = companyProfile?.company?.profile_completion || 0;

  const handleSave = (e) => {
    e.preventDefault();
    const errors = {};
    if (!formName) errors.name = 'Company name is required';
    if (!formEmail) errors.email = 'Company email is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // TODO: Connect Django Company Profile Update:
    // PATCH /api/employer/company-profile/
    // Payloads: { company_name: formName, company_email: formEmail, ... }
    
    setIsEditing(false);
  };

  return (
    <EmployerLayout activeTab="profile" breadcrumbTitle="Company profile">
      <main className="flex-1 p-4 md:p-8 space-y-6 max-w-7xl w-full mx-auto pb-24 lg:pb-8">
        
        {/* Page Heading & Main Action buttons */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Company profile</h1>
            <p className="text-sm md:text-base font-bold text-slate-500 mt-1">Keep your company information accurate and trustworthy.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              disabled 
              className="w-full md:w-auto rounded-xl border border-slate-200 bg-slate-50 text-slate-400 font-extrabold px-4.5 py-2.5 text-sm cursor-not-allowed transition-colors"
            >
              Preview public profile
            </button>
            <button 
              onClick={() => setIsEditing(true)}
              className="w-full md:w-auto rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-4.5 py-2.5 text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Edit3 className="h-4 w-4" />
              <span>Edit profile</span>
            </button>
          </div>
        </div>

        {/* 1. Main Setup Profile Status card */}
        <ProfileStatusCard profilePercent={profilePercent} />

        {/* 2. Preferences & Trust validation info cards */}
        <ProfileInfoCards />

        {/* 3. Edit company details modal dialog popups */}
        <ProfileEditModal 
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          handleSave={handleSave}
          formName={formName}
          setFormName={setFormName}
          formCategory={formCategory}
          setFormCategory={setFormCategory}
          formSize={formSize}
          setFormSize={setFormSize}
          formWebsite={formWebsite}
          setFormWebsite={setFormWebsite}
          formEmail={formEmail}
          setFormEmail={setFormEmail}
          formPhone={formPhone}
          setFormPhone={setFormPhone}
          formContactPerson={formContactPerson}
          setFormContactPerson={setFormContactPerson}
          formAddress={formAddress}
          setFormAddress={setFormAddress}
          formState={formState}
          setFormState={setFormState}
          formDistrict={formDistrict}
          setFormDistrict={setFormDistrict}
          formCity={formCity}
          setFormCity={setFormCity}
          formLocality={formLocality}
          setFormLocality={setFormLocality}
          formDesc={formDesc}
          setFormDesc={setFormDesc}
          formErrors={formErrors}
        />

      </main>
    </EmployerLayout>
  );
}
