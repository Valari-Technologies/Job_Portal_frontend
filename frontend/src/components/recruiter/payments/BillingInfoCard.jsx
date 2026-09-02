import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BillingInfoCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-xs flex flex-col items-center justify-center text-center space-y-3">
      <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
        <FileText className="h-6 w-6" />
      </div>
      <p className="text-xs font-bold text-slate-500 max-w-xs leading-relaxed">
        Need to update your billing address for future invoices? You can manage company details in your profile.
      </p>
      <Link
        to="/recruiter/company-profile"
        className="text-xs font-black text-indigo-600 hover:underline pt-1"
      >
        Manage Company Details →
      </Link>
    </div>
  );
}
