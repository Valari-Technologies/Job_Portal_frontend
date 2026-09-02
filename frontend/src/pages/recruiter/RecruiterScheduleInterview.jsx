import { useSearchParams } from 'react-router-dom';
import RecruiterLayout from '../../components/recruiter/common/RecruiterLayout';
import RecruiterInterviewForm from '../../components/recruiter/interviews/RecruiterInterviewForm';
import { getRecruiterInterviewsData } from '../../services/recruiter/recruiterInterviewsService';

export default function RecruiterScheduleInterview() {
  const [searchParams] = useSearchParams();
  const preselectedApplicationId = searchParams.get('application_id');

  const data = getRecruiterInterviewsData();
  const eligibleApplications = data?.eligibleApplications || [];

  return (
    <RecruiterLayout activeTab="interviews">
      <main className="p-4 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
        <RecruiterInterviewForm 
          eligibleApplications={eligibleApplications}
          preselectedApplicationId={preselectedApplicationId}
        />
      </main>
    </RecruiterLayout>
  );
}
