import { useNavigate } from 'react';
import { ArrowLeft } from 'lucide-react';
import RecruiterLayout from '../../components/recruiter/common/RecruiterLayout';
import PostingPlanSelection from '../../components/recruiter/jobs/create/PostingPlanSelection';
import { JobWizardProvider } from '../../components/recruiter/jobs/create/JobWizardProvider';

export default function RecruiterPaymentPlans() {
  const navigate = useNavigate();

  return (
    <JobWizardProvider>
      <RecruiterLayout activeTab="payments">
        <main className="p-4 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
          <div className="flex items-center gap-3 border-b border-slate-150 pb-4">
            <button
              type="button"
              onClick={() => navigate('/recruiter/payments')}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 text-slate-600" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-indigo-950 tracking-tight">Posting Plans & Pricing</h1>
              <p className="text-xs font-bold text-slate-450 mt-0.5">Select a job-posting plan to replenish your credits.</p>
            </div>
          </div>

          <PostingPlanSelection />
        </main>
      </RecruiterLayout>
    </JobWizardProvider>
  );
}
