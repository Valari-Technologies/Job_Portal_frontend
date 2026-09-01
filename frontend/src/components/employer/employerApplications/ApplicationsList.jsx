import { FileText } from 'lucide-react';

export default function ApplicationsList({
  applicationsList = [],
}) {
  return (
    <div className="rounded-2xl border border-slate-150 bg-white shadow-2xs overflow-hidden">
      <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-base font-extrabold text-slate-900">Candidates list</h3>
      </div>

      {applicationsList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
          <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-150 text-slate-400">
            <FileText className="h-6 w-6" />
          </div>
          <div className="space-y-1.5 px-4">
            <h4 className="text-base font-extrabold text-slate-800">No applications received</h4>
            <p className="text-sm font-bold text-slate-500 max-w-sm mx-auto leading-normal">
              Candidate applications will appear here once job vacancies are verified and published.
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          {/* Applications list render map will go here */}
        </div>
      )}
    </div>
  );
}
