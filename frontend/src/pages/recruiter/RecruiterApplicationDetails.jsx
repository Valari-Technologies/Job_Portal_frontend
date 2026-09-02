import { useParams, useNavigate } from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import RecruiterLayout from '../../components/recruiter/common/RecruiterLayout';
import ApplicationStatusBadge from '../../components/recruiter/applications/ApplicationStatusBadge';

export default function RecruiterApplicationDetails() {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  return (
    <RecruiterLayout activeTab="applications">
      <main className="p-4 md:p-8 max-w-4xl w-full mx-auto space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-150 pb-4">
          <button
            type="button"
            onClick={() => navigate('/recruiter/applications')}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-indigo-950 tracking-tight">Application #{applicationId}</h1>
            <p className="text-xs font-bold text-slate-450 mt-0.5">Application details view</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-150 p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Application Records</h2>
              <p className="text-xs font-bold text-slate-500 mt-0.5">Scoped to your company job application pipeline.</p>
            </div>
            <ApplicationStatusBadge status="APPLIED" />
          </div>

          <div className="bg-slate-50 rounded-xl p-6 text-center space-y-2 border border-slate-200">
            <FileText className="h-8 w-8 text-indigo-600 mx-auto" />
            <h3 className="text-sm font-black text-slate-800">Application #{applicationId} record</h3>
            <p className="text-xs font-medium text-slate-500 max-w-sm mx-auto">
              Real application details will load from Django API endpoint once backend endpoints are connected.
            </p>
          </div>
        </div>
      </main>
    </RecruiterLayout>
  );
}
