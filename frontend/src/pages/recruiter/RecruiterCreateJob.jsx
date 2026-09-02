import RecruiterLayout from '../../components/recruiter/common/RecruiterLayout';
import JobPostingStepper from '../../components/recruiter/jobs/create/JobPostingStepper';
import JobDetailsForm from '../../components/recruiter/jobs/create/JobDetailsForm';
import { JobWizardProvider } from '../../components/recruiter/jobs/create/JobWizardProvider';

export default function RecruiterCreateJob() {
  return (
    <JobWizardProvider>
      <RecruiterLayout activeTab="jobs">
        <main className="p-4 md:p-8 max-w-5xl w-full mx-auto space-y-6">
          <div className="border-b border-slate-150 pb-4">
            <h1 className="text-2xl md:text-3xl font-black text-indigo-950 tracking-tight">Post a New Job</h1>
            <p className="text-sm font-medium text-slate-450 mt-1">
              Create a new vacancy posting draft for your company.
            </p>
          </div>

          {/* Stepper Header (Step 1 active) */}
          <JobPostingStepper currentStep={1} />

          {/* Step 1 Form */}
          <JobDetailsForm />
        </main>
      </RecruiterLayout>
    </JobWizardProvider>
  );
}
