import { Briefcase } from 'lucide-react';

export default function JobsTable({ jobsList = [] }) {
  return (
    <div className="rounded-2xl border border-slate-150 bg-white shadow-2xs overflow-hidden">
      <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-base font-extrabold text-slate-900">Your job posts</h3>
      </div>

      {jobsList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-150 text-slate-400">
            <Briefcase className="h-6 w-6" />
          </div>
          <div className="space-y-1.5 px-4">
            <h4 className="text-base font-extrabold text-slate-800">No job posts yet</h4>
            <p className="text-sm font-bold text-slate-500 max-w-sm mx-auto leading-normal">
              Complete verification, then create your first job post.
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-150">
                <th className="px-6 py-3.5">Job title</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Location</th>
                <th className="px-6 py-3.5 text-center">Applications</th>
                <th className="px-6 py-3.5">Deadline</th>
                <th className="px-6 py-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {/* Rendered map items will go here in the future */}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
