import { useNavigate } from 'react';
import { ArrowLeft, Briefcase } from 'lucide-react';
import RecruiterLayout from '../../components/recruiter/common/RecruiterLayout';

export default function RecruiterPaymentUsage() {
  const navigate = useNavigate();

  return (
    <RecruiterLayout activeTab="payments">
      <main className="p-4 md:p-8 max-w-5xl w-full mx-auto space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-150 pb-4">
          <button
            type="button"
            onClick={() => navigate('/recruiter/payments')}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-indigo-950 tracking-tight">Plan Usage & Credit History</h1>
            <p className="text-xs font-bold text-slate-450 mt-0.5">Jobs published using your posting entitlements.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-150 p-8 shadow-xs space-y-4 text-center">
          <div className="h-14 w-14 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto">
            <Briefcase className="h-7 w-7" />
          </div>
          <h2 className="text-base font-black text-slate-900">No plan usage yet</h2>
          <p className="text-xs font-medium text-slate-450 max-w-sm mx-auto">
            Jobs published using your posting entitlements will appear here.
          </p>
        </div>
      </main>
    </RecruiterLayout>
  );
}
