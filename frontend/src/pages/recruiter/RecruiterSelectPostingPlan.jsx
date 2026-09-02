import RecruiterLayout from '../../components/recruiter/common/RecruiterLayout';
import JobPostingStepper from '../../components/recruiter/jobs/create/JobPostingStepper';
import PostingPlanSelection from '../../components/recruiter/jobs/create/PostingPlanSelection';
import { JobWizardProvider } from '../../components/recruiter/jobs/create/JobWizardProvider';

export default function RecruiterSelectPostingPlan() {
  return (
    <JobWizardProvider>
      <RecruiterLayout activeTab="jobs">
        <main className="p-4 md:p-8 max-w-5xl w-full mx-auto space-y-6">
          <div className="border-b border-slate-150 pb-4">
            <h1 className="text-2xl md:text-3xl font-black text-indigo-950 tracking-tight">Post a New Job</h1>
            <p className="text-sm font-medium text-slate-450 mt-1">
              Select the visibility plan that matches your hiring urgency.
            </p>
          </div>

          {/* Stepper Header (Step 2 active) */}
          <JobPostingStepper currentStep={2} />

          {/* Step 2 Selection */}
          <PostingPlanSelection />
        </main>
      </RecruiterLayout>
    </JobWizardProvider>
  );
}
