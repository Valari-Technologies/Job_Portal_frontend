import { Calendar } from 'lucide-react';

export default function InterviewsList({ interviewsList = [] }) {
  return (
    <div className="rounded-2xl border border-slate-150 bg-white shadow-2xs overflow-hidden">
      <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-base font-extrabold text-slate-900 font-sans">Scheduled interviews</h3>
      </div>

      {interviewsList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-150 text-slate-400">
            <Calendar className="h-6 w-6" />
          </div>
          <div className="space-y-1.5 px-4 font-sans">
            <h4 className="text-base font-extrabold text-slate-800">No scheduled interviews</h4>
            <p className="text-sm font-bold text-slate-500 max-w-sm mx-auto leading-normal">
              Scheduled interviews with candidates will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          {/* Calendar slots grid render map will go here in the future */}
        </div>
      )}
    </div>
  );
}
