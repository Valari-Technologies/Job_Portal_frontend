import { useState } from 'react';
import { useParams } from 'react-router-dom';
import RecruiterLayout from '../../components/recruiter/common/RecruiterLayout';
import CandidateDetailsHeader from '../../components/recruiter/candidates/details/CandidateDetailsHeader';
import CandidateProfileCard from '../../components/recruiter/candidates/details/CandidateProfileCard';
import CandidateSkillsCard from '../../components/recruiter/candidates/details/CandidateSkillsCard';
import CandidateExperienceCard from '../../components/recruiter/candidates/details/CandidateExperienceCard';
import CandidateEducationCard from '../../components/recruiter/candidates/details/CandidateEducationCard';
import CandidateTimelineCard from '../../components/recruiter/candidates/details/CandidateTimelineCard';
import CandidateInterviewFeedbackCard from '../../components/recruiter/candidates/details/CandidateInterviewFeedbackCard';
import { updateApplicationStatusService } from '../../services/recruiter/recruiterApplicationsService';

export default function RecruiterCandidateDetails() {
  const { candidateId, applicationId } = useParams();
  
  const [candidateData, setCandidateData] = useState({
    candidate: {
      id: candidateId,
      full_name: 'Candidate Profile',
      current_title: 'Applicant',
      location: 'Location Not Specified',
      willing_to_relocate: false,
      email: null,
      phone: null
    },
    application_status: 'APPLIED',
    resume_url: null,
    skills: [],
    experiences: [],
    educations: [],
    history: [],
    feedback: []
  });

  const handleUpdateStatus = async (newStatus) => {
    try {
      await updateApplicationStatusService(applicationId, newStatus);
      setCandidateData(prev => ({
        ...prev,
        application_status: newStatus
      }));
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const { candidate, application_status, resume_url, skills, experiences, educations, history, feedback } = candidateData;

  return (
    <RecruiterLayout activeTab="candidates">
      <main className="p-4 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Header with Name, Current Stage & Dynamic Actions */}
        <CandidateDetailsHeader 
          candidateName={candidate.full_name}
          currentTitle={candidate.current_title}
          currentStage={application_status}
          onUpdateStatus={handleUpdateStatus}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Profile Card & Top Skills */}
          <div className="space-y-6">
            <CandidateProfileCard candidate={candidate} resumeUrl={resume_url} />
            <CandidateSkillsCard skills={skills} />
          </div>

          {/* Right Column: Experience, Education, Timeline, Interview Feedback */}
          <div className="lg:col-span-2 space-y-6">
            <CandidateExperienceCard experiences={experiences} />
            <CandidateEducationCard educations={educations} />
            <CandidateTimelineCard history={history} />
            <CandidateInterviewFeedbackCard feedback={feedback} />
          </div>
        </div>
      </main>
    </RecruiterLayout>
  );
}
