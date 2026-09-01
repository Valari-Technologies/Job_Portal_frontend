import { FileText, Calendar, ChevronRight } from 'lucide-react';

export default function MessagesContext({ selectedConv }) {
  return (
    <div className="rounded-2xl border border-slate-150 bg-white shadow-2xs p-5 flex flex-col justify-between">
      {!selectedConv ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center space-y-3.5 font-sans">
          <div className="h-11 w-11 flex items-center justify-center rounded-full bg-slate-50 border border-slate-100 text-slate-400">
            <FileText className="h-5.5 w-5.5" />
          </div>
          <div className="space-y-1 px-4">
            <h4 className="text-sm font-extrabold text-slate-800">Application context</h4>
            <p className="text-xs font-bold text-slate-455 max-w-xs mx-auto leading-relaxed">
              Application details will appear after you select a conversation.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6 font-sans">
          <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 block">Application context</h3>
          
          {/* Details context parameters grid layout */}
          <div className="space-y-4 text-xs font-bold text-slate-600">
            <div className="flex justify-between items-center">
              <span className="text-slate-455">Job</span>
              <span className="text-slate-900 text-sm font-extrabold">{selectedConv.job.title}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-455">Application status</span>
              <span className="rounded-full px-2 py-0.5 border border-blue-200 bg-blue-50 text-blue-700 text-[10px] font-black uppercase">
                {selectedConv.application_status}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-455">Location</span>
              <span>{selectedConv.candidate.location}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-455">Applied on</span>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span>{selectedConv.applied_at}</span>
              </div>
            </div>
            <div className="space-y-1.5 pt-2">
              <span className="text-slate-455 block">Candidate skills</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedConv.candidate.skills.map((skill) => (
                  <span key={skill} className="rounded bg-slate-100 text-slate-700 px-2 py-0.5 text-[10px]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Direct Detail Action */}
          <div className="border-t border-slate-100 pt-4">
            <button className="w-full rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold py-3 text-sm transition-colors flex items-center justify-center gap-1.5">
              <span>View application</span>
              <ChevronRight className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
