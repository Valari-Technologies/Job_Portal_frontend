import { CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PaymentMethodCard({ lastMethod }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-150 p-6 space-y-4 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-slate-500" />
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">Payment Method</h3>
        </div>
        <Link to="/recruiter/company-profile" className="text-xs font-bold text-indigo-600 hover:underline">
          Edit
        </Link>
      </div>

      {lastMethod ? (
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex items-center gap-4">
          <div className="h-9 w-12 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center tracking-wider">
            {lastMethod.type || 'CARD'}
          </div>
          <div>
            <p className="text-xs font-mono font-bold text-slate-800">•••• •••• •••• {lastMethod.last4 || '4242'}</p>
            {lastMethod.expiry && (
              <p className="text-[11px] font-bold text-slate-450 mt-0.5">Expires {lastMethod.expiry}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-center">
          <p className="text-xs font-semibold text-slate-500">No payment method used yet.</p>
        </div>
      )}
    </div>
  );
}
