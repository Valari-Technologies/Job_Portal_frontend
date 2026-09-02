import { useParams, useNavigate } from 'react';
import { ArrowLeft, CreditCard } from 'lucide-react';
import RecruiterLayout from '../../components/recruiter/common/RecruiterLayout';

export default function RecruiterTransactionDetails() {
  const { transactionId } = useParams();
  const navigate = useNavigate();

  return (
    <RecruiterLayout activeTab="payments">
      <main className="p-4 md:p-8 max-w-4xl w-full mx-auto space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-150 pb-4">
          <button
            type="button"
            onClick={() => navigate('/recruiter/payments')}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-indigo-950 tracking-tight">Transaction #{transactionId}</h1>
            <p className="text-xs font-bold text-slate-450 mt-0.5">Billing transaction details</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-150 p-8 shadow-xs text-center space-y-3">
          <CreditCard className="h-8 w-8 text-indigo-600 mx-auto" />
          <h2 className="text-base font-black text-slate-900">Transaction #{transactionId} Record</h2>
          <p className="text-xs font-medium text-slate-450 max-w-sm mx-auto">
            Real billing transaction record details will load from Django API endpoint once backend endpoints are connected.
          </p>
        </div>
      </main>
    </RecruiterLayout>
  );
}
